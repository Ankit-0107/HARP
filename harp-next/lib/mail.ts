import "server-only";
import { Resend } from "resend";

export class MailNotConfigured extends Error { constructor(missing: string[]) { super(`Email delivery is not configured (missing: ${missing.join(", ")})`); } }

/** Server-only. Credentials come from environment variables and are never exposed to the client bundle. */
export function mailConfig() {
  const apiKey = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL, from = process.env.RESEND_FROM;
  const missing = [!apiKey && "RESEND_API_KEY", !to && "CONTACT_TO_EMAIL", !from && "RESEND_FROM"].filter(Boolean) as string[];
  if (missing.length) throw new MailNotConfigured(missing);
  return { client: new Resend(apiKey), to: to!, from: from!, segmentId: process.env.RESEND_SEGMENT_ID };
}

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
