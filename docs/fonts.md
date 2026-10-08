# Public website fonts

## Shared public typography — 2026-10-08

Public text uses self-hosted Plus Jakarta Sans for Latin and the owner's selected
Alexandria for Arabic. Both normal variable fonts load through `next/font/local`
in `src/app/(frontend)/layout.tsx`. Document defaults, Tailwind sans utilities,
links, native controls and the decorative ResearchGate mark inherit this policy,
including the hero's Découvrir link. CMS/admin typography has its own layout and
is outside this integration.

The shared body stack places Alexandria before `--font-latin`, which resolves to
Plus Jakarta Sans and its loading fallback. Alexandria's font face uses the exact
upstream Arabic `unicode-range`: Arabic characters select Alexandria in every
locale, including language labels on French and English pages; Latin text selects
Jakarta on Arabic pages too. Numeric figures explicitly use `--font-latin`.
Arabic retains natural tracking. The upstream range excludes the nominal ASCII
`A` in the Alexandria subset so that it cannot override Jakarta for Latin text.

Both files are served from the same application origin with `font-display: swap`
and automatic preload. No visitor or build request to Google Fonts is required,
and no font package was added to runtime dependencies. Jakarta retains Next.js's
metric-adjusted Arial loading fallback. Alexandria uses
`adjustFontFallback: false` so Alexandria does not add a Latin metric fallback
before Jakarta in the shared stack. A computed stack can contain Arial while
the rendered text uses the installed fonts; inspect the rendered family after
`document.fonts.ready` to establish actual usage.

## Plus Jakarta Sans Latin

The 27,348-byte normal variable file supports weights 200–800 (default 400).
Its 230 mapped characters include French accents, Œ/œ, English text, common
punctuation and symbols. It has no mapped Arabic-script glyphs; Alexandria supplies
the Arabic companion. No italic asset was introduced.

### Source and license

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

The downloaded archive's SHA-512 was verified against the npm registry integrity
record before copying its font and license:

```text
sha512-/l/4r0yyWK9JzAlmA0LiYgGgmJe/Gswt4jTJEzr5QhJfwMbvJZDmYWyW0M4X7yCK69BajMVlV/Lx8g7WDc1+sw==
```

| Repository file                          | SHA-256                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `plus-jakarta-sans-latin-variable.woff2` | `153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79` |
| `OFL.txt`                                | `e07fd1167c2aaaa6fb965dd66e1e73b13c9c95b76b2d648b6e938780f30b37af` |

## Alexandria Arabic

The owner's selected Arabic family uses a 31,348-byte normal variable subset,
with weights 100–900 (default 400) and 270 mapped characters. The font and license
were copied unchanged from the verified distribution; only the served filename
was renamed.

### Source and license

- Original family: [Alexandria by the project authors](https://github.com/Gue3bara/Alexandria).
- Upstream source recorded by the distributor: [Google Fonts](https://github.com/google/fonts),
  family version `v6`, last modified `2025-09-05`.
- Font binary metadata: family `Alexandria`, PostScript name
  `Alexandria-Regular`, version `5.100`.
- Pinned distribution: [@fontsource-variable/alexandria 5.3.0](https://registry.npmjs.org/@fontsource-variable/alexandria/-/alexandria-5.3.0.tgz).
- License: SIL Open Font License 1.1 (`OFL-1.1`), copyright 2022 The Alexandria
  Project Authors. The original notice and full 4,389-byte license are retained
  byte-for-byte in [OFL.txt](../src/fonts/alexandria/OFL.txt).
- Distribution entry: `package/files/alexandria-arabic-wght-normal.woff2`.
- Repository copy: `src/fonts/alexandria/alexandria-arabic-variable.woff2`.
- Public/private status: redistributable public application font under OFL 1.1.

The downloaded archive's SHA-512 matches the npm registry integrity record:

```text
sha512-SIMkP0elELBKNl58Ak7IhTeLQqclV9ziwC/BAAF7n26cBIuz5kNFQdCUmbaHxLJW1WZlGbfK6WE3rdFmuJHC5A==
```

| Repository file                    | SHA-256                                                            |
| ---------------------------------- | ------------------------------------------------------------------ |
| `alexandria-arabic-variable.woff2` | `e8d8ca61d4da1a1a38b9454dbae92be589185efc7af0af6046f6a11c60476e99` |
| `OFL.txt`                          | `491200f67c5d48f10cf090b6a86a61abc1e3ab9c496e43e6787ffb5601a43e34` |

## Verification

Source inspection decoded both WOFF2 files and confirmed the metadata and weight
axes above. Their combined glyph maps cover all 74 unique characters in the
Arabic message catalog at installation, with no missing Arabic characters. Binary and
license hashes, archive integrity and byte identity were verified independently
of browser rendering.

The original Latin installation's focused ESLint, formatting and whitespace
checks, and its French/English catalog coverage, predate Alexandria. They do not
establish the new shared stack's rendered coverage.

After a production build, inspect headings, hero actions, header/footer controls,
Arabic language labels on Latin pages and mixed text on Arabic pages after
`document.fonts.ready`. Confirm rendered Jakarta for Latin and numeric figures,
Alexandria for Arabic, successful local requests and no third-party font request.
Check French accents/ligatures, the used weights, RTL layout, natural Arabic
tracking and containment at desktop/mobile widths and enlarged text. The current
revision's executed checks and rendered coverage belong in
[the validation log](validation.md).
