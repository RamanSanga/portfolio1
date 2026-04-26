import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const CONTACT_LIMIT = 5;
const CONTACT_WINDOW = "1 m";

type LocalEntry = { count: number; windowStart: number };

const LOCAL_WINDOW_MS = 60 * 1000;
const LOCAL_MAX_ENTRIES = 10_000;
const LOCAL_CLEANUP_INTERVAL_MS = 30 * 1000;

const localStore = new Map<string, LocalEntry>();
let lastLocalCleanupAt = 0;

let redisLimiter: Ratelimit | null | undefined;

function getRedisLimiter() {
  if (redisLimiter !== undefined) {
    return redisLimiter;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    redisLimiter = null;
    return redisLimiter;
  }

  const redis = new Redis({ url, token });
  redisLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(CONTACT_LIMIT, CONTACT_WINDOW),
    analytics: false,
    prefix: "rl:portfolio",
  });

  return redisLimiter;
}

function cleanupLocalStore(now: number) {
  if (now - lastLocalCleanupAt < LOCAL_CLEANUP_INTERVAL_MS) {
    return;
  }

  for (const [key, entry] of localStore.entries()) {
    if (now - entry.windowStart > LOCAL_WINDOW_MS) {
      localStore.delete(key);
    }
  }

  if (localStore.size > LOCAL_MAX_ENTRIES) {
    const overflow = localStore.size - LOCAL_MAX_ENTRIES;
    const keys = localStore.keys();
    for (let i = 0; i < overflow; i += 1) {
      const next = keys.next();
      if (next.done) break;
      localStore.delete(next.value);
    }
  }

  lastLocalCleanupAt = now;
}

function isRateLimitedLocal(key: string) {
  const now = Date.now();
  cleanupLocalStore(now);

  const existing = localStore.get(key);
  if (!existing || now - existing.windowStart > LOCAL_WINDOW_MS) {
    localStore.set(key, { count: 1, windowStart: now });
    return false;
  }

  if (existing.count >= CONTACT_LIMIT) {
    return true;
  }

  existing.count += 1;
  localStore.set(key, existing);
  return false;
}

export async function isContactRateLimited(key: string) {
  const limiter = getRedisLimiter();

  if (!limiter) {
    return isRateLimitedLocal(key);
  }

  try {
    const result = await limiter.limit(`contact:${key}`);
    return !result.success;
  } catch {
    // Keep API responsive even if Redis is unavailable.
    return isRateLimitedLocal(key);
  }
}