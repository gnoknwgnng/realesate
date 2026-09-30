import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeQuery, isNeonConfigured, store } from './lib/neon';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET /api/favorites?user_id=xyz
  if (req.method === 'GET') {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }

      if (isNeonConfigured) {
        const result = await executeQuery(
          `SELECT f.*, p.* 
           FROM favorites f
           JOIN properties p ON f.property_id = p.id
           WHERE f.user_id = $1
           ORDER BY f.created_at DESC`,
          [user_id]
        );
        return res.status(200).json({ favorites: result.rows });
      }

      const favs = store.getFavorites(user_id as string);
      return res.status(200).json({ favorites: favs });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST /api/favorites (toggle)
  if (req.method === 'POST') {
    try {
      const { property_id, user_id } = req.body || {};
      if (!property_id || !user_id) {
        return res.status(400).json({ error: 'property_id and user_id are required' });
      }

      if (isNeonConfigured) {
        const existing = await executeQuery(
          `SELECT * FROM favorites WHERE property_id = $1 AND user_id = $2`,
          [property_id, user_id]
        );

        if (existing.rows.length > 0) {
          await executeQuery(
            `DELETE FROM favorites WHERE property_id = $1 AND user_id = $2`,
            [property_id, user_id]
          );
          return res.status(200).json({ favorited: false, message: 'Removed from favorites' });
        } else {
          await executeQuery(
            `INSERT INTO favorites (property_id, user_id) VALUES ($1, $2)`,
            [property_id, user_id]
          );
          return res.status(200).json({ favorited: true, message: 'Added to favorites' });
        }
      }

      const result = store.toggleFavorite(property_id, user_id);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
