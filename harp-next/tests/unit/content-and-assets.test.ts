import { describe, expect, it } from "vitest";
import { getContent, isTbd } from "@/lib/content";
import { getAsset, resolveMedia } from "@/lib/assets";
import { formatDate } from "@/lib/format";
import { harp } from "@/content/harp";
import { reference } from "@/content/reference";
import catalog from "@/assets/asset-catalog.json";

describe("Content Separation & Parity", () => {
  it("default getContent returns harp content", () => {
    const c = getContent();
    expect(c.source).toBe("harp");
    expect(c.brand.name).toBe("HARP");
  });

  it("harp content contains zero leaks of template vendor terms", () => {
    const serialized = JSON.stringify(harp).toLowerCase();
    expect(serialized).not.toContain("flowit");
    expect(serialized).not.toContain("polar.sh");
    expect(serialized).not.toContain("buy now");
    expect(serialized).not.toContain("$99");
    expect(serialized).not.toContain("precpet");
    expect(serialized).not.toContain("realtions");
  });

  it("all 4 capabilities are defined in both datasets", () => {
    expect(harp.capabilities.items).toHaveLength(4);
    expect(reference.capabilities.items).toHaveLength(4);
    const harpSlugs = harp.capabilities.items.map((i) => i.slug);
    const refSlugs = reference.capabilities.items.map((i) => i.slug);
    expect(harpSlugs).toEqual(refSlugs);
    for (const slug of harpSlugs) {
      expect(harp.capabilityDetails[slug!]).toBeDefined();
      expect(reference.capabilityDetails[slug!]).toBeDefined();
    }
  });

  it("all 8 newsroom stories are defined in both datasets", () => {
    expect(harp.newsroom.entries).toHaveLength(8);
    expect(reference.newsroom.entries).toHaveLength(8);
    const harpSlugs = harp.newsroom.entries.map((e) => e.slug);
    const refSlugs = reference.newsroom.entries.map((e) => e.slug);
    expect(harpSlugs).toEqual(refSlugs);
  });

  it("HARP placeholders are properly marked and no numbers invented", () => {
    for (const stat of harp.home.stats.items) {
      expect(stat.value).toBeNull();
    }
    expect(harp.careers.positionsCount).toBeNull();
    expect(harp.privacy.status).toBe("placeholder");
    for (const loc of harp.about.locations.locations) {
      expect(loc.email).toBe("");
    }
  });
});

describe("Asset Catalog & Resolution", () => {
  const catalogIds = new Set(catalog.entries.map((e) => e.id));

  it("every asset id used in reference content is in asset-catalog.json", () => {
    const checkId = (id: string) => {
      expect(catalogIds.has(id)).toBe(true);
      expect(() => getAsset(id)).not.toThrow();
    };

    reference.home.slider.forEach((s) => checkId(s.assetId));
    reference.home.industries.forEach((s) => checkId(s.assetId));
    reference.about.timeline.items.forEach((t) => checkId(t.assetId));
    reference.about.leadership.people.forEach((p) => checkId(p.assetId));
    reference.about.locations.locations.forEach((l) => checkId(l.assetId));
    reference.capabilities.items.forEach((c) => checkId(c.assetId));
    reference.newsroom.entries.forEach((e) => {
      checkId(e.heroAssetId);
      if (e.authorAssetId) checkId(e.authorAssetId);
    });
  });

  it("HARP mode resolves to null for missing assets without leaking reference assets", () => {
    const res = resolveMedia("hero-poster");
    expect(res.mode).toBe("harp");
    // Unless a user placed a file in public/assets/harp/hero-poster.*, src must be null
    expect(res.src).toBeNull();
  });

  it("throws error on unknown asset id", () => {
    expect(() => getAsset("non-existent-asset-12345")).toThrow(/Unknown asset id/);
  });
});

describe("Formatting & Helpers", () => {
  it("formatDate handles null and valid ISO dates", () => {
    expect(formatDate(null)).toBe("[TBD] date");
    expect(formatDate("2026-03-15")).toContain("2026");
    expect(formatDate("2026-03-15")).toContain("March");
  });

  it("isTbd helper detects placeholders accurately", () => {
    expect(isTbd(null)).toBe(true);
    expect(isTbd("")).toBe(true);
    expect(isTbd("TBD")).toBe(true);
    expect(isTbd("[TBD] something")).toBe(true);
    expect(isTbd("Verified content")).toBe(false);
  });
});
