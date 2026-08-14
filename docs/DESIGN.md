# Design system

## Color
Defined as CSS custom properties in `src/app/globals.css` under `@theme`.
Two families, each a warm, non-neutral scale (olive-brown ink on a
faintly yellow-green paper — not true black-on-white), plus two accents.

| Token | Hex | Role |
|---|---|---|
| `--color-ink` | `#2e2910` | Primary text |
| `--color-ink-90`…`-50` | — | Text weight steps, darkest to lightest |
| `--color-ink-30` | `#9a936f` | Rules / disabled marks **only** — never words |
| `--color-ink-15` | `#ddd9c8` | Hairlines |
| `--color-paper` | `#faf7ee` | Primary ground |
| `--color-paper-dim` / `--color-linen` / `--color-linen-deep` | — | Secondary grounds |
| `--color-forest` | `#2c5745` | Brand green |
| `--color-champagne` | `#ebe3a7` | Secondary brand accent |
| `--color-ember` | `#eb7d00` | **CTA, active, saved, progress — nowhere else** |

Every text/ground pairing used in the UI clears WCAG 2.2 AA (4.5:1), and the
source comments carry the measured ratios: ink-on-paper 13.61, ink-70-on-paper
5.63, ink-80-on-paper 9.32, ink-50-on-paper 4.66, ink-50-on-linen 4.04
(large/secondary text only). `ink-30` is the one step that doesn't clear AA
for text and is restricted to rules/disabled state by convention.

**Ember is reserved.** It signals exactly four things — call to action,
active state, "saved," progress — and nothing else, so it stays meaningful
wherever a couple sees it.

## Typography
`--font-display` (Fraunces, via `next/font` in `src/lib/fonts.ts`) for
display type, falling back through `ui-serif, Georgia, serif`.

## Brand and voice
`src/content/brand.ts` is the single source for every brand string: name
("Marram"), wordmark, positioning line, meta description, contact details,
nav structure, footer structure, and the newsletter copy. Renaming the
studio or changing its voice is a one-file edit — nothing else hardcodes
brand strings.

## Photography
`src/content/media.ts` is a keyed register: components reference a **role
key** (e.g. `first-light`, `venue-elmhurst`), never a URL. The register maps
a role to a photograph with alt text, a dominant `tone` (used for the blur-up
placeholder), and an aspect ratio.

- `photoUrl()` builds the CDN URL; `tonePlaceholder()` builds the
  dominant-tone blur shown before the real image loads. Swapping both is
  the whole image-pipeline migration.
- `Photograph` carries `credit`/`creditUrl` — currently Unsplash for all
  demo photography.
- Alt text is written once in the register and inherited everywhere a role
  key is used, rather than repeated at call sites.
- Images reserve their aspect box up front and paint the tone placeholder
  before loading, which is why CLS measures zero across the site
  (`docs/ARCHITECTURE.md`-adjacent performance note, not reproduced here).

## Accessibility
- Every text/ground color pairing in the token set clears WCAG 2.2 AA (see
  ratios above).
- All focusable elements take a visible ember focus ring immediately on
  focus (not only on `:focus-visible` fallback) — deliberately the one place
  a color is hardcoded outside the token system, called out in a comment in
  `globals.css`.
- `prefers-reduced-motion` disables every animation, including Lenis smooth
  scroll.
- Form fields use associated `<label>`s (fixed as part of the 2026-08-14
  hardening pass for the guest RSVP form specifically).

## Components
- `src/components/ui` — shared primitives (`Button`, `Chip`, `SaveButton`)
  built on `class-variance-authority` + `tailwind-merge` +
  `tailwindcss-animate`.
- Everything else is grouped by domain rather than by generic UI role:
  `cards`, `chrome` (nav/footer), `dashboard`, `directory`, `editorial`,
  `forms`, `gallery`, `home`, `seo`, `site-builder`, `tools` (quiz,
  checklist, timeline, budget).
- Motion: `motion` (Framer Motion) for interaction/entrance animation,
  `lenis` for smooth scroll — both gated by `prefers-reduced-motion`.
