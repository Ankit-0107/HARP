import { newsletterSchema, fieldErrors } from "@/lib/validators";
import { MailNotConfigured, escapeHtml, mailConfig } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { guard } from "@/lib/request";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const g = guard(req); if (g instanceof Response) return g;
  const rl = rateLimit(`newsletter:${g.ip}`, 5);
  if (!rl.ok) return Response.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const body = await req.json().catch(() => null);
  if (body && typeof body === "object" && (body as { company?: string }).company) return Response.json({ ok: true }); // honeypot
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: Object.values(fieldErrors(parsed.error))[0] ?? "Invalid email." }, { status: 422 });

  try {
    const { client, to, from, segmentId } = mailConfig();
    if (segmentId) {
      const { error } = await client.contacts.create({ email: parsed.data.email, segments: [{ id: segmentId }] });
      if (error) { console.error("[newsletter] Resend error:", error.name); return Response.json({ error: "We could not subscribe you right now." }, { status: 502 }); }
    } else {
      const { error } = await client.emails.send({ from, to, subject: "New newsletter sign-up", text: `Email: ${parsed.data.email}`, html: `<p>New newsletter sign-up: <strong>${escapeHtml(parsed.data.email)}</strong></p>` });
      if (error) { console.error("[newsletter] Resend error:", error.name); return Response.json({ error: "We could not subscribe you right now." }, { status: 502 }); }
    }
    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof MailNotConfigured) { console.error("[newsletter]", e.message); return Response.json({ error: "Sign-ups are not available yet." }, { status: 503 }); }
    console.error("[newsletter] unexpected error"); return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
