# Public website fonts

## Plus Jakarta Sans — installed 2026-10-08

French and English use the intended Plus Jakarta Sans family, self-hosted through
`next/font/local` in `src/app/(frontend)/layout.tsx`. The loader exposes
`--font-plus-jakarta-sans` on the public document; `--font-latin` uses it before
the system fallback stack. Links and native buttons inherit the shared body
family, including the hero's Découvrir link. CMS/admin typography has its own
layout and is outside this integration.

The normal Latin variable file supports weights 200–800 and is 27,348 bytes.
It includes French accents and Œ/œ, English text, common punctuation and symbols.
Other scripts or characters outside this subset use the declared system
fallbacks. Arabic continues to use the existing Tahoma/Arial stack and natural
letter spacing while its intended companion family awaits review. No additional
family or italic asset was introduced.

The file is served from the same application origin with `font-display: swap`,
automatic preload and Next.js's metric-adjusted Arial loading fallback. No
visitor or build request to a remote font service is required. A computed font
stack can still contain Arial as a fallback; inspecting the rendered font after
`document.fonts.ready` distinguishes that stack from the typeface actually used.

## Source and license

- Original family: [Plus Jakarta Sans by the project authors](https://github.com/tokotype/PlusJakartaSans).
- Upstream source recorded by the distributor: [Google Fonts](https://github.com/google/fonts),
  family version `v12`, last modified `2025-09-10`.
- Font binary metadata: family `Plus Jakarta Sans`, PostScript name
  `PlusJakartaSans-Regular`, version `2.071;gftools[0.9.30]`, 230 mapped characters.
- Pinned distribution: [@fontsource-variable/plus-jakarta-sans 5.3.0](https://registry.npmjs.org/@fontsource-variable/plus-jakarta-sans/-/plus-jakarta-sans-5.3.0.tgz).
- License: SIL Open Font License 1.1 (`OFL-1.1`). The original copyright notice
  and full license are retained byte-for-byte in
  [OFL.txt](../src/fonts/plus-jakarta-sans/OFL.txt).
- Distribution entry:
  `package/files/plus-jakarta-sans-latin-wght-normal.woff2`.
- Repository copy:
  `src/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-variable.woff2`.
- Public/private status: redistributable public application font under OFL 1.1.
  The filename was changed for clarity; the font bytes were preserved.
- No font package was added to runtime dependencies.

The downloaded archive's SHA-512 was verified against the npm registry integrity
record before copying its font and license:

```text
sha512-/l/4r0yyWK9JzAlmA0LiYgGgmJe/Gswt4jTJEzr5QhJfwMbvJZDmYWyW0M4X7yCK69BajMVlV/Lx8g7WDc1+sw==
```

| Repository file                          | SHA-256                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `plus-jakarta-sans-latin-variable.woff2` | `153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79` |
| `OFL.txt`                                | `e07fd1167c2aaaa6fb965dd66e1e73b13c9c95b76b2d648b6e938780f30b37af` |

## Verification

The installed Next.js font parser successfully decoded the WOFF2 and confirmed
its variable weight axis (200–800, default 400). Every character in the current
French and English message catalogs has a glyph in this subset. Font/license
hashes, archive integrity, focused ESLint, formatting and diff whitespace checks
passed.

After a production build, inspect FR/EN headings, hero actions and header/footer
controls after `document.fonts.ready`; confirm the rendered family is Plus Jakarta
Sans, the local font request succeeds and no third-party font request occurs.
Check French accents/ligatures, 400/500/600/700 weights and viewport containment at
desktop/mobile widths and enlarged text. In Arabic, verify the existing body
family, RTL layout and natural tracking. The current task's executed checks and
rendered coverage belong in [the validation log](validation.md).
