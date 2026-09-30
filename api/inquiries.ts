import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeQuery, isNeonConfigured, store } from './lib/neon';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const { property_id } = req.query;

      if (isNeonConfigured) {
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
        const result = await executeQuery(q, params);
        return res.status(200).json({ inquiries: result.rows });
      }

      let inquiries = store.getInquiries();
      if (property_id) {
        inquiries = inquiries.filter((inq) => inq.property_id === property_id);
      }
      return res.status(200).json({ inquiries });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch inquiries' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { property_id, name, email, phone, medical_role, tour_date, message } = req.body || {};

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      if (isNeonConfigured) {
        const result = await executeQuery(
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

      return res.status(201).json({ success: true, inquiry });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to create inquiry' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
