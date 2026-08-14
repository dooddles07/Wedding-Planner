import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: false,
});

export async function checkRateLimit(request: Request, scope: string) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { success } = await limiter.limit(`${scope}:${ip}`);
  return success;
}

/**
 * A looser limiter for authenticated, per-user write endpoints that save on
 * every keystroke (e.g. the site builder's autosave) — generous enough not
 * to throttle normal typing, tight enough to stop a scripted hammering loop.
 */
const userLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "10 s"),
  analytics: false,
});

export async function checkUserRateLimit(userId: string, scope: string) {
  const { success } = await userLimiter.limit(`${scope}:${userId}`);
  return success;
}
