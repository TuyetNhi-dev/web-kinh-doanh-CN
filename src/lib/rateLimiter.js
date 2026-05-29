/**
 * Simple in-memory rate limiter.
 *
 * Usage:
 *   const { limited, remaining, retryAfter } = rateLimit(ip, "register");
 *   if (limited) return NextResponse.json(..., { status: 429 });
 *
 * Each (ip, action) pair gets its own counter. Counters reset after
 * WINDOW_MS milliseconds. This works for a single-process deployment
 * (e.g. local dev, single Vercel instance). For multi-instance deployments,
 * swap the Map for a Redis-backed store.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Map<`${ip}:${action}`, { count: number, windowStart: number }>
const store = new Map();

// Clean up expired entries every 10 minutes so the Map doesn't grow unbounded.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now - record.windowStart >= WINDOW_MS) {
        store.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

/**
 * @param {string} ip   - Client IP address
 * @param {string} action - Logical action name, e.g. "register", "forgot-password"
 * @returns {{ limited: boolean, remaining: number, retryAfter: number }}
 */
export function rateLimit(ip, action) {
  const key = `${ip}:${action}`;
  const now = Date.now();

  let record = store.get(key);

  if (!record || now - record.windowStart >= WINDOW_MS) {
    // Start a fresh window
    record = { count: 1, windowStart: now };
    store.set(key, record);
    return { limited: false, remaining: MAX_ATTEMPTS - 1, retryAfter: 0 };
  }

  record.count += 1;

  if (record.count > MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - record.windowStart)) / 1000);
    return { limited: true, remaining: 0, retryAfter };
  }

  return { limited: false, remaining: MAX_ATTEMPTS - record.count, retryAfter: 0 };
}

/**
 * Extract the best available client IP from Next.js request headers.
 * @param {Request} req
 * @returns {string}
 */
export function getClientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}
