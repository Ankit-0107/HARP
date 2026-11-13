#!/usr/bin/env node
// Builds assets/manifest.json from assets/asset-catalog.json + what actually exists on disk + the last fetch log.
// Status values:
//   retrieved            original file downloaded to public/assets/original/
//   unretrievable        download attempted and failed (reason in fetchLog) — UI shows an explicit placeholder
//   dropped              intentionally not migrated (decision recorded)
//   redrawn              replaced by hand-written inline SVG (decision recorded)
//   replaced-equivalent  same font family from npm
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "assets/asset-catalog.json"), "utf8"));
const logPath = path.join(root, "assets/fetch-log.json");
const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf8")) : {};

const entries = catalog.entries.map((e) => {
  const rel = `assets/original/${e.id}.${e.ext}`;
  const onDisk = fs.existsSync(path.join(root, "public", rel));
  let status;
  if (onDisk) status = "retrieved";
  else if (e.decision) status = e.decision;
  else status = "unretrievable";
  return {
    ...e,
    status,
    local: onDisk ? `/${rel}` : null,
    fetchLog: log[e.id] ?? null,
  };
});

const summary = entries.reduce((acc, e) => ((acc[e.status] = (acc[e.status] ?? 0) + 1), acc), {});
const manifest = {
  generatedAt: new Date().toISOString(),
  source: catalog.source,
  summary,
  entries,
  groups: catalog.groups,
};
// HARP-supplied imagery: any file public/assets/harp/<assetId>.<ext> fills the slot with that id.
const harpDir = path.join(root, "public/assets/harp");
const harpImages = {};
if (fs.existsSync(harpDir)) {
  for (const f of fs.readdirSync(harpDir)) {
    const m = /^(.+)\.(webp|avif|jpe?g|png|svg|mp4|webm)$/i.exec(f);
    if (m) harpImages[m[1]] = `/assets/harp/${f}`;
  }
  const milestoneMap = {
    "timeline-2017": harpImages.milestone1,
    "timeline-2020": harpImages.milestone2,
    "timeline-2022": harpImages.milestone3,
    "timeline-2024": harpImages.milestone4,
    "timeline-present": harpImages.milestone5,
  };
  for (const [k, v] of Object.entries(milestoneMap)) {
    if (v && !harpImages[k]) harpImages[k] = v;
  }
}
fs.writeFileSync(path.join(root, "assets/harp-images.json"), JSON.stringify(harpImages, null, 2) + "\n");
fs.writeFileSync(path.join(root, "assets/manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest written:", summary);
