import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPresignedUploadUrl } from '../lib/r2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, mimeType, folder = 'properties' } = req.body || {};

    if (!fileName || !mimeType) {
      return res.status(400).json({ error: 'fileName and mimeType are required' });
    }

    const result = await createPresignedUploadUrl(fileName, mimeType, folder);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    console.error('Error generating presigned URL:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate presigned upload URL' });
  }
}
