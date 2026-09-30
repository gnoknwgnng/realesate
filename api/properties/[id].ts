import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeQuery, isNeonConfigured, store } from '../lib/neon';
import { deleteFromR2 } from '../lib/r2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const propId = Array.isArray(id) ? id[0] : id;

  if (!propId) {
    return res.status(400).json({ error: 'Property id is required' });
  }

  // GET /api/properties/[id]
  if (req.method === 'GET') {
    try {
      if (isNeonConfigured) {
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
        const result = await executeQuery(sql, [propId]);
        if (result.rows.length > 0) {
          return res.status(200).json({ success: true, property: result.rows[0] });
        }
      }

      const prop = store.getPropertyById(propId);
      if (!prop) {
        return res.status(404).json({ error: 'Property not found' });
      }
      return res.status(200).json({ success: true, property: prop });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // DELETE /api/properties/[id]
  if (req.method === 'DELETE') {
    try {
      if (isNeonConfigured) {
        // Delete associated Cloudflare R2 images first
        const imgRes = await executeQuery('SELECT r2_key FROM property_images WHERE property_id = $1', [propId]);
        for (const row of imgRes.rows) {
          if (row.r2_key) {
            await deleteFromR2(row.r2_key);
          }
        }

        await executeQuery('DELETE FROM properties WHERE id = $1', [propId]);
        return res.status(200).json({ success: true, message: 'Property deleted from Neon and R2.' });
      }

      const success = store.deleteProperty(propId);
      return res.status(200).json({
        success,
        message: success ? 'Property deleted successfully.' : 'Property not found.',
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
