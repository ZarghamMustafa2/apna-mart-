/**
 * Centralized Media & Image Service for ApnaMart
 *
 * Provides safe client-side image processing, validation, optimization/compression,
 * and an abstracted storage layer.
 *
 * Currently stores optimized, lightweight WebP/JPEG Data URLs directly compatible
 * with the existing IndexedDB architecture, ensuring images persist across page refreshes
 * without corrupting storage quotas.
 *
 * Designed as a pluggable abstraction so cloud object storage (e.g. S3, Cloudinary,
 * Supabase Storage) can be connected seamlessly in the future by simply swapping
 * the upload implementation without changing any UI components.
 */

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
  preserveTransparency?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const DEFAULT_AVATAR_OPTIONS: ImageUploadOptions = {
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.88,
  maxSizeMB: 5,
  format: 'image/webp',
};

export const DEFAULT_PRODUCT_OPTIONS: ImageUploadOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.85,
  maxSizeMB: 8,
  format: 'image/webp',
};

export const DEFAULT_BANNER_OPTIONS: ImageUploadOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  maxSizeMB: 10,
  format: 'image/webp',
};

export const DEFAULT_LOGO_OPTIONS: ImageUploadOptions = {
  maxWidth: 800,
  maxHeight: 400,
  quality: 0.95,
  maxSizeMB: 5,
  preserveTransparency: true,
  format: 'image/png',
};

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

/**
 * Validates file type, size, and integrity.
 */
export function validateImageFile(
  file: File,
  options?: { maxSizeMB?: number; allowedTypes?: string[] }
): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const allowedTypes = options?.allowedTypes || ALLOWED_MIME_TYPES;
  const mime = file.type.toLowerCase();

  // Basic MIME check
  const isTypeAllowed = allowedTypes.some((t) => mime === t || mime.includes(t.replace('image/', '')));
  if (!isTypeAllowed) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please choose a JPG, PNG, or WebP image.`,
    };
  }

  // Size check
  const maxBytes = (options?.maxSizeMB || 8) * 1024 * 1024;
  if (file.size > maxBytes) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size too large (${sizeInMB} MB). Maximum allowed size is ${options?.maxSizeMB || 8} MB.`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty or corrupted.' };
  }

  return { valid: true };
}

/**
 * Reads and optionally compresses/resizes an image into an optimized Data URL.
 * Preserves SVG as direct base64/data URLs without canvas rasterization.
 */
export async function processAndOptimizeImage(
  file: File,
  options: ImageUploadOptions = DEFAULT_PRODUCT_OPTIONS
): Promise<string> {
  const validation = validateImageFile(file, { maxSizeMB: options.maxSizeMB });
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // SVGs pass through directly as data URLs to maintain vector sharpness
  if (file.type === 'image/svg+xml') {
    return readFileAsDataUrl(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read selected image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image data. The file might be corrupted.'));
      img.onload = () => {
        try {
          const maxWidth = options.maxWidth || 1200;
          const maxHeight = options.maxHeight || 1200;
          let { width, height } = img;

          // Calculate aspect ratio downscaling
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // Fallback to raw data url if canvas context fails
            resolve(reader.result as string);
            return;
          }

          // Handle transparency for PNGs vs JPEGs
          const targetFormat = options.preserveTransparency ? 'image/png' : options.format || 'image/webp';
          if (targetFormat === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Attempt export with target format and quality
          let dataUrl = canvas.toDataURL(targetFormat, options.quality || 0.85);

          // If browser doesn't support webp encoding, fallback to jpeg/png
          if (dataUrl.indexOf(`data:${targetFormat}`) !== 0 && targetFormat === 'image/webp') {
            dataUrl = canvas.toDataURL('image/jpeg', options.quality || 0.85);
          }

          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Standard upload helper for a single image.
 * Ready for cloud storage provider integration (e.g. S3 / Cloudinary).
 */
export async function uploadImage(
  file: File,
  options?: ImageUploadOptions
): Promise<string> {
  // In the future, this can branch to:
  // if (USE_CLOUD_STORAGE) return uploadToCloudProvider(file);
  return processAndOptimizeImage(file, options);
}

/**
 * Upload multiple images concurrently.
 */
export async function uploadMultipleImages(
  files: File[],
  options?: ImageUploadOptions
): Promise<string[]> {
  const uploadPromises = Array.from(files).map((file) => uploadImage(file, options));
  return Promise.all(uploadPromises);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file as Data URL.'));
    reader.readAsDataURL(file);
  });
}
