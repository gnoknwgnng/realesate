import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeQuery, isNeonConfigured, store } from '../lib/neon';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, role, full_name, hospital, phone } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const assignedRole =
      email.toLowerCase().includes('superadmin') || role === 'superadmin'
        ? 'superadmin'
        : role || 'doctor';
    const name = full_name || email.split('@')[0];

    if (isNeonConfigured) {
      const existing = await executeQuery(`SELECT * FROM users WHERE email = $1`, [email]);
      let user;

      if (existing.rows.length > 0) {
        const updateRes = await executeQuery(
          `UPDATE users 
           SET status = 'online', last_active_at = NOW(), role = COALESCE($2, role), full_name = COALESCE($3, full_name)
           WHERE email = $1 
           RETURNING *`,
          [email, assignedRole, name]
        );
        user = updateRes.rows[0];
      } else {
        const insertRes = await executeQuery(
          `INSERT INTO users (email, role, full_name, hospital, phone, status, last_active_at)
           VALUES ($1, $2, $3, $4, $5, 'online', NOW())
           RETURNING *`,
          [email, assignedRole, name, hospital || null, phone || null]
        );
        user = insertRes.rows[0];
      }

      if (user) {
        return res.status(200).json({ success: true, user });
      }
    }

    // Local fallback
    const existing = store.getUserByEmail(email);
    let user;
    if (existing) {
      user = store.updateUser(existing.id, {
        status: 'online',
        last_active_at: new Date().toISOString(),
        role: assignedRole,
        full_name: name,
      });
    } else {
      user = store.createUser({
        email,
        role: assignedRole,
        full_name: name,
        hospital,
        phone,
        status: 'online',
        last_active_at: new Date().toISOString(),
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (err: any) {
    console.error('Error in login function:', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
}
