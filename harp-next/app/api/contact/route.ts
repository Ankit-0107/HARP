import { contactSchema, fieldErrors } from "@/lib/validators";
import { MailNotConfigured, escapeHtml, mailConfig } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { guard } from "@/lib/request";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const g = guard(req); if (g instanceof Response) return g;
  const rl = rateLimit(`contact:${g.ip}`);
  if (!rl.ok) return Response.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    // A filled honeypot is treated as a bot: pretend success, send nothing.
    if (body && typeof body === "object" && "website" in body && (body as { website?: string }).website) return Response.json({ ok: true });
    return Response.json({ error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }
  const { name, email, message } = parsed.data;

  try {
    const { client, to, from } = mailConfig();
    const { error } = await client.emails.send({
      from, to, replyTo: email, subject: `New contact message from ${name.slice(0, 80)}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
    if (error) { console.error("[contact] Resend error:", error.name); return Response.json({ error: "We could not send your message. Please try again later." }, { status: 502 }); }
    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof MailNotConfigured) { console.error("[contact]", e.message); return Response.json({ error: "Email delivery is not configured yet." }, { status: 503 }); }
    console.error("[contact] unexpected error"); return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
