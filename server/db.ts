import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection configuration
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? { connectionString, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined }
    : {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'medproperties',
      }
);

let isConnected = false;

// Initialize Database Schema
export async function initDb() {
  try {
    const client = await pool.connect();
    try {
      console.log('🔌 Connected successfully to PostgreSQL.');
      isConnected = true;

      const schemaPath = path.join(process.cwd(), 'server', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('✅ PostgreSQL schema verified and up to date.');
      }
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn('⚠️ PostgreSQL connection not available directly:', err.message);
    console.log('ℹ️ Running with persistent local storage engine. Provide DATABASE_URL in .env to connect to live PostgreSQL.');
    isConnected = false;
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}

export async function query(text: string, params?: any[]) {
  if (!isConnected) {
    throw new Error('PostgreSQL database is currently disconnected.');
  }
  return pool.query(text, params);
}
