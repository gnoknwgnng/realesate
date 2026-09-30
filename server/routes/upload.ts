import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadToR2, deleteFromR2 } from '../r2';

const router = Router();

// Configure multer memory storage (limit 10MB per file)
const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, AVIF, GIF.`));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});

// Presigned upload URL for direct-to-R2 upload (Vercel Serverless / Cloudflare R2 standard)
router.post('/presign', async (req: Request, res: Response) => {
  try {
    const { fileName, mimeType, folder = 'properties' } = req.body || {};
    if (!fileName || !mimeType) {
      return res.status(400).json({ error: 'fileName and mimeType are required' });
    }

    const { createPresignedUploadUrl } = await import('../r2');
    const result = await createPresignedUploadUrl(fileName, mimeType, folder);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Presign generation failed' });
  }
});

// Single image upload to Cloudflare R2
router.post('/single', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const folder = req.body.folder || 'properties';
    const result = await uploadToR2(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );

    res.json({
      success: true,
      file: result,
    });
  } catch (err: any) {
    console.error('Error in single image upload:', err);
    res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});

// Multiple image upload to Cloudflare R2
router.post('/multiple', upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const folder = req.body.folder || 'properties';
    const uploadPromises = files.map((file) =>
      uploadToR2(file.buffer, file.originalname, file.mimetype, folder)
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      files: results,
    });
  } catch (err: any) {
    console.error('Error in multiple images upload:', err);
    res.status(500).json({ error: err.message || 'Multiple images upload failed' });
  }
});

// Delete image from Cloudflare R2
router.delete('/', async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ error: 'Object key is required' });
    }

    const success = await deleteFromR2(key);
    res.json({ success });
  } catch (err: any) {
    console.error('Error deleting object from R2:', err);
    res.status(500).json({ error: err.message || 'Failed to delete object' });
  }
});

export default router;
