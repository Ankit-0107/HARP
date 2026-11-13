import { describe, expect, it, vi, beforeEach } from "vitest";
import { _resetRateLimit } from "@/lib/rate-limit";

const send = vi.fn(); const create = vi.fn();
vi.mock("@/lib/mail", async (orig) => {
  const real = await orig<typeof import("@/lib/mail")>();
  return { ...real, mailConfig: vi.fn(() => ({ client: { emails: { send }, contacts: { create } }, to: "owner@example.com", from: "HARP <no-reply@example.com>", segmentId: process.env.SEG })) };
});
import { POST as contact } from "@/app/api/contact/route";
import { POST as newsletter } from "@/app/api/newsletter/route";

const req = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(`http://localhost${url}`, { method: "POST", headers: { "content-type": "application/json", host: "localhost", ...headers }, body: JSON.stringify(body) });

beforeEach(() => { _resetRateLimit(); send.mockReset(); create.mockReset(); delete process.env.SEG; });

describe("POST /api/contact", () => {
  const body = { name: "Ada <b>", email: "ada@example.com", message: "Hello <script>alert(1)</script> there" };
  it("sends via Resend with reply-to and escaped HTML", async () => {
    send.mockResolvedValue({ data: { id: "1" }, error: null });
    const res = await contact(req("/api/contact", body)); expect(res.status).toBe(200);
    const arg = send.mock.calls[0]![0]; expect(arg.to).toBe("owner@example.com"); expect(arg.replyTo).toBe("ada@example.com");
    expect(arg.html).not.toContain("<script>"); expect(arg.html).toContain("&lt;script&gt;");
  });
  it("maps a Resend error to 502 without leaking details", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "secret detail" } });
    const res = await contact(req("/api/contact", body)); expect(res.status).toBe(502); expect(await res.text()).not.toContain("secret detail");
  });
  it("honeypot: reports ok but never sends", async () => {
    const res = await contact(req("/api/contact", { ...body, website: "http://spam" })); expect(res.status).toBe(200); expect(send).not.toHaveBeenCalled();
  });
  it("422 with field errors on bad input", async () => {
    const res = await contact(req("/api/contact", { name: "", email: "x", message: "y" })); expect(res.status).toBe(422);
    expect(Object.keys((await res.json()).fields)).toEqual(expect.arrayContaining(["name", "email", "message"]));
  });
  it("403 cross-origin, 415 wrong type, 429 after limit", async () => {
    expect((await contact(req("/api/contact", body, { origin: "https://evil.example" }))).status).toBe(403);
    expect((await contact(new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "text/plain", host: "localhost" }, body: "x" }))).status).toBe(415);
    send.mockResolvedValue({ data: {}, error: null });
    const codes: number[] = []; for (let i = 0; i < 7; i++) codes.push((await contact(req("/api/contact", body))).status);
    expect(codes.slice(0, 5).every((c) => c === 200)).toBe(true); expect(codes[5]).toBe(429);
  });
});

describe("POST /api/newsletter", () => {
  it("falls back to an owner notification email without a segment", async () => {
    send.mockResolvedValue({ data: {}, error: null });
    expect((await newsletter(req("/api/newsletter", { email: "a@b.co" }))).status).toBe(200); expect(send).toHaveBeenCalledOnce(); expect(create).not.toHaveBeenCalled();
  });
  it("creates a Resend contact in the segment when RESEND_SEGMENT_ID is set", async () => {
    process.env.SEG = "seg_123"; create.mockResolvedValue({ data: {}, error: null });
    expect((await newsletter(req("/api/newsletter", { email: "a@b.co" }))).status).toBe(200);
    expect(create).toHaveBeenCalledWith({ email: "a@b.co", segments: [{ id: "seg_123" }] });
  });
  it("422 invalid email", async () => { expect((await newsletter(req("/api/newsletter", { email: "bad" }))).status).toBe(422); });
});
