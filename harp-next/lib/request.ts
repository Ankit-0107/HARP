/** Shared checks for POST route handlers. Returns a Response to short-circuit, or the client key on success. */
export function guard(req: Request, maxBytes = 20_000): Response | { ip: string } {
  const origin = req.headers.get("origin"), host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return Response.json({ error: "Forbidden." }, { status: 403 });
  if (Number(req.headers.get("content-length") ?? 0) > maxBytes) return Response.json({ error: "Request too large." }, { status: 413 });
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return Response.json({ error: "Unsupported media type." }, { status: 415 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return { ip };
}
