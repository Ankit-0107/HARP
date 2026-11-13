import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** A6/A8 — text link with an underline that scales in from scaleX(0) on hover. */
export function HoverLink({ href, children, className, external }: { href: string; children: ReactNode; className?: string; external?: boolean }) {
  const cls = cn("group relative inline-block", className);
  const line = <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-[550ms] ease-expo group-hover:[@media(hover:hover)]:scale-x-100" />;
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}{line}</a>
  ) : (
    <Link href={href} className={cls}>{children}{line}</Link>
  );
}

/** Email that degrades to an inert, clearly marked placeholder when the address is not yet verified. */
export function EmailLink({ email, className }: { email: string; className?: string }) {
  if (!email) return <span className={cn("tbd px-1", className)}>[TBD] email</span>;
  return <HoverLink href={`mailto:${email}`} className={className}>{email}</HoverLink>;
}
