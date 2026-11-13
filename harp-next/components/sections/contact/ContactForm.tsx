"use client";
import { useState } from "react";
import { PixelButton } from "@/components/ui/PixelButton";
import { contactSchema, fieldErrors } from "@/lib/validators";
import { cn } from "@/lib/cn";

type Labels = { name: string; email: string; message: string; submit: string; success: string };
type State = "idle" | "loading" | "success" | "error";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[11px] uppercase text-mute">{label}</label>
      {children}
      <p id={`${id}-err`} role="alert" className="mt-1.5 min-h-4 text-[12px] text-red-600">{error}</p>
    </div>
  );
}
const input = "w-full border-b border-black/20 bg-transparent py-2.5 text-[16px] outline-none transition-colors placeholder:text-black/30 focus:border-black aria-[invalid=true]:border-red-600";

export function ContactForm({ labels }: { labels: Labels }) {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) { setErrors(fieldErrors(parsed.error)); setState("idle"); setMsg(""); return; }
    setErrors({}); setState("loading"); setMsg("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const json = (await res.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> };
      if (!res.ok) { if (json.fields) setErrors(json.fields); throw new Error(json.error ?? "Something went wrong."); }
      setState("success"); setMsg(labels.success); form.reset();
    } catch (err) { setState("error"); setMsg(err instanceof Error ? err.message : "Something went wrong."); }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3" aria-label="Contact form">
      <Field id="cf-name" label={labels.name} error={errors.name}>
        <input id="cf-name" name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby="cf-name-err" className={input} />
      </Field>
      <Field id="cf-email" label={labels.email} error={errors.email}>
        <input id="cf-email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby="cf-email-err" className={input} />
      </Field>
      <Field id="cf-message" label={labels.message} error={errors.message}>
        <textarea id="cf-message" name="message" rows={5} required aria-invalid={!!errors.message} aria-describedby="cf-message-err" className={cn(input, "resize-none")} />
      </Field>
      {/* honeypot — hidden from people and assistive tech */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <PixelButton type="submit" disabled={state === "loading"}>{state === "loading" ? "Sending…" : labels.submit}</PixelButton>
        <p role="status" aria-live="polite" className={cn("text-[14px]", state === "error" ? "text-red-600" : "text-soft")}>{msg}</p>
      </div>
    </form>
  );
}
