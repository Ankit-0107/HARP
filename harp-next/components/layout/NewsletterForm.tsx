"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";

type State = "idle" | "loading" | "success" | "error";

export function NewsletterForm({ placeholder, button, success }: { placeholder: string; button: string; success: string }) {
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setState("success"); setMsg(success); (e.target as HTMLFormElement).reset();
    } catch (err) { setState("error"); setMsg(err instanceof Error ? err.message : "Something went wrong."); }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-sm">
      <div className="flex items-center border-b border-white/30 focus-within:border-white">
        <label htmlFor="nl-email" className="sr-only">Email</label>
        <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder={placeholder}
          className="h-11 w-full bg-transparent text-[15px] text-white placeholder:text-white/40 focus:outline-none" />
        {/* honeypot — real users never see or fill this */}
        <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
        <button type="submit" disabled={state === "loading"} className="h-11 shrink-0 pl-4 font-mono text-[12px] uppercase tracking-wide text-white hover:text-accent disabled:opacity-50">
          {state === "loading" ? "…" : button}
        </button>
      </div>
      <p role="status" aria-live="polite" className={cn("mt-2 min-h-5 text-[13px]", state === "error" ? "text-red-400" : "text-accent")}>{state === "success" || state === "error" ? msg : ""}</p>
    </form>
  );
}
