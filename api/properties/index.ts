import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeQuery, isNeonConfigured, store } from '../lib/neon';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const {
        category,
        city,
        beds,
        search,
        page = '1',
        limit = '50',
      } = req.query as Record<string, string>;

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
      const offset = (pageNum - 1) * limitNum;

      if (isNeonConfigured) {
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

        const result = await executeQuery(sql, params);
        if (result.rows.length > 0) {
          return res.status(200).json({
            success: true,
            properties: result.rows,
            data: result.rows,
            page: pageNum,
            limit: limitNum,
            source: 'neon_postgresql',
          });
        }
      }

      // Local fallback
      let list = store.getProperties();

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
      return res.status(200).json({
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
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const newProp = {
        id: body.id || crypto.randomUUID(),
        title: body.title,
        address: body.address,
        city: body.city || 'Bengaluru',
        state: body.state || 'KA',
        price: parseFloat(body.price),
        period: body.period || 'month',
        beds: parseInt(body.beds, 10),
        baths: parseFloat(body.baths),
        dimensions: body.dimensions || '1,500 sq.ft',
        image_url: body.image_url || '',
        category: body.category || 'rent',
        property_type: body.property_type || 'Apartment',
        description: body.description || '',
        hospital_distance: body.hospital_distance || '',
        virtual_tour_url: body.virtual_tour_url || null,
        owner_email: body.owner_email || null,
        owner_id: body.owner_id || null,
        status: body.status || 'active',
        is_popular: Boolean(body.is_popular),
        created_at: new Date().toISOString(),
      };

      if (isNeonConfigured) {
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
          newProp.period,
          newProp.beds,
          newProp.baths,
          newProp.dimensions,
          newProp.image_url,
          newProp.is_popular,
          newProp.category,
          newProp.property_type,
          newProp.description,
          newProp.hospital_distance,
          newProp.virtual_tour_url,
          newProp.owner_email,
          newProp.owner_id,
          newProp.status,
        ];

        const result = await executeQuery(insertSql, values);
        const created = result.rows[0];

        // Insert gallery images into property_images
        if (Array.isArray(body.images) && body.images.length > 0) {
          for (let i = 0; i < body.images.length; i++) {
            const img = body.images[i];
            await executeQuery(
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

        if (created) {
          return res.status(201).json({ success: true, property: created });
        }
      }

      // Local fallback
      const created = store.createProperty(newProp);
      return res.status(201).json({ success: true, property: created });
    } catch (err: any) {
      console.error('Error creating property:', err);
      return res.status(500).json({ error: err.message || 'Failed to create property' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
