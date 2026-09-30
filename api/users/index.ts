import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeQuery, isNeonConfigured, store } from '../lib/neon';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (isNeonConfigured) {
      const result = await executeQuery(
        `SELECT id, email, role, full_name, phone, medical_council_reg_no, specialty, hospital, city, status, last_active_at, created_at 
         FROM users 
         ORDER BY created_at DESC`
      );
      if (result.rows.length > 0) {
        return res.status(200).json({ users: result.rows });
      }
    }

    const users = store.getUsers();
    return res.status(200).json({ users });
  } catch (err: any) {
    console.error('Error fetching users in serverless function:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch users' });
  }
}
