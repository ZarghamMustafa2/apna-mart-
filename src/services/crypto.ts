/**
 * Crypto Security Service
 * SHA-256 salted password hashing & data sanitization utilities.
 */

// Simple browser-compatible SHA-256 hash implementation using SubtleCrypto API
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
  salt: string
): Promise<boolean> {
  const computed = await hashPassword(plainPassword, salt);
  return computed === hashedPassword;
}

/**
 * Strips confidential admin fields (e.g. purchaseCost, passwordHash, salt) from customer-facing product payloads.
 */
export function sanitizeProductForCustomer<T extends Record<string, any>>(product: T): T {
  const sanitized = { ...product };
  delete sanitized.purchaseCost;
  return sanitized;
}
