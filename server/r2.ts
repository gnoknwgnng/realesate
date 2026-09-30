import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
export const bucketName = process.env.R2_BUCKET_NAME || 'medproperties-media';
export const publicUrl = process.env.R2_PUBLIC_URL || '';

// Fallback local uploads folder (safely use /tmp on serverless environments)
const isVercel = Boolean(process.env.VERCEL);
const localUploadsDir = isVercel
  ? path.join('/tmp', 'medproperties_uploads')
  : path.join(process.cwd(), 'uploads');

try {
  if (!fs.existsSync(localUploadsDir)) {
    fs.mkdirSync(localUploadsDir, { recursive: true });
  }
} catch {
  // Read-only filesystem safe
}

export const isR2Configured = Boolean(
  accountId &&
    accessKeyId &&
    secretAccessKey &&
    !accessKeyId.includes('your_') &&
    !secretAccessKey.includes('your_')
);

export const s3Client = isR2Configured
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  : null;

export interface UploadResult {
  key: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// Upload buffer directly to Cloudflare R2 (or fallback storage)
export async function uploadToR2(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder: string = 'properties'
): Promise<UploadResult> {
  const ext = path.extname(originalName) || '.jpg';
  const uniqueId = crypto.randomUUID();
  const safeName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const key = `${folder}/${Date.now()}-${uniqueId}-${safeName}${ext}`;

  if (s3Client && isR2Configured) {
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        })
      );

      const url = publicUrl
        ? `${publicUrl.replace(/\/$/, '')}/${key}`
        : `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;

      return {
        key,
        url,
        fileName: originalName,
        fileSize: buffer.length,
        mimeType,
      };
    } catch (err: any) {
      console.error('Failed to upload to Cloudflare R2, falling back to local:', err.message);
    }
  }

  // Local storage fallback
  try {
    const localFilePath = path.join(localUploadsDir, `${Date.now()}-${uniqueId}${ext}`);
    fs.writeFileSync(localFilePath, buffer);
    const localUrl = `/uploads/${path.basename(localFilePath)}`;

    return {
      key,
      url: localUrl,
      fileName: originalName,
      fileSize: buffer.length,
      mimeType,
    };
  } catch {
    // If filesystem write fails on serverless, return data URI fallback
    return {
      key,
      url: `data:${mimeType};base64,${buffer.toString('base64')}`,
      fileName: originalName,
      fileSize: buffer.length,
      mimeType,
    };
  }
}

// Delete object from Cloudflare R2
export async function deleteFromR2(key: string): Promise<boolean> {
  if (s3Client && isR2Configured) {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
        })
      );
      return true;
    } catch (err: any) {
      console.warn('Failed to delete object from Cloudflare R2:', err.message);
      return false;
    }
  }
  return true;
}

// Generate pre-signed upload URL for direct browser uploads
export async function createPresignedUploadUrl(
  fileName: string,
  mimeType: string,
  folder: string = 'properties'
): Promise<{ uploadUrl: string; key: string; publicFileUrl: string }> {
  const ext = path.extname(fileName) || '.jpg';
  const uniqueId = crypto.randomUUID();
  const safeName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const key = `${folder}/${Date.now()}-${uniqueId}-${safeName}${ext}`;

  if (s3Client && isR2Configured) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicFileUrl = publicUrl
      ? `${publicUrl.replace(/\/$/, '')}/${key}`
      : `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;

    return { uploadUrl, key, publicFileUrl };
  }

  return {
    uploadUrl: `/api/upload/single`,
    key,
    publicFileUrl: `/uploads/${uniqueId}${ext}`,
  };
}

export async function getPresignedUploadUrl(
  key: string,
  mimeType: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  if (!s3Client || !isR2Configured) {
    throw new Error('Cloudflare R2 is not configured with live credentials.');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: mimeType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}
