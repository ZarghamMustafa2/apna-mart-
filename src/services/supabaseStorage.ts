import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Converts a base64 Data URL to a native Blob object.
 */
export function dataUrlToBlob(dataUrl: string): { blob: Blob; mimeType: string; extension: string } {
  const parts = dataUrl.split(';base64,');
  const mimeType = parts[0].split(':')[1] || 'image/jpeg';
  const extension = mimeType.split('/')[1] || 'jpg';
  const byteCharacters = atob(parts[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return {
    blob: new Blob([byteArray], { type: mimeType }),
    mimeType,
    extension,
  };
}

export type StorageBucket =
  | 'apnamart-products'
  | 'apnamart-banners'
  | 'apnamart-avatars'
  | 'apnamart-assets';

/**
 * Uploads an image (File, Blob, or Data URL) directly to Supabase Cloud Storage.
 * Returns the permanent public CDN URL.
 */
export async function uploadImageToSupabase(
  source: File | Blob | string,
  bucket: StorageBucket = 'apnamart-products',
  customFileName?: string
): Promise<string> {
  // If Supabase is not configured, return source as is (e.g. data URL)
  if (!isSupabaseConfigured()) {
    if (typeof source === 'string') return source;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(source as Blob);
    });
  }

  const client = supabase.client;
  if (!client) {
    throw new Error('Supabase client unavailable.');
  }

  let uploadBlob: Blob;
  let fileExt = 'webp';

  if (typeof source === 'string') {
    if (source.startsWith('http://') || source.startsWith('https://')) {
      // Already a hosted URL
      return source;
    }
    if (source.startsWith('data:')) {
      const { blob, extension } = dataUrlToBlob(source);
      uploadBlob = blob;
      fileExt = extension;
    } else {
      throw new Error('Invalid image string format.');
    }
  } else if (source instanceof File) {
    uploadBlob = source;
    fileExt = source.name.split('.').pop() || 'jpg';
  } else {
    uploadBlob = source;
  }

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  const fileName = customFileName
    ? `${customFileName}-${timestamp}.${fileExt}`
    : `${timestamp}-${randomStr}.${fileExt}`;

  const { error } = await client.storage
    .from(bucket)
    .upload(fileName, uploadBlob, {
      contentType: uploadBlob.type || 'image/jpeg',
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error(`Failed to upload to Supabase bucket "${bucket}":`, error);
    // If bucket doesn't exist, fall back to data URL
    if (typeof source === 'string') return source;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(uploadBlob);
    });
  }

  const { data } = client.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}
