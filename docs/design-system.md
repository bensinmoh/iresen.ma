# Design system foundation

The supplied color book and seven SVGs establish the foundation's identity. The color-book text and SVG XML were inspected; source hashes and exact filenames are recorded in the [asset inventory](asset-inventory.md). Website exports and Illustrator boards remain unavailable for direct visual comparison.

## Initial semantic colors

| Color            | Value     | Use                                      |
| ---------------- | --------- | ---------------------------------------- |
| Navy             | `#12345A` | Headings, readable text, formal surfaces |
| IRESEN Blue      | `#296BB4` | Links, primary actions, active states    |
| Science Blue     | `#4698CA` | Select technical emphasis                |
| Transition Green | `#50A684` | Select transfer/innovation accents       |
| Energy Cyan      | `#77C5D5` | Light accents                            |
| Innovation Lime  | `#A9C47F` | Rare highlights                          |
| Light surface    | `#F4F7F8` | Neutral section contrast                 |
| White            | `#FFFFFF` | Reading surfaces                         |

The owner's final correction on 2026-10-07 sets website primary blue to `#296BB4`, matching the inspected color-book v0.9 and every current blue-bearing SVG, including the latest corrected favicon. Use `#296BB4` for website primary-blue and focus tokens; copy received vectors byte-identically. The Illustrator board remains uninspected. See [ADR 0003](adr/0003-owner-selected-primary-blue.md).

Use `logo-color.svg` on light surfaces and the reversed variants on navy. The newly received `logo-primary.svg` has a different aspect ratio; preserve its own geometry when used. Both `logo-white.svg` and `logo-monochrome.svg` have white fills; filenames do not make either a navy-on-white mark. Keep SVG proportions and reserve intrinsic geometry to avoid layout shift. Use the actual `favicon.svg`, not a screenshot-derived substitute.

## Layout and typography

Use semantic CSS custom properties with Tailwind utilities. Start with fluid gutters, about 1280px content width and a 4/8px spacing rhythm. Keep full-width section boundaries flat. Apply the physical top-left/bottom-right rounded signature selectively to cards and media.

Use licensed, self-hosted Plus Jakarta Sans for Latin when available and a reviewed Arabic family. Current fallback fonts are deliberate; no font license/files were verified. Use the received vector wordmark rather than recreating it as live text.

## Interaction and acceptance

Keep navigation operable by keyboard, touch and pointer. Use visible focus, correct landmarks, a skip link and reduced-motion support. Avoid autoplay carousels and decorative animation libraries in the foundation.

Check actual rendered contrast; brand colors do not automatically make accessible status colors. Normal text needs 4.5:1 contrast. Cyan/lime and certain green/blue combinations are unsuitable for normal white/body text.

Next homepage work uses the supplied brand identity and the approved Développer · Éprouver · Valoriser reading framework. The internal narrative is a private working reference, not publishable copy; final wording/translations and claims require approval. Distinguish verified current capabilities from ambitions and never invent key figures.

Review desktop/tablet/mobile composition, Arabic layout, long-label/header fit and manual accessibility. Obtain individual approved imagery or documented replacements; full-page screenshots are never production imagery. Missing exports/fonts do not block the foundation.
