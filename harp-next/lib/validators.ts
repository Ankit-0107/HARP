import { z } from "zod";

const email = z.string().trim().toLowerCase().max(254).pipe(z.email("Enter a valid email address."));

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email,
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(4000, "Message is too long."),
  /** honeypot — must stay empty */
  website: z.string().max(0).optional().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({ email, company: z.string().max(0).optional().default("") });
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of err.issues) { const k = String(i.path[0] ?? "form"); out[k] ??= i.message; }
  return out;
}
