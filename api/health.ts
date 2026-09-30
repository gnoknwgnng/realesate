import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isNeonConfigured } from './lib/neon';
import { isR2Configured, bucketName } from './lib/r2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    architecture: 'Vercel Serverless Functions',
    database: {
      engine: 'Neon Serverless PostgreSQL',
      configured: isNeonConfigured,
      mode: isNeonConfigured ? 'live-neon' : 'local-persistence',
    },
    storage: {
      engine: 'Cloudflare R2 (S3-Compatible)',
      configured: isR2Configured,
      bucket: bucketName,
      mode: isR2Configured ? 'live-r2' : 'local-media',
    },
  });
}
