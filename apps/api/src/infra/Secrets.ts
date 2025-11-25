/**
 * Secrets management with encryption
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { config } from "../config/index.js";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 32;

// Derive encryption key from JWT secret (in production, use proper KMS)
function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, KEY_LENGTH);
}

export function encryptSecret(value: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const key = deriveKey(config.auth.jwtSecret, salt);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(value, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  // Combine salt + iv + authTag + encrypted data
  const combined = Buffer.concat([
    salt,
    iv,
    authTag,
    Buffer.from(encrypted, "base64"),
  ]);

  return combined.toString("base64");
}

export function decryptSecret(encryptedValue: string): string {
  const combined = Buffer.from(encryptedValue, "base64");

  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + 16);
  const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + 16);

  const key = deriveKey(config.auth.jwtSecret, salt);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

