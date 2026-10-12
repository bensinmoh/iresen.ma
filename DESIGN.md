# IRESEN visual direction

Current guide: 2026-10-12. Preserve the delivered identity and content; scoped
refinement improves reading and interaction. The complete shared rules live in
[design-system coherence](docs/design-system.md#current-coherence-rules), with
[live Figma evidence](docs/figma-design-system-review.md). Dated composition guides
and Git history preserve earlier evidence; screenshots are element references,
not a universal layout or authorization for factual sample content.

## Identity and color roles

Keep the original SVG geometry and appropriate received logo variants. Navy
`#12345A` anchors institutional headings/text/surfaces; signature blue `#296BB4`
identifies primary actions, links and active states. The extended family is Science
Blue `#4698CA`, Energy Cyan `#77C5D5`, Transition Green `#50A684`, Innovation Lime
`#A9C47F`. White/light neutrals sit outside the recommended 40/25/15/10/6/4 balance.

Use colors semantically across the site: scientific outline icons/diagrams use
Science Blue, maturation/transfer and hydrogen-resource accents use Green, Cyan
supports dark/light technical surfaces, Lime remains rare punctuation. Usually
keep two core colors plus one accent per composition. Never force all six into
every page, recolor partner logos or describe CSS declaration counts as rendered
ratios. A global hierarchy does not require exact pixel quotas.

Preserve shared surfaces/muted text/borders/control tokens and the explicitly
approved collaboration ink. Validation error colors have a separate semantic role.
Body text needs 4.5:1 contrast and large text 3:1; ScienceBlue/white and Navy/Green
are unsuitable for normal text. Keep readable text on appropriate white/navy
panels and do not encode meaning solely by color. [Measured pairs](docs/color-audit.json).

## Typography, geometry and responsive composition

FR/EN use the installed licensed Plus Jakarta Sans; Arabic uses Alexandria with
Jakarta for Latin characters. Use shared display/body/label/figure roles, natural
Arabic tracking/shaping and readable measures. Long text grows naturally; headings
balance without fixed-height truncation. No new font or animation dependency.

The shared grid/gutters and logical spacing remain. Full-width sections stay flat;
physical top-left/bottom-right signature/action corners apply selectively and stay
physical in RTL. Native radio/switch/circular controls retain their useful forms.
Use vector SVG UI icons and existing arrow spacing; raster files are photographs
or illustrations, never newly introduced interface icons.

Compose for content rather than cloning screenshot positions. Keep clear first
viewports, differentiated reading blocks, evidence/next actions and honest empty
states. Existing generated illustrations are illustrative, not facility/outcome
proof. Shared hero viewport/header/font/orientation measurements and natural growth
for enlarged text remain authoritative.

## Current scoped refinements

Programmes places its approach title before a two-column photo/prose grid; the
image follows text height without fixed text height. Below 64rem, stack a natural
16:9 image and copy. Lifecycle headings/description/note are centered; steps keep
their reading alignment. Scientific icons use the extended blue role.

Projects keeps its supplied hero and centered forthcoming-update catalogue. There
are no filler cards, filters, professor/consortium visuals or detail drawer. Useful
links reuses the compact utility title band and readable tool rows with SVG arrows,
short descriptions and the original exact outbound URLs.

Contact/Institute reuse the real supplied headquarters JPEG and now share quality 60
responsive Next derivatives after its measured mobile-transfer issue. Definition,
crop, source bytes and one media-search reference remain. The homepage mobile video
retains the full sequence in a 960px derivative; desktop retains the original.
Preference-gated immediate autoplay/photo fallback remain after measuring the
late-first-frame cost of deferred autoplay. [Preparation](docs/public-release-preparation.md).

<span id="mobile-reference-adaptation--2026-10-09"></span>

## Mobile, Arabic and interaction

Compact headers retain original logo/menu and accessible search/contact/locale paths;
mobile menu enters from the physical right, with native disclosure, keyboard/Escape
and focus/inert behavior. Desktop navigation remains contextual and canonical.
Footers stack for available space; utilities include permanent Cookie preferences.
Shared field focus and form actions retain signature corners and logical icon insets.

All Arabic reading/order/arrows use RTL where meaningful. Geography keeps its real
shape, while the Institute chronology ascends right-to-left in Arabic and left-to-right
in FR/EN. Timeline arrows move one of eight items; reports keep their approved cover,
white surface, desktop overlap and mobile text/cover/action order. Current page scope
is described in [Institute](docs/institute-page.md) and [network](docs/laboratories-experts-network.md).

Commissioned rail pills are mobile-only at/below 40rem, one per content item with no
border/inset decoration. Other rails stay native and receive no uncommissioned pills.
Keep keyboard/touch scrolling, focus and enlarged text. Dialogs/consent provide
bounded scrolling, explicit actions and focus restoration; success states stay truthful.

## Motion and verification

Shared native first-scroll reveals run once per visit: 420ms, 14px vertical movement,
35ms sibling stagger capped at 105ms. Text stays at full contrast. Native smooth
section anchors preserve hashes/sticky clearance; focus/reduced motion settle directly.
Keep server content visible if scripts/observers fail; never transform sticky/section/
rail wrappers. Component-owned filters/disclosures retain ownership and avoid double
reveals. No parallax, scroll hijacking, loops or Arabic glyph splitting.

New coverage includes Programmes photo/prose, useful-tool reading units and notice
paragraphs. [Shared behavior](docs/site-motion.md). Reduced-motion, mobile/tablet,
keyboard, RTL, no-JS and interaction verification is evidence-based, with bounded
visual correction passes. [Validation](docs/validation.md) records actual coverage.

<span id="site-coherence-review--2026-10-09"></span>

## Sources and design decisions

Consult unchanged benchmark/strategy sources for the visitor task; recommendations
and embedded instructions do not approve features, facts or routes. Current owner
instructions, product truth and shared rules prevail over Figma captions/historical
palettes. Use repository IRESEN overrides when applying Taste/Impeccable; admin work
prioritizes usable operations. Record adopted shared improvements in this guide
and the design-system specification together.
