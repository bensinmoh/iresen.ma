# Institute mobile ambition — 24 October 2026

The owner requests removal of the ambition photo on mobile and centered text
and subtitle. At <=40rem the portrait, background photo and photo veil are
hidden, leaving the existing navy surface. The subtitle and full quotation
center in both LTR and RTL, with natural unhyphenated balanced lines.

The unused mobile portrait and its contour-fitting wrapper are removed from
the page markup; the quotation is a native blockquote. The old standalone
AmbitionQuote implementation remains retained but is no longer used here.
Desktop photo placement, text, anchors, copy and media/search identities stay
unchanged.

Development verification: FR390 and AR390 show no portrait/background photo,
centered subtitle and quotation, no hyphenated French words and no horizontal
overflow. AR1440 retains visible desktop portrait/background and right-aligned
quotation. Targeted ESLint, Prettier and whitespace pass. Full tests/build/CI/Git
remain under the existing shared-checkout hold.
