import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeQuery, isNeonConfigured, store } from './lib/neon';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      if (isNeonConfigured) {
        const result = await executeQuery(`SELECT * FROM leads ORDER BY created_at DESC`);
        return res.status(200).json({ leads: result.rows });
      }

      const leads = store.getLeads();
      return res.status(200).json({ leads });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch leads' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { email, type } = req.body || {};
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (isNeonConfigured) {
        const result = await executeQuery(
          `INSERT INTO leads (email, type) VALUES ($1, $2) RETURNING *`,
          [email, type || 'landlord']
        );
        return res.status(201).json({ success: true, lead: result.rows[0] });
      }

      const lead = store.createLead({ email, type: type || 'landlord' });
      return res.status(201).json({ success: true, lead });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to create lead' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
