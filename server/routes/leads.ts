import { Router, Request, Response } from 'express';
import { query, isDbConnected } from '../db';
import { store } from '../data/store';

const router = Router();

// GET all leads (superadmin / landlord network)
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const result = await query(`SELECT * FROM leads ORDER BY created_at DESC`);
      return res.json({ leads: result.rows });
    }

    const leads = store.getLeads();
    res.json({ leads });
  } catch (err: any) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch leads' });
  }
});

// POST new lead (e.g. landlord network newsletter/join)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (isDbConnected()) {
      const result = await query(
        `INSERT INTO leads (email, type) VALUES ($1, $2) RETURNING *`,
        [email, type || 'landlord']
      );
      return res.status(201).json({ success: true, lead: result.rows[0] });
    }

    const lead = store.createLead({ email, type: type || 'landlord' });
    res.status(201).json({ success: true, lead });
  } catch (err: any) {
    console.error('Error creating lead:', err);
    res.status(500).json({ error: err.message || 'Failed to create lead' });
  }
});

export default router;
