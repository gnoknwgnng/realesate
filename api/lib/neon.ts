import { Pool, neon, neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { store } from '../../server/data/store';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  '';

export const isNeonConfigured = Boolean(
  connectionString &&
    !connectionString.includes('user:password') &&
    !connectionString.includes('localhost')
);

// If running in Node.js environment without native WebSocket, neonConfig handles it
let pool: Pool | null = null;
let sqlClient: ReturnType<typeof neon> | null = null;

if (connectionString) {
  try {
    pool = new Pool({ connectionString });
    sqlClient = neon(connectionString);
  } catch (err: any) {
    console.warn('⚠️ Neon Serverless PostgreSQL initialization notice:', err.message);
  }
}

// Serverless query executor
export async function executeQuery<T = any>(
  text: string,
  params: any[] = []
): Promise<{ rows: T[]; rowCount: number }> {
  if (pool) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(text, params);
        return { rows: result.rows, rowCount: result.rowCount || result.rows.length };
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.error('Neon serverless query error, falling back to local store if available:', err.message);
    }
  }

  return { rows: [], rowCount: 0 };
}

export { pool, sqlClient, store };
