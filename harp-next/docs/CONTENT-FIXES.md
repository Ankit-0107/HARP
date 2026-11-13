# Content fixes & content-handling decisions

## Spelling / grammar fixes (decision 6) — meaning unchanged
| Where | Original | Fixed |
|---|---|---|
| About → Locations (London) | `LND@precpet.com` | `LND@precept.com` (reference dataset only) |
| About → Contact | `Investor Realtions` | `Investor Relations` |
| Home → Newsroom eyebrow | `Recent NEwas` (frozen mid-scramble in the static export) | `Recent News` |
| Privacy → date | `June, 5 2026` | `June 5, 2026` (rendered via `formatDate`) |
| `<link rel=canonical>` | relative `index.html` | absolute, per-page canonical via `generateMetadata` |
| Footer menu | listed "404" as a page | removed |

## Removed by owner decision
Template promo module ("Precept™ from $99 / Buy Now" → polar.sh), Flowit.Supply credit, Framer editor-bar/search artefacts, Precept favicon and OG image (replaced by clearly-marked placeholders `app/icon.svg`, `app/opengraph-image.tsx`).

## Reference vs HARP content (instruction 12)
- `content/reference/` — verbatim original copy with only the fixes above. Used for visual comparison; `noindex`, `robots: Disallow /`.
- `content/harp/` — the default. **The only verified HARP fact is the name.** Everything else is `[TBD] …`, `null` (numbers render "TBD"), or an empty email/link (renders an inert marked placeholder).
- HARP mode never shows Precept images (even once downloaded) and never reuses the reference privacy policy. `scripts/verify-harp-mode.py` fails if any Precept string (names, figures, address, etc.) appears on any route.
- Structural UI labels (Home, About, Submit, Menu…) are kept; they are not business claims.
