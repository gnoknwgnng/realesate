import { Router, Request, Response } from 'express';
import { query, isDbConnected } from '../db';
import { store } from '../data/store';

const router = Router();

// GET all users (with SuperAdmin inspection support)
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const result = await query(
        `SELECT id, email, role, full_name, phone, medical_council_reg_no, specialty, hospital, city, status, last_active_at, created_at 
         FROM users 
         ORDER BY created_at DESC`
      );
      return res.json({ users: result.rows });
    }

    const users = store.getUsers();
    return res.json({ users });
  } catch (err: any) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch users' });
  }
});

// GET users summary statistics for SuperAdmin dashboard
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    let usersList: any[] = [];
    if (isDbConnected()) {
      const resUsers = await query(`SELECT role, status FROM users`);
      usersList = resUsers.rows;
    } else {
      usersList = store.getUsers();
    }

    const total = usersList.length;
    const online = usersList.filter((u) => u.status === 'online').length;
    const doctors = usersList.filter((u) => u.role === 'doctor').length;
    const landlords = usersList.filter((u) => u.role === 'landlord').length;
    const superadmins = usersList.filter((u) => u.role === 'superadmin').length;

    res.json({
      total,
      online,
      doctors,
      landlords,
      superadmins,
    });
  } catch (err: any) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch user stats' });
  }
});

// POST /api/users/login or presence sync
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, role, full_name, hospital, phone } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const assignedRole = email.toLowerCase().includes('superadmin') || role === 'superadmin' 
      ? 'superadmin' 
      : (role || 'doctor');
    const name = full_name || email.split('@')[0];

    if (isDbConnected()) {
      // Upsert into PostgreSQL
      const existing = await query(`SELECT * FROM users WHERE email = $1`, [email]);
      let user;

      if (existing.rows.length > 0) {
        const updateRes = await query(
          `UPDATE users 
           SET status = 'online', last_active_at = NOW(), role = COALESCE($2, role), full_name = COALESCE($3, full_name)
           WHERE email = $1 
           RETURNING *`,
          [email, assignedRole, name]
        );
        user = updateRes.rows[0];
      } else {
        const insertRes = await query(
          `INSERT INTO users (email, role, full_name, hospital, phone, status, last_active_at)
           VALUES ($1, $2, $3, $4, $5, 'online', NOW())
           RETURNING *`,
          [email, assignedRole, name, hospital || null, phone || null]
        );
        user = insertRes.rows[0];
      }

      return res.json({ success: true, user });
    }

    // Local JSON store fallback
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

    res.json({ success: true, user });
  } catch (err: any) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// POST /api/users/logout (set status offline)
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { email, id } = req.body;
    if (isDbConnected()) {
      if (id) {
        await query(`UPDATE users SET status = 'offline' WHERE id = $1`, [id]);
      } else if (email) {
        await query(`UPDATE users SET status = 'offline' WHERE email = $1`, [email]);
      }
      return res.json({ success: true });
    }

    if (id) {
      store.updateUser(id, { status: 'offline' });
    } else if (email) {
      const u = store.getUserByEmail(email);
      if (u) store.updateUser(u.id, { status: 'offline' });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error('Error logging out user:', err);
    res.status(500).json({ error: err.message || 'Logout failed' });
  }
});

// GET user by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const result = await query(`SELECT * FROM users WHERE id = $1`, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json({ user: result.rows[0] });
    }

    const user = store.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err: any) {
    console.error('Error fetching user by id:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch user' });
  }
});

export default router;
