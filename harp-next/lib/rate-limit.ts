/**
 * Tiny in-memory sliding-window limiter. Good enough for a single Node instance;
 * on serverless / multi-instance deployments replace with a shared store (e.g. Upstash Redis).
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60_000, now = Date.now()): { ok: boolean; retryAfter: number } {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) { hits.set(key, recent); return { ok: false, retryAfter: Math.ceil((windowMs - (now - recent[0]!)) / 1000) }; }
  recent.push(now); hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  return { ok: true, retryAfter: 0 };
}
export const _resetRateLimit = () => hits.clear();
