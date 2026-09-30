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

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
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

// Mount API routes
app.use('/api/properties', propertiesRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/users', usersRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/favorites', favoritesRouter);

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
