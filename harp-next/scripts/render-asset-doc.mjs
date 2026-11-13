#!/usr/bin/env node
// Renders docs/ASSET-MANIFEST.md from assets/manifest.json so the human-readable table can never drift from the data.
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const m = JSON.parse(fs.readFileSync(path.join(root, "assets/manifest.json"), "utf8"));
const esc = (s) => String(s ?? "").replace(/\|/g, "\\|");
const reason = (e) => e.status === "retrieved" ? (e.hash === "inline-data-uri" ? "extracted verbatim from inline data URI in the source HTML" : "downloaded")
  : e.status === "unretrievable" ? `download failed: ${e.fetchLog?.error ?? "not attempted"}` : e.decisionReason ?? "";
const rows = m.entries.map((e) => `| \`${e.id}\` | ${e.kind} | **${e.status}** | ${e.local ? `\`${e.local}\`` : "—"} | ${esc(e.hash === "inline-data-uri" ? "(inline data URI)" : e.originalUrl)} | ${esc((e.usedOn ?? []).join(", "))} | ${esc(reason(e))}${e.note ? ` — ${esc(e.note)}` : ""} |`);
const groups = m.groups.map((g) => `| \`${g.id}\` | ${g.count} files | **${g.decision}** | ${esc(g.replacement ?? "—")} | ${esc(g.decisionReason)} |`);
const out = `# Asset manifest

_Generated from \`assets/manifest.json\` by \`pnpm assets:doc\` — do not edit by hand._
Source: \`${m.source}\` · generated ${m.generatedAt}

## Summary
${Object.entries(m.summary).map(([k, v]) => `- **${k}**: ${v}`).join("\n")}

**Status meanings** — \`retrieved\`: original file is in \`public/assets/original/\` · \`unretrievable\`: download attempted and failed; the UI shows an *explicit labelled placeholder*, never a silent stand-in · \`dropped\`: intentionally not migrated (owner decision) · \`redrawn\`: tiny SVG glyph re-created as inline React SVG.

**How to fill the gaps:** run \`pnpm assets:fetch\` on a machine that can reach \`framerusercontent.com\` (or drop the files into \`public/assets/original/<id>.<ext>\`), then \`pnpm assets:manifest\`. Reference mode will pick them up automatically.
**HARP mode never displays these originals.** HARP imagery goes in \`public/assets/harp/<id>.<ext>\` (the same slot ids), then \`pnpm assets:manifest\`.

## Individual assets (${m.entries.length})
| id | kind | status | local file | original reference | used on | notes |
|---|---|---|---|---|---|---|
${rows.join("\n")}

## Font groups
| id | count | decision | replacement | reason |
|---|---|---|---|---|
${groups.join("\n")}

## Other external references in the source (not assets)
| reference | decision |
|---|---|
| \`framerusercontent.com/sites/…/*.mjs\` (≈27 Framer runtime/component modules) | Not in ZIP, unreachable → behaviour re-implemented; see UNRECOVERABLE.md |
| Framer search-index JSON, editor-bar CSS | dropped (Framer-platform only) |
| \`buy.polar.sh\`, \`flowit.supply\`, template promo module | **removed** (owner decision 1) |
| \`precept.framer.website\` (og:url / canonical) | dropped — HARP uses its own \`NEXT_PUBLIC_SITE_URL\` |
| \`instagram.com\`, \`facebook.com\`, \`linkedin.com\`, \`x.com\` (generic homepages, not real profiles) | reference mode keeps them; HARP mode shows inert \`[TBD]\` entries |
`;
fs.writeFileSync(path.join(root, "docs/ASSET-MANIFEST.md"), out);
console.log("docs/ASSET-MANIFEST.md written");
