import manifest from "@/assets/manifest.json";
import harpImages from "@/assets/harp-images.json";

export type AssetStatus = "retrieved" | "unretrievable" | "dropped" | "redrawn" | "replaced-equivalent";
export interface AssetEntry {
  id: string; kind: string; status: AssetStatus; local: string | null;
  originalUrl: string; note?: string; usedOn?: string[];
}

const byId = new Map<string, AssetEntry>((manifest.entries as unknown as AssetEntry[]).map((e) => [e.id, e]));
const harp = harpImages as Record<string, string>;

/** Looks an asset up by logical id. Unknown ids are a programming error, never silently ignored. */
export function getAsset(id: string): AssetEntry {
  const a = byId.get(id);
  if (!a) throw new Error(`Unknown asset id "${id}" — add it to assets/asset-catalog.json and run pnpm assets:manifest`);
  return a;
}

export const isReferenceMode = () => process.env.NEXT_PUBLIC_CONTENT_SOURCE === "reference";

/**
 * Resolves the file to display for a slot id.
 *  • reference mode → the retrieved ORIGINAL file (if any)
 *  • HARP mode      → only files HARP placed in public/assets/harp/<id>.<ext>; Precept originals are never shown
 */
export function resolveMedia(id: string): { src: string | null; mode: "reference" | "harp" } {
  if (isReferenceMode()) return { src: getAsset(id).local, mode: "reference" }; // validates the id against the catalog
  return { src: harp[id] ?? null, mode: "harp" };
}

export const assetSummary = manifest.summary as Record<string, number>;
