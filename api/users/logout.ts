import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeQuery, isNeonConfigured, store } from '../lib/neon';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, id } = req.body || {};

    if (isNeonConfigured) {
      if (id) {
        await executeQuery(`UPDATE users SET status = 'offline' WHERE id = $1`, [id]);
      } else if (email) {
        await executeQuery(`UPDATE users SET status = 'offline' WHERE email = $1`, [email]);
      }
      return res.status(200).json({ success: true });
    }

    if (id) {
      store.updateUser(id, { status: 'offline' });
    } else if (email) {
      const u = store.getUserByEmail(email);
      if (u) store.updateUser(u.id, { status: 'offline' });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Logout failed' });
  }
}
