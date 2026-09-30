import { Router, Request, Response } from 'express';
import { query, isDbConnected } from '../db';
import { store } from '../data/store';

const router = Router();

// GET all inquiries (or filter by property_id)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { property_id } = req.query;

    if (isDbConnected()) {
      let q = `
        SELECT i.*, p.title as property_title, p.city as property_city 
        FROM inquiries i
        LEFT JOIN properties p ON i.property_id = p.id
      `;
      const params: any[] = [];
      if (property_id) {
        q += ` WHERE i.property_id = $1`;
        params.push(property_id);
      }
      q += ` ORDER BY i.created_at DESC`;
      const result = await query(q, params);
      return res.json({ inquiries: result.rows });
    }

    let inquiries = store.getInquiries();
    if (property_id) {
      inquiries = inquiries.filter((inq) => inq.property_id === property_id);
    }
    res.json({ inquiries });
  } catch (err: any) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch inquiries' });
  }
});

// POST new inquiry / booking
router.post('/', async (req: Request, res: Response) => {
  try {
    const { property_id, name, email, phone, medical_role, tour_date, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    if (isDbConnected()) {
      const result = await query(
        `INSERT INTO inquiries (property_id, name, email, phone, medical_role, tour_date, message)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [property_id || null, name, email, phone || null, medical_role || null, tour_date || null, message || null]
      );
      return res.status(201).json({ success: true, inquiry: result.rows[0] });
    }

    const inquiry = store.createInquiry({
      property_id,
      name,
      email,
      phone,
      medical_role,
      tour_date,
      message,
    });

    res.status(201).json({ success: true, inquiry });
  } catch (err: any) {
    console.error('Error creating inquiry:', err);
    res.status(500).json({ error: err.message || 'Failed to create inquiry' });
  }
});

export default router;
