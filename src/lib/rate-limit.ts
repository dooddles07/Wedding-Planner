import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: false,
});

export async function checkRateLimit(request: Request, scope: string) {
  // Plain x-forwarded-for's leftmost value is whatever the client sent —
  // trusting it lets an attacker rotate a random value per request and get
  // a fresh bucket every time. x-vercel-forwarded-for is set by Vercel's
  // own edge network from the real connecting client and can't be
  // overridden by the client, so it's the trustworthy signal on this
  // platform; x-real-ip is a reasonable non-Vercel fallback. Only fall back
  // to plain XFF, best-effort, if neither is present. See audit P1-1.
  const ip =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
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
