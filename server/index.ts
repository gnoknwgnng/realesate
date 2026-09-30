import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initDb, isDbConnected, pool } from './db';
import { isR2Configured, bucketName } from './r2';
import propertiesRouter from './routes/properties';
import uploadRouter from './routes/upload';
import usersRouter from './routes/users';
import inquiriesRouter from './routes/inquiries';
import leadsRouter from './routes/leads';
import favoritesRouter from './routes/favorites';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve local fallback uploads statically
const uploadsDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Root API status endpoint
app.get(['/', '/api'], (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'MedProperties Serverless API',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get(['/api/health', '/health'], (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      engine: 'PostgreSQL',
      connected: isDbConnected(),
      mode: isDbConnected() ? 'live' : 'fallback-store',
    },
    storage: {
      engine: 'Cloudflare R2',
      configured: isR2Configured,
      bucket: bucketName,
      mode: isR2Configured ? 'live-r2' : 'local-media',
    },
  });
});

// Mount API routes (supports both /api/path and rewritten /path)
app.use(['/api/properties', '/properties'], propertiesRouter);
app.use(['/api/upload', '/upload'], uploadRouter);
app.use(['/api/users', '/users'], usersRouter);
app.use(['/api/inquiries', '/inquiries'], inquiriesRouter);
app.use(['/api/leads', '/leads'], leadsRouter);
app.use(['/api/favorites', '/favorites'], favoritesRouter);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('API Error:', err);
  res.status(500).json({ error: err?.message || 'Internal Server Error' });
});

// Start server
async function startServer() {
  try {
    await initDb();
  } catch (err: any) {
    console.warn('⚠️ Database init notice:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 MedProperties Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📦 Database: PostgreSQL (${isDbConnected() ? 'Connected' : 'Fallback active'})`);
    console.log(`☁️ Storage: Cloudflare R2 (${isR2Configured ? 'Connected' : 'Local media fallback active'})`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
