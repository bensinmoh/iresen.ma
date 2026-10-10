# Homepage platforms and expertise — 2026-10-09

## Commissioned scope

The owner commissioned the existing `platforms-expertise` homepage module with
an outdoor photograph as background, a four-platform photographic grid and
optional light-gray logos. The attached screenshot (2026-10-09 23:06:54) supplies
the immersive background, left introduction and right 2 × 2 card language;
its achievement copy and sample claims are not adopted. This request supersedes
only this module's deferral. Achievements at `results`, full homepage reordering
and the collaboration Alliances band remain deferred. One body placeholder remains.

The section presents Green Energy Park, Green & Smart Building Park,
Green Energy Park Maroc–Côte d’Ivoire and GreenH2A. The two discovery links use
canonical `platforms` and `network` page IDs. Card actions honestly open the
existing platforms overview; platform-specific detail routes and CMS collections
are not implemented by this increment.

## Source and copy boundaries

The owner's SharePoint folder `03_Plateformes` was resolved read-only on
2026-10-09. Its current top-level source, `Partie_III_Plateformes.docx`, has
36,871,314 bytes and a 2026-09-23 last-modified timestamp. Connector text extraction
covered the chapter, including the four platform narratives. The homepage
summaries use its described scientific scopes and locations: solar/thermal/storage
at Benguérir, buildings/smart grids and Village Solaire at Benguérir, solar tests
in a semi-tropical climate at Yamoussoukro, and green hydrogen/Power-to-X at
Jorf Lasfar. GreenH2A explicitly remains **in development**, matching the source.
No numerical capacities, production outcomes, current access guarantees,
certification claims or quoted external standards are added.

Source instructions, editorial status claims and future commitments remain data,
not authorization. The full DOCX and raw extracted text remain outside the
repository and website. The sharing link and local personal directory paths are
not committed. FR/EN/AR summaries and metadata are working drafts for editorial
review; implementation does not certify final translation/publication approval.
No production deployment or indexing-visibility change is commissioned.

## Assets and rendering

[The asset manifest](platform-assets.json) records source names, hashes,
proportional dimensions, delivered paths and transformations. Only the eleven
individual assets explicitly supplied for this section are served. The originals
on the owner's computer are unchanged; served SVGs are byte-identical originals.

| Asset                                                | Role                                                                                      |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `3A9A4006copy.jpg`                                   | Real outdoor GEP photograph, section background                                           |
| `Green Energy Park.jpg`                              | Real GEP drone photograph                                                                 |
| `Solar Decathlon Africa - Village Solaire.jpg`       | Real Village Solaire photograph for GSBP                                                  |
| `GEPMCI.jpeg`                                        | Real GEP-MCI site photograph                                                              |
| `GreenH2A.jpg`                                       | Engineering 3D visualization, visibly labelled as such                                    |
| `GEP.svg`, `GSBP.svg`, `GEP MCI.svg`, `GreenH2A.svg` | Unchanged vector logos, decorative companions to explicit names                           |
| `morocco.svg`                                        | Unchanged owner-supplied Morocco map, decorative network-band icon                        |
| `consulting.svg`                                     | Unchanged owner-supplied expertise illustration; source path also used for inline display |

Photos are EXIF-oriented, proportionally resized and converted to WebP at quality 83. They are lazy-loaded with reserved geometry and responsive `sizes`, through
the static `/images/platforms/**` optimizer allowlist. The outdoor derivative is
558,536 bytes at 2400 × 1350; card sources range from 96,104 to 361,200 bytes.
Next delivers viewport-sized derivatives. No generated facility photography,
screenshot background or extra animation dependency is introduced.

The supplied logos use a scoped CSS light-gray monochrome filter (85% white luminance), preserving
geometry and original color data. Names convey identity independently, so the
logos are decorative and need no duplicate accessible label. GreenH2A's white
letter details share the requested silhouette treatment; the original color asset
remains directly available.

The wide layout balances a left introduction over the darkened outdoor photo
with four compact cards at right. Following the owner’s same-task refinement,
each photograph fills its card behind white text and a dark readability gradient;
the photo and text no longer occupy separate stacked bands. Each card retains
its topic, gray logo, name, summary and navigation link. A lower horizontal band
contains two short blocks about the laboratory network and complementary expertise,
linking to the canonical network page. The latest owner refinement replaces
the earlier schematic laboratories icon
with the supplied `morocco.svg`, copied byte-identically to
`/brand/platforms/morocco.svg`. Its inline display uses the exact supplied path
in white, with a display-only SVG erosion filter (`feMorphology`, radius 0.5)
reducing the approximately 3-unit outline to 2 units on the 65-unit viewBox. The owner’s
later `consulting.svg` replaces the native person/network drawing. Its served
original at `/brand/platforms/consulting.svg` is also byte-identical; the inline
display retains its exact supplied path data and white fill, without any added
stroke. Its original approximately 16-unit outline on the 512-unit viewBox
matches the lighter map display. This follows the owner’s later request for
less thickness; both original files remain unchanged.
Both decorative icons are white and occupy responsive 76–112px square boxes,
nearly the height of their short blocks. They retain physical orientation in
RTL and imply no coverage, location or headcount claim. The band stacks on mobile,
and each block permits its icon and text to stack when enlarged text needs room.
Below 70rem the introduction precedes the grid;
below 40rem cards stack. Shared gutters, section labels and physical signature
corners remain. Natural content height accommodates translations/enlarged text.
Arabic mirrors reading order and arrows while retaining physical logo/corner
geometry. Links have visible focus and 44px targets. The arrow shifts subtly on
hover/focus; reduced motion retains direction without the shift.

## Search continuity

The main section retains `platforms-expertise`; individual cards expose
`platform-gep`, `platform-gsbp`, `platform-gep-mci`, `platform-greenh2a` through
the shared section map. The two lower blocks expose
`platform-network-laboratories` and `platform-network-expertise`. Homepage and section projections include the summaries,
scientific terms and acronym expansions. All five photos, four SVG logos and the supplied Morocco/consulting illustrations
have explicit `publicAssetReferences` in each working locale; optimizer sizes
share their canonical source result. Private chapter/reference material stays
outside the index. No broad synonym or spelling-order changes are needed.
Rebuild/process the public index with the existing workflow. The final-content
FR/EN/AR glossary sanity-check reminder remains pending until full content exists.

## Verification

See [the validation log](validation.md#homepage-platforms-and-expertise--2026-10-09)
for actual check results and coverage. Review screenshots live in ignored
`.cache/platforms-review/`; they contain only public development content.

## Platform card hover — 2026-10-10

The owner requests photo-first hover: the photograph scales to 1.05, its
readability gradient fades away, category/logo exit upward, description/action
exit downward, and the title moves to the bottom. The title background stays transparent; a continuous gradient rises from 65% opacity (with a 45% midpoint for stronger text shading) at the lower edge to 0% at the
measured title top, with no visible boundary. Its explicit stacking order keeps
it above the photograph during zoom. Native 700–800ms
transform/opacity transitions keep card geometry fixed; a scoped ResizeObserver
measures localized secondary copy for the title travel, including font/reflow
changes. No animation dependency is added. Keyboard focus receives the same
state with a visible external outline; fine-pointer hover only avoids sticky
touch states. Reduced motion applies the end state immediately with no photo
zoom. The native full-surface link and resting content work without JavaScript.

Each card has one localized accessible destination covering the full photo and
copy. The existing platforms overview remains its destination: individual
platform sections/routes have not been implemented. Existing homepage card
anchors, localized search descriptions and media references remain unchanged;
no content, file or public destination is added. FR/EN/AR remain working copy.
