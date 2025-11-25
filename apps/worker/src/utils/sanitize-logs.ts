/**
 * Utility functions to sanitize logs and prevent secret leakage
 */

const SECRET_KEYS = [
  "apiKey",
  "api_key",
  "apikey",
  "secret",
  "password",
  "token",
  "authorization",
  "auth",
  "credentials",
  "bearer",
  "x-api-key",
  "x-api-token",
];

const REDACTED_VALUE = "[REDACTED]";

/**
 * Recursively sanitize an object, removing or redacting secret values
 */
export function sanitizeForLogging(obj: unknown, depth = 0): unknown {
  // Prevent deep recursion
  if (depth > 10) {
    return "[MAX_DEPTH]";
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    // Check if string looks like a secret (long alphanumeric, starts with sk-, etc.)
    if (
      obj.length > 20 &&
      /^[a-zA-Z0-9_-]+$/.test(obj) &&
      (obj.startsWith("sk-") || obj.startsWith("pk-") || obj.length > 40)
    ) {
      return REDACTED_VALUE;
    }
    return obj;
  }

  if (typeof obj === "number" || typeof obj === "boolean") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForLogging(item, depth + 1));
  }

  if (typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();

      // Check if key indicates a secret
      const isSecretKey = SECRET_KEYS.some((secretKey) =>
        lowerKey.includes(secretKey.toLowerCase())
      );

      if (isSecretKey) {
        sanitized[key] = REDACTED_VALUE;
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeForLogging(value, depth + 1);
      } else if (typeof value === "string" && value.length > 50) {
        // Long strings might be secrets, truncate them
        sanitized[key] = value.substring(0, 50) + "...";
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Sanitize headers object
 */
export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (
      SECRET_KEYS.some((secretKey) => lowerKey.includes(secretKey.toLowerCase())) ||
      lowerKey === "authorization" ||
      lowerKey.startsWith("x-api-")
    ) {
      sanitized[key] = REDACTED_VALUE;
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Sanitize error message, removing potential secret values
 */
export function sanitizeErrorMessage(error: Error | string): string {
  const message = typeof error === "string" ? error : error.message;

  // Remove common secret patterns
  return message
    .replace(/sk-[a-zA-Z0-9_-]+/g, REDACTED_VALUE)
    .replace(/pk-[a-zA-Z0-9_-]+/g, REDACTED_VALUE)
    .replace(/Bearer\s+[a-zA-Z0-9_-]+/gi, `Bearer ${REDACTED_VALUE}`)
    .replace(/api[_-]?key[=:]\s*[a-zA-Z0-9_-]+/gi, `api_key=${REDACTED_VALUE}`)
    .replace(/password[=:]\s*[^\s]+/gi, `password=${REDACTED_VALUE}`);
}

