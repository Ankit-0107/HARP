"use client";
import { useEffect, useState } from "react";

/** Live clock. Renders nothing on the server (avoids the stale SSR timestamp in the original). `timeZone` TBD → visitor's local time. */
export function WorldClock({ timeZone, className }: { timeZone?: string; className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", timeZone });
    const tick = () => setNow(fmt.format(new Date()));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [timeZone]);
  return <time suppressHydrationWarning className={className} aria-label="Current time">{now ?? "\u00A0"}</time>;
}
