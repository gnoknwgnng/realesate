import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';

dotenv.config();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
export const bucketName = process.env.R2_BUCKET_NAME || 'medproperties-media';
export const publicUrl = process.env.R2_PUBLIC_URL || '';

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

// Generate presigned PUT URL for direct browser-to-R2 upload (bypasses serverless payload limit)
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

  // Fallback direct URL when credentials are in dev mode
  return {
    uploadUrl: `/api/upload`,
    key,
    publicFileUrl: `/uploads/${uniqueId}${ext}`,
  };
}

// Direct buffer upload
export async function uploadBufferToR2(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folder: string = 'properties'
): Promise<{ key: string; url: string; fileName: string; fileSize: number; mimeType: string }> {
  const ext = path.extname(fileName) || '.jpg';
  const uniqueId = crypto.randomUUID();
  const safeName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const key = `${folder}/${Date.now()}-${uniqueId}-${safeName}${ext}`;

  if (s3Client && isR2Configured) {
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
      fileName,
      fileSize: buffer.length,
      mimeType,
    };
  }

  return {
    key,
    url: `/uploads/${uniqueId}${ext}`,
    fileName,
    fileSize: buffer.length,
    mimeType,
  };
}

// Delete media from R2
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
    } catch {
      return false;
    }
  }
  return true;
}
