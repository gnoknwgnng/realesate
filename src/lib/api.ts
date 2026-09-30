import { Property, PropertyImage, InquiryFormData, UserProfile } from '../types';

const API_BASE = '/api';

export interface UploadResponse {
  key: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// Check backend server, PostgreSQL and Cloudflare R2 health
export async function apiCheckHealth(): Promise<{
  status: string;
  database: { engine: string; connected: boolean; mode: string };
  storage: { engine: string; configured: boolean; bucket: string; mode: string };
}> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

// Upload single image to Cloudflare R2 (presigned direct upload with fallback)
export async function apiUploadImage(file: File, folder: string = 'properties'): Promise<UploadResponse> {
  // 1. Try presigned direct upload to Cloudflare R2
  try {
    const presignRes = await fetch(`${API_BASE}/upload/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type || 'image/jpeg',
        folder,
      }),
    });

    if (presignRes.ok) {
      const presignData = await presignRes.json();
      if (presignData.uploadUrl && presignData.uploadUrl.startsWith('http')) {
        const uploadRes = await fetch(presignData.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        });

        if (uploadRes.ok) {
          return {
            key: presignData.key,
            url: presignData.publicFileUrl,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type || 'image/jpeg',
          };
        }
      }
    }
  } catch (err) {
    console.warn('Presigned upload failed, falling back to server upload:', err);
  }

  // 2. Fallback to server multipart upload
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const res = await fetch(`${API_BASE}/upload/single`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload image');
  }

  const data = await res.json();
  return data.file;
}

// Upload multiple images to Cloudflare R2
export async function apiUploadMultipleImages(
  files: File[],
  folder: string = 'properties'
): Promise<UploadResponse[]> {
  const uploadPromises = files.map((file) => apiUploadImage(file, folder));
  return Promise.all(uploadPromises);
}

// Delete media from Cloudflare R2
export async function apiDeleteR2Media(key: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });
  const data = await res.json().catch(() => ({}));
  return data.success || false;
}

// Properties CRUD
export async function apiFetchProperties(filters?: Record<string, any>): Promise<Property[]> {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        queryParams.append(k, String(v));
      }
    });
  }

  const url = `${API_BASE}/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch properties: ${res.statusText}`);
  }
  const data = await res.json();
  return data.properties || [];
}

export async function apiFetchPropertyById(id: string): Promise<Property | null> {
  const res = await fetch(`${API_BASE}/properties/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.property;
}

export async function apiCreateProperty(property: Partial<Property>): Promise<Property> {
  const res = await fetch(`${API_BASE}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create property in PostgreSQL');
  }

  const data = await res.json();
  return data.property;
}

export async function apiUpdateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  const res = await fetch(`${API_BASE}/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update property');
  }

  const data = await res.json();
  return data.property;
}

export async function apiRemoveProperty(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/properties/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// Inquiries / Tour Bookings
export async function apiPostInquiry(data: InquiryFormData): Promise<{ success: boolean; inquiry: any }> {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit inquiry');
  }
  return res.json();
}

export async function apiFetchInquiries(propertyId?: string): Promise<InquiryFormData[]> {
  const url = propertyId ? `${API_BASE}/inquiries?property_id=${propertyId}` : `${API_BASE}/inquiries`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.inquiries || [];
}

// Leads (Landlord network)
export async function apiPostLead(email: string, type: string = 'landlord'): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, type }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save lead');
  }
  return res.json();
}

// Users and Sessions
export async function apiFetchUsers(): Promise<UserProfile[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.users || [];
}

export async function apiPostUserLogin(payload: {
  email: string;
  role?: string;
  full_name?: string;
  hospital?: string;
  phone?: string;
}): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to authenticate user');
  }

  const data = await res.json();
  return data.user;
}

export async function apiPostUserLogout(emailOrId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/users/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailOrId, id: emailOrId }),
  });
  return res.ok;
}

// Favorites
export async function apiToggleFavorite(property_id: string, user_id: string): Promise<{ favorited: boolean }> {
  const res = await fetch(`${API_BASE}/favorites/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ property_id, user_id }),
  });
  return res.json();
}

export async function apiFetchFavorites(user_id: string): Promise<Property[]> {
  const res = await fetch(`${API_BASE}/favorites?user_id=${user_id}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.favorites || [];
}
