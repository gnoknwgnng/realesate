import { Router, Request, Response } from 'express';
import { query, isDbConnected } from '../db';
import { store } from '../data/store';

const router = Router();

// GET favorites for a specific user
router.get('/', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id query parameter is required' });
    }

    if (isDbConnected()) {
      const result = await query(
        `SELECT f.*, p.* 
         FROM favorites f
         JOIN properties p ON f.property_id = p.id
         WHERE f.user_id = $1
         ORDER BY f.created_at DESC`,
        [user_id]
      );
      return res.json({ favorites: result.rows });
    }

    const favs = store.getFavorites(user_id as string);
    res.json({ favorites: favs });
  } catch (err: any) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch favorites' });
  }
});

// POST toggle favorite (add or remove)
router.post('/toggle', async (req: Request, res: Response) => {
  try {
    const { property_id, user_id } = req.body;
    if (!property_id || !user_id) {
      return res.status(400).json({ error: 'property_id and user_id are required' });
    }

    if (isDbConnected()) {
      const existing = await query(
        `SELECT * FROM favorites WHERE property_id = $1 AND user_id = $2`,
        [property_id, user_id]
      );

      if (existing.rows.length > 0) {
        await query(
          `DELETE FROM favorites WHERE property_id = $1 AND user_id = $2`,
          [property_id, user_id]
        );
        return res.json({ favorited: false, message: 'Removed from favorites' });
      } else {
        await query(
          `INSERT INTO favorites (property_id, user_id) VALUES ($1, $2)`,
          [property_id, user_id]
        );
        return res.json({ favorited: true, message: 'Added to favorites' });
      }
    }

    const result = store.toggleFavorite(property_id, user_id);
    res.json(result);
  } catch (err: any) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ error: err.message || 'Failed to toggle favorite' });
  }
});

export default router;
