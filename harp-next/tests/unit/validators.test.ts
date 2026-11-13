import { describe, expect, it, beforeEach } from "vitest";
import { contactSchema, newsletterSchema } from "@/lib/validators";
import { rateLimit, _resetRateLimit } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/mail";

describe("contactSchema", () => {
  const good = { name: " Ada ", email: "ADA@Example.com ", message: "Hello there, friend." };
  it("trims and lowercases", () => { const r = contactSchema.parse(good); expect(r.name).toBe("Ada"); expect(r.email).toBe("ada@example.com"); });
  it("rejects bad email, empty name, short message", () => {
    expect(contactSchema.safeParse({ ...good, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...good, name: " " }).success).toBe(false);
    expect(contactSchema.safeParse({ ...good, message: "short" }).success).toBe(false);
  });
  it("rejects a filled honeypot", () => { expect(contactSchema.safeParse({ ...good, website: "x" }).success).toBe(false); });
  it("caps message length", () => { expect(contactSchema.safeParse({ ...good, message: "x".repeat(4001) }).success).toBe(false); });
});
describe("newsletterSchema", () => {
  it("accepts a valid email", () => expect(newsletterSchema.safeParse({ email: "a@b.co" }).success).toBe(true));
  it("rejects invalid + honeypot", () => { expect(newsletterSchema.safeParse({ email: "a" }).success).toBe(false); expect(newsletterSchema.safeParse({ email: "a@b.co", company: "x" }).success).toBe(false); });
});
describe("rateLimit", () => {
  beforeEach(_resetRateLimit);
  it("allows `limit` hits then blocks, then recovers after the window", () => {
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 1000, 0 + i).ok).toBe(true);
    const blocked = rateLimit("k", 3, 1000, 10); expect(blocked.ok).toBe(false); expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(rateLimit("k", 3, 1000, 2000).ok).toBe(true);
  });
  it("isolates keys", () => { rateLimit("a", 1, 1000, 0); expect(rateLimit("b", 1, 1000, 0).ok).toBe(true); });
});
describe("escapeHtml", () => { it("escapes markup", () => expect(escapeHtml(`<img src=x onerror="a">&'`)).toBe("&lt;img src=x onerror=&quot;a&quot;&gt;&amp;&#39;")); });
