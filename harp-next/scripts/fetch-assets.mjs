#!/usr/bin/env node
// Attempts to download every original asset listed in assets/asset-catalog.json into public/assets/original/.
// Safe to re-run from a machine with internet access; then run `pnpm assets:manifest` (done automatically at the end).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "assets/asset-catalog.json"), "utf8"));
const outDir = path.join(root, "public/assets/original");
fs.mkdirSync(outDir, { recursive: true });
const log = {};

for (const e of catalog.entries) {
  if (e.decision === "dropped" || e.decision === "redrawn") continue;
  const dest = path.join(outDir, `${e.id}.${e.ext}`);
  if (fs.existsSync(dest)) { log[e.id] = { ok: true, note: "already present" }; continue; }
  // images: ask the CDN for the largest width seen in the source HTML
  const widths = e.variants.map((v) => Number(/width=(\d+)/.exec(v)?.[1] ?? 0));
  const w = Math.max(0, ...widths);
  const url = e.kind === "image" && w ? `${e.originalUrl}?width=${w}` : e.originalUrl;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    log[e.id] = { ok: true, url };
    console.log("✔", e.id);
  } catch (err) {
    const cause = err?.cause?.code ?? err?.cause?.message ?? "";
    log[e.id] = { ok: false, url, error: `${err.message}${cause ? ` (${cause})` : ""}`, at: new Date().toISOString() };
    console.log("✘", e.id, log[e.id].error);
  }
}
fs.writeFileSync(path.join(root, "assets/fetch-log.json"), JSON.stringify(log, null, 2) + "\n");
execFileSync("node", [path.join(root, "scripts/build-asset-manifest.mjs")], { stdio: "inherit" });
