import { Router, Request, Response } from 'express';
import { query, isDbConnected } from '../db';
import { localStore } from '../data/store';
import { Property } from '../../src/types';
import { deleteFromR2 } from '../r2';
import crypto from 'crypto';

export const propertiesRouter = Router();

// GET /api/properties (with search, filtering, pagination)
propertiesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      category,
      city,
      beds,
      search,
      page = '1',
      limit = '50',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    if (isDbConnected()) {
      let sql = `
        SELECT 
          p.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', pi.id,
                'r2_key', pi.r2_key,
                'r2_url', pi.r2_url,
                'is_primary', pi.is_primary,
                'display_order', pi.display_order
              ) ORDER BY pi.display_order ASC
            ) FILTER (WHERE pi.id IS NOT NULL),
            '[]'
          ) as images
        FROM properties p
        LEFT JOIN property_images pi ON p.id = pi.property_id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIdx = 1;

      if (category && category !== 'all') {
        sql += ` AND p.category = $${paramIdx++}`;
        params.push(category);
      }

      if (city && city !== 'all') {
        sql += ` AND LOWER(p.city) LIKE $${paramIdx++}`;
        params.push(`%${city.toLowerCase()}%`);
      }

      if (beds && beds !== 'all') {
        sql += ` AND p.beds >= $${paramIdx++}`;
        params.push(parseInt(beds, 10));
      }

      if (search && search.trim()) {
        const term = `%${search.toLowerCase().trim()}%`;
        sql += ` AND (LOWER(p.title) LIKE $${paramIdx} OR LOWER(p.address) LIKE $${paramIdx} OR LOWER(p.city) LIKE $${paramIdx})`;
        params.push(term);
        paramIdx++;
      }

      sql += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
      params.push(limitNum, offset);

      const result = await query(sql, params);
      return res.json({
        success: true,
        properties: result.rows,
        data: result.rows,
        page: pageNum,
        limit: limitNum,
        source: 'postgresql',
      });
    }

    // Fallback store
    let list = localStore.getProperties();

    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }
    if (city && city !== 'all') {
      list = list.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (beds && beds !== 'all') {
      list = list.filter((p) => p.beds >= parseInt(beds, 10));
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }

    const paginated = list.slice(offset, offset + limitNum);
    return res.json({
      success: true,
      properties: paginated,
      data: paginated,
      total: list.length,
      page: pageNum,
      limit: limitNum,
      source: 'local_persistence',
    });
  } catch (err: any) {
    console.error('Error in GET /api/properties:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// GET /api/properties/:id
propertiesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const sql = `
        SELECT 
          p.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', pi.id,
                'r2_key', pi.r2_key,
                'r2_url', pi.r2_url,
                'is_primary', pi.is_primary,
                'display_order', pi.display_order
              ) ORDER BY pi.display_order ASC
            ) FILTER (WHERE pi.id IS NOT NULL),
            '[]'
          ) as images
        FROM properties p
        LEFT JOIN property_images pi ON p.id = pi.property_id
        WHERE p.id = $1
        GROUP BY p.id
      `;
      const result = await query(sql, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      return res.json(result.rows[0]);
    }

    const item = localStore.getProperties().find((p) => p.id === id);
    if (!item) return res.status(404).json({ error: 'Property not found' });
    return res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/properties
propertiesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const propertyId = body.id || crypto.randomUUID();

    const newProp: Property = {
      ...body,
      id: propertyId,
      created_at: new Date().toISOString(),
      price: parseFloat(body.price),
      beds: parseInt(body.beds, 10),
      baths: parseFloat(body.baths),
      status: body.status || 'active',
      category: body.category || 'rent',
    };

    if (isDbConnected()) {
      const insertSql = `
        INSERT INTO properties (
          id, title, address, city, state, price, period, beds, baths,
          dimensions, image_url, is_popular, category, property_type,
          description, hospital_distance, virtual_tour_url, owner_email, owner_id, status, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW()
        ) RETURNING *
      `;
      const values = [
        newProp.id,
        newProp.title,
        newProp.address,
        newProp.city,
        newProp.state,
        newProp.price,
        newProp.period || 'month',
        newProp.beds,
        newProp.baths,
        newProp.dimensions,
        newProp.image_url,
        newProp.is_popular || false,
        newProp.category,
        newProp.property_type,
        newProp.description,
        newProp.hospital_distance,
        newProp.virtual_tour_url || null,
        newProp.owner_email || null,
        newProp.owner_id || null,
        newProp.status || 'active',
      ];

      const result = await query(insertSql, values);
      const created = result.rows[0];

      // If multiple R2 images were provided, insert into property_images
      if (Array.isArray(body.images) && body.images.length > 0) {
        for (let i = 0; i < body.images.length; i++) {
          const img = body.images[i];
          await query(
            `INSERT INTO property_images (property_id, r2_key, r2_url, is_primary, display_order, file_name, file_size, mime_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              newProp.id,
              img.r2_key || img.key,
              img.r2_url || img.url,
              img.is_primary ?? (i === 0),
              i,
              img.file_name || img.fileName || null,
              img.file_size || img.fileSize || null,
              img.mime_type || img.mimeType || null,
            ]
          );
        }
      }

      return res.status(201).json({ success: true, property: created });
    }

    // Local fallback
    const created = localStore.createProperty(newProp);
    return res.status(201).json({ success: true, property: created });
  } catch (err: any) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/properties/:id
propertiesRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      // Find associated R2 images to delete from Cloudflare R2
      const imgRes = await query('SELECT r2_key FROM property_images WHERE property_id = $1', [id]);
      for (const row of imgRes.rows) {
        if (row.r2_key) {
          await deleteFromR2(row.r2_key);
        }
      }

      await query('DELETE FROM properties WHERE id = $1', [id]);
      return res.json({ success: true, message: 'Property deleted from PostgreSQL and R2.' });
    }

    const success = localStore.deleteProperty(id);
    return res.json({ success, message: success ? 'Property deleted successfully.' : 'Property not found.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default propertiesRouter;
