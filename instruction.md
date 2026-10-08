# IRESEN website — project and development instructions

Version: 1.2 · 8 October 2026 — strategy references and structure status recorded  
Repository: https://github.com/bensinmoh/iresen.ma  
Project owner: Mouhcine BENMEZIANE, Direction Partenariats & Marketing de l’Innovation, IRESEN  
Working language for code and technical documentation: English  
Public website languages: French, English and Arabic

Preparation status: the supplied website exports and Illustrator brand boards have now been visually reviewed. The supplied SVG dimensions/color definitions and local color book have also been inspected. These exports provide a usable visual reference despite the Figma MCP quota limit. Editable Figma layers, component properties, interaction specifications and mobile/RTL designs remain unverified; do not claim an exact token or interaction extraction from screenshots. Repository contents/settings remain unverified and must be inspected at kickoff.

Reference update — 8 October 2026: the owner supplied three DOCX documents for repository reference and analysis, explicitly describing the detailed website structure as recommendations and suggestions, not final validation. See [the source index and analysis](docs/references/strategy/README.md) and [the current route baseline/proposal comparison](docs/route-map.md#structure-recommendations-received-on-2026-10-08). The preparation paragraph above records the original brief's assumptions; current implementation and verification are recorded in README, PRODUCT.md and docs/validation.md. This reference update does not commission page, route or CMS changes.

## 1. Mission and working mandate

Build the new official IRESEN website as a premium, accessible, fast and maintainable institutional platform. It must explain IRESEN’s role, showcase research and experimental capabilities, support partnerships and make institutional resources easy to find. It must also give the communications team a practical interface for managing content without developer intervention.

Act as a senior full-stack developer and design-minded technical partner. Make reasonable implementation choices, explain consequential tradeoffs and deliver working increments. Treat multilingual publishing, security, accessibility, SEO and performance as architectural requirements from the first commit.

Start with repository setup and a clean website boilerplate. Then implement the design system, page templates, editorial backend and integrations in the milestones below. A blank boilerplate means a working foundation with empty content collections and honest empty states; it does not mean a finished homepage populated with invented institutional information.

This document is a development brief. Execute its milestones when commissioned to start implementation. Do not treat drafting or reviewing this document alone as authorization to publish a production website, change repository visibility or alter live DNS.

### Working principles

- Inspect the repository and applicable `AGENTS.md` instructions before changing files. Preserve existing work; never assume the repository is empty.
- Prefer a coherent, small architecture over unnecessary services, frameworks and dependencies.
- Use supported stable releases, verify compatibility against official documentation, pin selected versions and commit the lockfile. Do not use beta/canary packages in production.
- Document consequential architecture decisions in short ADRs. Deviations from this brief must identify the requirement affected and the reason.
- Build real interactions and backend behavior. A visual mockup, a fake contact success message or a CMS populated only with fixtures is not a completed feature.
- Keep content separate from presentation. Reusable templates must work with real variable-length French, English and Arabic content.
- Deliver focused changes with the checks appropriate to the risk. Report what works, what was verified and any remaining dependency on credentials or approved content.
- Keep routine development moving. Record missing deployment credentials, legal validations or editorial assets while continuing independent local work.

## 2. Sources of truth and institutional narrative

Use this precedence when references disagree:

1. The owner’s latest explicit instructions and approved information architecture.
2. The supplied IRESEN brand assets and color book.
3. The approved institutional narrative and subsequently approved website copy.
4. The supplied Figma design for composition, interaction and visual references.
5. Developer proposals, documented with their purpose.

### Supplied references

- `IRESEN_Color_Book_2026_V0_9.pdf`
- `Apex Leaf.svg`
- `Favicon.svg`
- `IRESEN Primary Logo.svg`
- `IRESEN Colored Logo.svg`
- `IRESEN Logo Dark Mode.svg`
- `IRESEN Logo Monochrome.svg`
- `IRESEN Logo White.svg`
- `IRESEN_2035_Phase_01_Narratif.pdf`
- `IRESEN_2035_Phase_01_Narratif.docx` — newly supplied narrative working reference; distinct from the earlier PDF.
- `IRESEN_2035_Phase_02_Supports.docx` — communications-support recommendations, with final writing assigned to a later phase.
- `IRESEN_Structure_Detaillee_Site_Web.docx` — unvalidated page/section and service recommendations.
- Figma: https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?node-id=127-1781
- Website image exports: the 15 references mapped in Section 7, including `HOMEPAGE.jpg` and `Header Section.png`.
- Illustrator boards: `Shape 2.0_LOGO.jpg`, `Shape 2.0_Variants.jpg`, `Shape 2.0_Palette.jpg`, `Shape 2.0_Typography.jpg`, `Shape 2.0_Construction.jpg`, `Shape 2.0_Broundaries.jpg`, `Shape 2.0_Icon.jpg`, `Shape 2.0_Favicons.jpg`, `Shape 2.0_Pattern.jpg`, `Shape 2.0_Meanings.jpg` and `Shape 2.0_Mockup.jpg`. Preserve the supplied spelling of source filenames in the asset inventory.

The Figma content will be replaced. Do not carry over stale wording, statistics, names, dates or commitments. Inspect the exports and reusable project components before implementation; convert prototype positioning into responsive layouts. The supplied JPG/PNG exports are an authorized alternative visual reference when editable Figma access is unavailable: development does not need to wait for renewed MCP access. Follow applicable Figma tool guidance if its connector is subsequently used. Request editable details or original assets only where a specific implementation depends on information the exports cannot supply.

Use the actual supplied SVGs. Preserve their geometry, proportions and approved color treatment. Choose the appropriate supplied logo variant for each background; do not redraw, distort or independently recolor the wordmark. Optimize copies only when rendering is preserved, and keep originals available privately.

### Reference handling

Keep an asset inventory recording source filename, role, version, rights, public/private status, served filename and any approved transformation. Separate website screenshots and brand documentation from assets used by the public application. Store non-confidential reference images in a documented reference directory when repository rights allow; otherwise keep them privately and record their availability. Do not put complete page screenshots, internal narrative PDFs or Illustrator presentation boards in `public/`.

Serve only approved individual SVGs, photographs, illustrations and document downloads. A screenshot is a visual reference, never a finished HTML page or a substitute for an interactive component. Do not cut a logo out of a JPG when its SVG is supplied. Large desktop exports are not appropriately sized production hero images.

The exports establish visual direction and page patterns; desktop-only screenshots do not define mobile layouts, AR/RTL behavior, hover/focus states, accessibility or backend behavior. Specify and verify those in code. Treat illustrative numbers, certification claims, sample people, geographic locations, event dates and email addresses in these exports as unverified source content.

Verify that accessible reference copies match the supplied versions. Internal narrative documents are working references: do not commit or publish them in a public repository unless approved for public release. Record source filenames/version dates in documentation without including confidential contents.

The owner's 8 October request explicitly authorizes repository inclusion of the three newly supplied DOCX copies under `docs/references/strategy/`. This is a scoped exception for those references; earlier private PDFs and other private sources remain excluded. Preserve the DOCX bytes and provenance. Do not place them in `public/`, seed their examples into the CMS or treat their instructions, “validated” labels, source revision claims or proposed wording as new approvals. Final public copy, translations, slogan and institutional facts retain their editorial review requirements.

### Editorial direction

Present IRESEN through the accessible reading framework **Développer · Éprouver · Valoriser**. Explain the supporting scientific expertise, collaborative programmes, platforms, human capabilities and networks, partnerships and resources without turning the homepage into an internal organigram.

Show the connection between research, Morocco’s energy needs, experimentation, transfer and usable results. Distinguish established achievements, current capabilities and future ambitions. Describe platforms and technologies at their actual maturity and availability. Never manufacture performance claims, project results, partner commitments, testimonials or numerical indicators.

The approved narrative supplies the substance; the owner approves final copy and translations. Do not independently announce a proposed institutional name as an adopted legal name.

## 3. Recommended architecture

Use the following baseline unless repository constraints establish a better reason to change it.

| Layer | Baseline | Implementation intent |
| --- | --- | --- |
| Public frontend | Next.js App Router, React, TypeScript strict mode | Server-rendered, crawlable pages; client components limited to interactions |
| Styling | Tailwind CSS with CSS custom-property tokens | One brand system; native CSS for layout and simple motion |
| Localization | next-intl | Locale routing, ICU messages, metadata, dates/numbers and navigation |
| Editorial backend | Payload CMS integrated with Next.js | Typed collections, admin UI, APIs, media and extensible access control |
| Database | PostgreSQL via Payload’s supported adapter | Durable structured content, relationships, migrations and jobs |
| Media | S3-compatible object storage in an approved region | Durable assets, image derivatives and separate private uploads |
| Search | PostgreSQL-backed search through a replaceable search adapter | French/English full-text search and an explicitly tested Arabic strategy |
| Input validation | Zod or equivalent typed server validation | Shared contracts with authoritative server-side checks |
| Motion | CSS first; Motion for React only where justified | Small, progressively enhanced animation bundles |
| Email | Provider adapter; existing institutional mail service preferred | Approved server-side delivery with retries and delivery status |
| Testing | Vitest, Playwright and axe-core | Logic, permissions, workflows, end-to-end journeys and accessibility |
| Tooling | pnpm, ESLint, Prettier, supported Node.js LTS | Reproducible development and CI |
| Deployment | Portable Node.js application and container build | Compatible with assessed hosting; no mandatory proprietary platform dependency |

Next.js and Payload must be selected as a compatible pair. Check Payload’s installation requirements before scaffolding; choosing each package’s latest version independently is insufficient. Document the exact Node.js, framework, CMS, database and package-manager versions chosen in the README and lockfile.

Use one repository and one modular application initially. Separate public routes, CMS/admin routes, domain logic, integrations and jobs by clear boundaries. Do not introduce microservices, Kubernetes, a second ORM or Redis simply for a boilerplate. Add a dedicated search engine or queue only when measured requirements justify it.

Public content should be pre-rendered or cached where appropriate. Contact, authenticated CMS, preview and administrative operations require a server runtime. A static export alone cannot deliver the full system.

Hosting remains a deployment decision based on security, locality, operations, costs and IRESEN’s obligations. Keep database, media and email providers behind configuration/adapters. The code must remain deployable outside the initial development host.

## 4. Repository initialization

Before scaffolding, inspect the default branch, existing source, repository visibility, access and protection rules. Clone or use an isolated working branch. If permissions are unavailable, prepare reviewable local changes and report the specific blocked remote action.

### Repository metadata and governance

- Suggested description: `Official IRESEN website — trilingual institutional platform for research, innovation, experimentation and technology transfer.`
- Suggested topics: `iresen`, `morocco`, `research`, `energy-transition`, `institutional-website`, `nextjs`, `typescript`, `payload-cms`, `i18n`, `accessibility`.
- Use the confirmed production URL for the repository website field when available. Do not advertise a preview as the official website.
- Preserve repository visibility. Do not add an open-source license automatically; IRESEN code, brand and content rights require an explicit licensing decision.
- Configure available branch rules for `main`: required CI, protected history and appropriate review requirements for the actual team size. Do not make the owner’s solo workflow impossible.
- Use pull requests for reviewable milestones. Avoid force pushes and direct unreviewed production changes.
- Enable supported secret scanning, dependency alerts and automated dependency updates. Use one update bot, initially Dependabot.
- Include issue and pull-request templates, a security reporting policy, contribution instructions and ownership rules where practical.

### Files expected after the foundation milestone

- `instruction.md`: this brief at repository root.
- `AGENTS.md`: a concise entrypoint instructing coding agents to read `instruction.md` and documenting repository-specific commands. Do not assume the filename `instruction.md` is loaded automatically by every agent.
- `README.md`: purpose, architecture, versions, local setup, scripts, CMS access, environment variables and deployment overview.
- `.env.example`: documented placeholders only; no live values.
- `.gitignore`: secrets, build outputs, private references, local uploads, database dumps and personal data.
- Formatting, lint and strict TypeScript configuration; committed pnpm lockfile and pinned package-manager/runtime configuration.
- GitHub Actions CI and dependency-update configuration.
- `docs/architecture.md`, `docs/content-model.md`, `docs/i18n.md`, `docs/design-system.md`, `docs/security-and-privacy.md`, `docs/deployment.md` and `docs/adr/`.

Recommended source organization, adapted to the selected framework versions:

```text
src/app/                 Public locale routes, CMS route group, API routes
src/components/          Reusable UI, layout, content and brand components
src/styles/              Tokens, typography, global styles and RTL rules
src/i18n/                Locale configuration, route mapping and navigation
src/messages/            fr.json, en.json, ar.json
src/cms/                 Collections, globals, access, hooks and migrations
src/lib/content/         Public content queries and publication rules
src/lib/search/          Search adapter and locale normalization
src/lib/email/           Email adapter and templates
src/lib/integrations/     LinkedIn and future integrations
src/jobs/                Durable background work and scheduled operations
src/tests/               Focused unit and integration tests
tests/e2e/               Browser journeys
public/brand/            Approved public SVG assets
docs/                    Architecture, operating guides and decisions
```

## 5. Approved information architecture

This section remains the existing route baseline. Following the owner's request for one consistent structure, the 22 stable page IDs in `src/lib/site.ts` are the canonical working structure; see [ADR 0004](docs/adr/0004-canonical-working-site-structure.md). The new detailed structure is an unvalidated proposal; its Agence de Moyens positioning, changed labels/paths, utility scope and section sequences require decisions recorded in [the reference comparison](docs/references/strategy/README.md#differences-from-the-chosen-baseline) and [backlog](docs/backlog.md). Its self-described approval status does not override the owner's clarification. Apply any later structure change centrally and update all affected locale paths, navigation/footer, content links and documentation in the same increment.

Preserve the agreed hierarchy and page boundaries. Major navigation groups are not permission to create extra landing pages. Additional detail pages support their collections without adding primary menu items.

The paths below define French routes; English and Arabic routes must map to the same stable page identifiers through centralized localized path configuration.

| Navigation entry | Page type and boundary | French route |
| --- | --- | --- |
| Accueil | Homepage | `/fr/` |
| L’Institut → L’Institut | One page containing Qui sommes-nous ?, Mission & positionnement and Chiffres clés | `/fr/institut` |
| L’Institut → Gouvernance & organisation | Separate page | `/fr/institut/gouvernance` |
| Recherche & Innovation → Priorités & feuilles de route | Separate page | `/fr/recherche-innovation/priorites` |
| Recherche & Innovation → Programmes R&D&I | Listing and programme detail templates | `/fr/recherche-innovation/programmes` |
| Recherche & Innovation → Projets collaboratifs | Listing and project detail templates | `/fr/recherche-innovation/projets` |
| Expertise & Expérimentation → Plateformes de recherche | Listing and platform detail templates | `/fr/expertise-experimentation/plateformes` |
| Expertise & Expérimentation → Réseau de laboratoires & d’experts | Separate page; directory views only where justified | `/fr/expertise-experimentation/reseau` |
| Valorisation & Transfert | Onepager | `/fr/valorisation-transfert` |
| Travailler avec nous | Onepager | `/fr/travailler-avec-nous` |
| Ressources & Actualités → Actualités | Listing and article detail templates | `/fr/ressources/actualites` |
| Ressources & Actualités → Événements | Listing and event detail templates | `/fr/ressources/evenements` |
| Ressources & Actualités → Publications & rapports | Unified listing, filters and resource detail templates | `/fr/ressources/publications-rapports` |
| Ressources & Actualités → Médiathèque | Media listing and relevant media/album views | `/fr/ressources/mediatheque` |
| Ressources & Actualités → Opportunités & Carrières | Unified listing with opportunities, careers and calls filters; detail templates | `/fr/ressources/opportunites-carrieres` |
| Recherche | Dedicated site-search results page and accessible header entry | `/fr/recherche` |
| Langue | Language selector, not a content page | Equivalent current page in FR / EN / AR |
| Nous contacter | Onepager | `/fr/contact` |

Use section anchors within L’Institut; do not create three duplicate pages for its three sections. Onepager means a dedicated page with navigable sections, not the entire website reduced to a single page.

Press releases belong to Actualités with a content-type filter. Calls for projects belong to Opportunités & Carrières and may be linked from relevant programmes. Do not add competing primary navigation branches without an owner-approved change.

Add footer utility pages for legal information, privacy, cookie preferences where applicable, accessibility and a human-readable sitemap. These do not change the main institutional menu.

Navigation must work on pointer, touch and keyboard. Desktop dropdowns or mega-menus must have proper focus behavior, Escape handling and click activation; hover alone is insufficient. Mobile navigation must have a usable hierarchy without displaying the entire menu as one overwhelming list.

## 6. Trilingual architecture and Arabic RTL

Implement localization in the first milestone, not as a later retrofit.

- Use `fr`, `en`, `ar`, with French as the default editorial language and explicit URL prefixes for all three languages.
- Redirect the unprefixed root deterministically to `/fr/` initially. Respect explicitly chosen locale URLs; do not force geolocation or browser-language redirects on indexed pages.
- Localize navigation, buttons, forms, errors, empty states, metadata, accessible labels, search, dates and CMS-authored content.
- Use stable internal page/content IDs and localized slugs. Language switching resolves the equivalent resource, including dynamic detail pages and supported anchors; it must not always send users to the homepage.
- Separate UI message catalogs from CMS translations. Use ICU messages rather than concatenating translated fragments.
- Set correct HTML `lang` and `dir`; use `rtl` for Arabic and `ltr` for French/English. Use CSS logical properties and RTL-aware layout rules.
- Mirror directional arrows and navigation flow where meaningful. Preserve logos, scientific imagery and non-directional icons. Keep the brand’s physical corner signature unless an approved brand rule specifies otherwise.
- Handle mixed Latin/Arabic names, DOI links, email addresses, phone numbers, acronyms and units with appropriate directional isolation (`bdi` or equivalent).
- Select licensed Latin and Arabic fonts with compatible hierarchy and readable shaping. Self-host them, limit weights, avoid tracking Arabic text and test Arabic line-height independently.
- Use locale-aware formatting through Intl. Store instants in UTC; show Moroccan event deadlines in `Africa/Casablanca` with an explicit timezone when material. Account for timezone offset changes rather than hardcoding UTC+1.
- Set up automated detection of missing UI messages and untranslated visible controls.

### Translation and publication rules

French, English and Arabic versions require editorial review. AI-assisted translations may be drafts; do not auto-publish them or label them approved.

Track translation completeness and publication eligibility per locale. A globally published record with an unfinished Arabic translation must not leak French copy into an apparently Arabic published page. Verify the CMS version’s actual workflow capabilities and add locale-specific gating where needed.

UI catalogs must be complete for all three locales before launch. Institutional core pages require approved translations in all three. Individual news or resource records may have fewer published locales: show their available languages clearly, omit missing variants from search/sitemaps/hreflang and provide an explicit navigation option. Do not silently index fallback copies as translated pages.

## 7. Brand design system and premium visual direction

### Approved digital color hierarchy

Use HEX/RGB values as the digital master; do not convert web colors from CMYK or unverified Pantone approximations.

| Token | HEX | Share of colored elements | Intended role |
| --- | --- | --- | --- |
| IRESEN Navy | `#12345A` | 40% | Institutional anchor, wordmark, headings, readable text, formal backgrounds |
| IRESEN Blue | `#296BB4` | 25% | Apex leaf, primary CTA, links, active states and heritage signature |
| Science Blue | `#4698CA` | 15% | Scientific/technical emphasis and diagrams |
| Transition Green | `#50A684` | 10% | Selected innovation, valorisation and impact accents |
| Energy Cyan | `#77C5D5` | 6% | Light accents, secondary patterns and technical visual elements |
| Innovation Lime | `#A9C47F` | 4% | Rare highlights, small markers and pattern details |
| Light surface | `#F4F7F8` | Outside brand-color ratios | Quiet background and surface contrast |
| White | `#FFFFFF` | Outside brand-color ratios | Main reading surfaces and negative space |

These ratios guide relative colored usage across the identity, not exact pixel quotas on every page. White/light neutral surfaces generally occupy 50–70% of page area. Most compositions use the two core colors and one accent maximum. Green supports the blue identity; it does not replace it.

**Observed source discrepancy:** `Shape 2.0_Palette.jpg` labels Heritage Blue as `#256BA2`; the supplied Apex Leaf, favicon and two-color/dark-mode SVG definitions also use `#256BA2`. The color book specifies `#296BB4`. Keep `#296BB4` as the website token under the established source precedence until the owner explicitly changes that reference. Preserve the delivered SVG originals, record their actual color and do not silently recolor them or sample a third blue from JPG pixels. Reconcile the final web asset set and token choice before freezing the visual system; this does not block repository setup or layout work.

Use the master logo with navy wordmark and heritage-blue apex on light backgrounds. Use appropriate supplied reversed/monochrome variants for dark or constrained contexts. Keep the wider color spectrum in carefully selected patterns, graphics and data visualizations.

### Illustrator brand implementation

- **Typography:** the Illustrator board explicitly identifies **Plus Jakarta Sans**, Regular/Bold, for Latin typography. Use it as the default French/English family, subject to obtaining licensed webfont files. Establish a restrained 400/600/700 hierarchy where the supplied licensed font supports those weights. Select and verify a compatible Arabic companion separately; the Latin board does not define Arabic typography.
- **Logo geometry:** the lower-case wordmark and apex are custom supplied vectors. Plus Jakarta Sans is for website text, not permission to recreate the logo with live text. Preserve the apex tilt, sharp points, curves and wordmark letterforms.
- **Clear space:** follow the unit-based guides in `Shape 2.0_Broundaries.jpg` (2U around the wordmark) and `Shape 2.0_Icon.jpg` (3U in the standalone icon diagram). Define U from those drawings rather than guessing a fixed pixel margin. Header/footer layouts must respect the resulting clear space.
- **Variant selection:** inspect actual asset colors instead of relying on filenames. In the supplied set, both `IRESEN Logo Monochrome.svg` and `IRESEN Logo White.svg` contain white fills; neither is automatically a navy-on-white variant. Use the inspected two-color vector on light surfaces, a suitable reversed/dark-mode vector on navy, and record any missing required variant for authorized export.
- **Sizing:** the supplied SVGs use viewBox dimensions rather than explicit root width/height. Reserve component dimensions proportionally, preserve their aspect ratios and prevent clipping or layout shift. The wordmark viewBox is approximately 3.57:1; the apex shape must retain its own tall proportions.
- **Favicon:** use `Favicon.svg` as the source for the browser icon, inspect contrast at small sizes and generate approved raster/ICO/touch-icon derivatives when needed. Do not use a screenshot of the favicon board, including its construction guides, as the site icon. A manifest or install prompt is not required simply because icon files exist.
- **Pattern:** use the supplied Apex Leaf silhouette for repeatable, dense symmetrical patterns following `Shape 2.0_Pattern.jpg`. Keep spacing, orientation and rhythm consistent; use restrained tonal versions for backgrounds. Do not stretch the tile, use an unrelated generic leaf, or place dense patterns behind body copy.
- **Meanings:** the fire, water, leaf, rocket, light-bulb and sharp-point drawings explain the brand symbolism. They are not automatically a mandatory navigation icon set or six additional content pillars.
- **Mockup:** `Shape 2.0_Mockup.jpg` illustrates identity application, not evidence that the depicted building is an IRESEN facility. Treat it as a presentation reference unless its use as public imagery is explicitly approved.

### Layout, hierarchy and graphic signature

- Establish shared tokens for colors, typography, spacing, containers, radii, borders, shadows, motion and z-index. Components consume semantic tokens rather than arbitrary values.
- Use a consistent grid: 12 columns on desktop, 8 on tablet and 4 on mobile as the baseline. Start with an approximately 1280px content maximum, fluid gutters and a 4/8px spacing rhythm; refine against the actual design.
- Use clear H1/H2/H3 hierarchy, comfortable reading measure (about 60–75 characters for Latin body copy) and equivalent readable Arabic composition.
- Contrast adjacent full-width sections with white, light neutral and selective navy surfaces. **Do not round full-width horizontal section containers.**
- Apply the IRESEN rounded **top-left and bottom-right** signature selectively to cards, media frames and focused blocks. Keep other corners restrained; avoid universal pill shapes and excessive rounded containers.
- Use the supplied Apex Leaf as a restrained graphic motif. Dense symmetrical patterns may appear in selected brand areas; they must not overpower text or become wallpaper across every section.
- Use occasional low-opacity photography or technical illustrations as section backgrounds when they help differentiation. Provide readable overlays and do not repeat this treatment everywhere.
- Prefer authentic IRESEN platforms, research and people imagery when approved assets are available. Keep rights/attribution records and meaningful image crops.
- Use consistent icon family, stroke weight, card proportions and CTA hierarchy. Make clickable elements identifiable without relying only on color.

Premium means confident typography, disciplined space, precise alignment, strong imagery and thoughtful interaction. Avoid excessive gradients, glass effects, decorative dashboards, autoplay hero carousels or large animated effects without a clear purpose.

Propose improvements to Figma when they strengthen usability, brand coherence or premium presentation. Explain material departures with visual references. Maintain the approved brand language and page boundaries.

### Color accessibility

Check actual rendered foreground/background contrast, including transparency, images and interaction states. White text on navy or IRESEN Blue supports normal text. Science Blue with white and Transition Green with navy do not meet 4.5:1 for normal text; reserve those combinations for qualifying large text or redesign the surface/text pairing. Do not use cyan/lime as low-contrast body text. Use separate accessible semantic tokens for error, warning, success and focus; the brand palette is not a complete status system.

### Design language observed in the website exports

Carry forward the following characteristics, updated to the approved identity:

- Large, confident sans-serif headlines; restrained highlighted words; small section labels with a tiny brand marker; generous space around introductions.
- Full-bleed photographic heroes with readable overlays, plus selective bright or navy abstract scientific/brand heroes. Use consistent hero families instead of creating an unrelated composition for every page.
- Flat full-width section boundaries alternating white, pale neutral and navy. Split image/text sections, fine dividers and carefully aligned editorial grids give rhythm without rounded section wrappers.
- Image-led audience/project/platform cards, quiet metadata, restrained outline/filled CTAs and the diagonal two-corner signature on selected focused elements.
- Clear filter bars, grouped lists, document rows, event agendas and accordion-like summaries. These are interaction patterns to implement accessibly, not screenshot decorations.
- A substantial navy footer with grouped links, confirmed institutional contacts and language access. Use one coherent footer rather than reproducing the conflicting light and dark footer variants present across exports.

Update the old header to the approved six institutional groups plus Accueil, search, language and contact. Plan width against the real long translated labels; change to a compact menu when available space requires it, rather than shrinking text or allowing controls to overlap. Transparent-on-hero and solid-on-light header variants must keep logo/navigation contrast and consistent geometry. `Header Section.png` contains transparency: black visible in an image viewer is not an instruction to implement a black navigation bar.

The exports frequently place a statistic strip below the hero. Keep this as an optional shared component, populated only by reviewed key-figure records; do not repeat every statistic on every page. Prioritize useful navigation and narrative over a long succession of decorative sections.

### Export-to-approved-page mapping

| Supplied export | Reusable reference | Destination and changes |
| --- | --- | --- |
| `HOMEPAGE.jpg` | Photographic hero, key-figure strip, audience cards, navy theme panel, projects/platforms/news teasers and partner strip | Accueil: replace the financing-led message with the approved institutional role and Développer · Éprouver · Valoriser; update menu, logo, figures and all curated content |
| `À propos.jpg` | Institutional intro, image/text split, vision, timeline and document teasers | L’Institut onepager for identity/mission/figures; move governance/organization detail to its approved separate page; retain history only where useful |
| `AGENCE DE MOYENS.jpg` | Programme overview, call cards, status badges, process explanation and evidence blocks | Programmes R&D&I and calls within Opportunités & Carrières; explain funding as an instrument in the broader research model, not a new primary menu |
| `DOMAINES DE RECHERCHE.jpg` | Scientific hero and light/navy section rhythm | Priorités & feuilles de route; the supplied export contains large visually empty section areas, so do not assume their contents or reproduce them as blank page space |
| `PROJETS R&D & INNOVATION.jpg` | Keyword/filter bar, three-column project grid, metadata and pagination | Projets collaboratifs listing and detail pages; use accurate project/maturity states rather than recycling call-opening labels |
| `INFRASTRUCTURES ET PLATEFORMES.jpg` | Photographic hero and concise expandable platform rows | Plateformes de recherche and detail pages; truthful availability, capabilities and contact pathways; visible links must remain usable without expansion |
| `COOPERATION ET PARTENARIATS.jpg` | Bright brand/technical hero, collaboration cards, partner groups and selective geography | Travailler avec nous onepager; relate collaboration to needs, expertise, R&D, trials and transfer rather than recreating an obsolete standalone branch |
| `Header Section.png` | Detailed bright partnership hero, primary/secondary CTA hierarchy and dimensional motif | Optional hero reference within Travailler avec nous or another relevant approved page; preserve quiet text space and use the new apex geometry in any newly authorized artwork |
| `ALUMNI.jpg` | Profile grids and people-led stories | Possible approved expert-network/case-study patterns; a searchable alumni directory and testimonials are additional scope, not implied public features |
| `FORMATIONS.jpg` | Training introduction, capability cards and grouped calendar/registration rows | Training content can support Réseau de laboratoires & d’experts, Travailler avec nous and filtered Événements; no extra primary menu is implied |
| `Actualités & Événements.jpg` | Leading story with compact secondary list, event cards and grouped agenda | Separate approved Actualités and Événements pages sharing components; do not merge them solely because the export combines both |
| `Publications & Ressources.jpg` | Search hero, filter sidebar, bibliographic rows and report grids | Publications & rapports; use real types, language, date, author/DOI and rights. Patent content, if approved, needs accurate status and must not be treated as a generic invented success figure |
| `Vulgarisation scientifique.jpg` | Featured editorial mosaic, video cards and thematic series | Approved resource/news article formats and Médiathèque; a standalone glossary and new outreach landing page require a scope decision |
| `Carriéres.jpg` | People-led intro, job rows and internship presentation | Opportunités & Carrières with type/status filters and details; internal CV uploads/spontaneous applications remain a separate approved module |
| `CONTACT US.jpg` | Split intro/contact panel, platform contacts, localized form and FAQ rows | Nous contacter onepager; verify all contacts and response commitments, minimize required fields and implement real delivery |

Map exports by page role even if accent normalization or spelling varies in delivered filenames. Document the actual filename and a safe repository alias; do not create duplicate page routes from spelling variants.

### Reusable component and interaction requirements

Build shared `SiteHeader`, `SiteFooter`, `PageHero`, `SectionHeading`, `KeyFigureStrip`, `AudienceCard`, `ProjectCard`, `PlatformSummary`, `NewsFeature`, `ResourceRow`, `EventAgenda`, `FilterBar`, `Pagination`, `PartnerStrip` and `ContactForm` components as appropriate. Component names are organizational guidance, not a requirement to install a particular UI library.

- Choose whether a horizontal section navigation is an in-page anchor list or a true tab interface; implement the correct semantics and keyboard behavior. Do not style links as tabs and hide content without a defined behavior.
- Prefer visible grids/lists over carousels. Where a carousel improves a specific collection, provide usable controls, position information and touch/keyboard access, without automatic advance; do not hide the only route to an important resource.
- Expandable job/platform/FAQ rows need real controls, expanded-state semantics and independent crawlable detail links where a detail page exists.
- Filters must be labeled, show active selections/result counts, reset clearly and persist in the URL. Convert dense desktop filter bars/sidebars to usable mobile controls.
- Partner logos retain approved colors and readable sizing; do not copy extremely faint logo treatment when it makes partners unidentifiable. Group partners only using reviewed taxonomy.
- Geography and hotspots need approved coordinates/map assets, clear labels and an accessible text list. They are optional enhancements, not prerequisites for a collaboration page.
- Put charts and numeric indicators on structured verified data; provide labels/text alternatives. Do not turn decorative charts in the funding export into factual statistics.
- Newsletter signup, alumni accounts/directories, CV uploads, application tracking, glossaries and service-response promises visible in mockups are not automatically added to the agreed scope. Never show a functional-looking control with no implemented service.

### Initial homepage composition to adapt

Use this as a proposed content sequence within the observed visual language; approve actual copy and modules during page implementation:

1. A clear institutional hero: role/value message, one primary route to collaboration or capabilities and one secondary discovery route.
2. A restrained verified key-figure strip, if sufficient current figures are approved.
3. Développer · Éprouver · Valoriser as three connected functions with links into the appropriate pages.
4. Priorities/themes and selected programmes/projects, expressed through concrete needs and results.
5. Experimental platforms/capabilities and practical access pathways.
6. Valorisation/transfer evidence and audience-based ways to work with IRESEN; combine modules where this avoids repetition.
7. Curated news and upcoming events, followed by a selective partner/coalition strip and the unified footer.

The screenshot’s exact section order is not binding after the narrative update. Keep the page focused; do not place every backend collection on the homepage or invent material to fill a template.

### Visual acceptance and remaining gaps

Implement desktop, tablet, mobile and Arabic adaptations from the same content system. Compare rendered screenshots to the exports for composition, hierarchy and recognizable design language while evaluating against the newer logo/colors and approved structure. Record intentional differences. Verify typography and image cropping, header fit, clear space, selected-corner treatment, flat section edges, small-screen controls, reduced motion and long Arabic text.

The exports do not provide separate production photographs/3D source assets, mobile frames or tested interactive behavior. Acquire approved individual assets or implement an explicitly documented replacement; do not pretend a cropped screen export is an original image. The dimensional hero motifs are primarily a visual direction, not authorization to ship a heavy 3D engine or add effects to every page.

## 8. Responsiveness and accessibility

Target **WCAG 2.2 AA** as a project quality standard across public pages and custom admin functionality. Evaluate the inherited CMS interface on the team’s core editing journeys and record/remediate material barriers. Do not claim full conformance based only on an automated scan.

- Build mobile first; verify at 320, 375/390, 768, 1024 and 1440px, plus representative landscape/tablet layouts. Support variable content length and no unintended horizontal scrolling.
- Use semantic landmarks, a skip link, meaningful headings and a visible focus indicator. Sticky headers must not obscure focused controls or anchor targets.
- All interactive features must work by keyboard and touch. Test menu, dialog, language switcher, filters, galleries and form focus restoration.
- Aim for 44×44px touch controls; meet WCAG 2.2 AA target-size requirements and exceptions. Do not describe 44px as the AA minimum.
- Support text resizing to 200%, reflow at zoom and text spacing overrides. Do not lock orientation or disable pinch zoom.
- Maintain at least 4.5:1 contrast for normal text, 3:1 for qualifying large text, and required contrast for controls/focus states.
- Provide useful localized alt text; decorative patterns have empty alt text or are hidden from assistive technology.
- Forms need programmatic labels, associated errors, an error summary where appropriate and announced submission states.
- Videos require subtitles/captions where relevant; offer transcripts for substantive institutional videos. Use accessible downloadable resources or provide an equivalent HTML summary when legacy PDFs are inaccessible.
- Avoid information encoded solely by color, motion, hover or iconography.
- Respect `prefers-reduced-motion`. Provide accessible pause/stop behavior for any continuous motion that is introduced.
- Include manual keyboard and screen-reader checks in French, English and Arabic alongside axe-core checks. Verify current Safari, Chrome, Firefox and Edge, plus iOS Safari and Android Chrome.

## 9. Animation and interaction

Use motion to clarify hierarchy and feedback, with an institutional tone.

- Prefer opacity/transform transitions, subtle card feedback, restrained menu transitions and limited section reveals.
- Start with 150–250ms control transitions and 300–500ms larger reveals; use consistent easing tokens.
- Do not use scroll hijacking, custom cursors, forced intro screens or effects that delay reading.
- Content must be visible and usable without JavaScript or when an animation fails. Never leave sections permanently hidden behind an IntersectionObserver.
- Disable nonessential reveals, parallax and looping effects for reduced-motion users.
- Avoid autoplay video in the initial foundation. Any later video hero needs a lightweight poster, pause control and measured performance justification.
- Lazy-load animation libraries and interactive galleries only where needed. Motion must not cause layout shifts, obscure focus or reduce contrast.

## 10. Editorial backend and structured content

Provide a maintainable CMS rather than hardcoded public datasets or a free-form page builder that lets editors break the design system. Use approved structured blocks and content templates.

### Content model

| Collection/global | Core information and relationships |
| --- | --- |
| Institutional pages | Stable page ID, localized sections, intro, approved structured blocks, SEO and revision history |
| Site settings/navigation | Identity, approved contact details, social links, footer/legal links and controlled homepage selections |
| Key figures | Value, unit, label, scope, as-of date, internal evidence source and reviewer; reusable on relevant pages |
| Research priorities/roadmaps | Themes, summaries, status, approved documents and related programmes/projects |
| R&D&I programmes | Scope, objectives, themes, dates, status, approved funding information, partners, calls and projects |
| Collaborative projects | Acronym, title, problem, objectives, themes, partners, programme, dates, maturity/status, public results and media |
| Platforms | Capabilities, technologies, location, partners, actual availability/status, services, approved contact and media |
| Laboratories/experts | Public institutional affiliation and expertise; publish individual contact details only when authorized |
| News/articles | Type (news/press release), title, excerpt, body, date, authorship, categories, relations, media and source attribution |
| Events | Title, start/end, timezone, venue/online location, status, registration link, programme and related resources |
| Publications/reports | Type, title, abstract, authors, date, language, DOI/URL where available, file, rights and related projects |
| Media/mediathèque | Image/video/audio/document, title, localized alt/caption, rights/credit, focal point, dimensions, file size and album relations |
| Opportunities/careers | Type, description, eligibility, deadline/timezone, application instructions, status and approved public files |
| Calls for projects | Programme relation, scope, eligibility, opening/closing dates, documents, external submission link and open/closed status |
| LinkedIn import queue | Source URN/URL, imported snapshot, sync status, editorial selection, exclusion and linked article |
| Contact requests | Minimal private submission record, category, routing, delivery state, retention/deletion dates and audit reference |
| CMS users/audit | Roles, protected account fields and material publishing/access events; never public content |

Use controlled taxonomies for themes, technologies, content types, partners and statuses. Reference shared entities rather than duplicating partner names and logos. Keep private evidence and internal notes out of public API responses.

Published content needs a stable ID, localized title/slug/body as appropriate, created/updated dates, editorial owner, SEO fields and explicit visibility. Model translations, rights, relationships and publication rules consistently. Slug changes create redirect records; do not lose inbound links.

### Editorial workflow and permissions

Implement draft → review → published, scheduled publication where required, archive and withdrawal. Distinguish deletion from archival. Include revision history and authenticated preview. Preview responses must not be indexed or cached as public pages.

| Role | Expected authority |
| --- | --- |
| Administrator | Accounts, configuration and technical operations; tightly limited membership |
| Editor | Create/update drafts, upload authorized media and submit for review |
| Reviewer/publisher | Approve, publish, schedule, withdraw and curate public content |
| Translator | Edit permitted locale content and request review; no automatic publishing or user administration |

These are application requirements, not assumptions that the CMS ships every workflow out of the box. Implement and test collection, field, operation and locale rules server-side. Hiding an admin control is not authorization.

Public APIs expose only approved published content in the requested locale. Protect draft/private files, upcoming scheduled records, internal notes, contact requests and accounts through every access path. When using Payload’s Local API, explicitly apply the correct access-control context; it can bypass access checks by default. Use explicit elevated operations only for trusted, narrow internal jobs.

Revalidate relevant public caches and update search/sitemaps on publication, translation changes, withdrawal and deletion. Homepage inclusion is a separate editorial choice from public article visibility.

## 11. LinkedIn integration and editorial selection

Provide an optional server-side adapter for the official IRESEN organization page. Do not assume its feed is an unrestricted public API. Organization post retrieval requires the applicable approved LinkedIn product access, OAuth permissions and organization authorization; verify these before implementation.

Do not scrape LinkedIn or expose access tokens in client code. Website rendering must use its own published content and never depend on a live LinkedIn request.

### Import workflow

1. An authorized background job retrieves permitted organization posts through the official API.
2. Deduplicate by organization/post URN and record source URL, import time and allowed source metadata.
3. Put new items in a private review queue; default `publishToWebsite = false`.
4. An editor selects useful posts, adapts their title/excerpt/body, obtains authorized media and prepares locale translations.
5. A publisher approves each eligible locale. Separate controls determine inclusion on the news listing and homepage.
6. Mark irrelevant items excluded with a durable exclusion record. Future syncs must not recreate them as publishable drafts.

Record `featuredOnHomepage`, publication dates, categories, linked website article and editorial overrides. Re-importing must not overwrite reviewed text or translations. Source edits/deletions raise a review event; legal/platform removal requirements take precedence over retaining an old snapshot.

Store only data and media permitted by the current LinkedIn terms; document retention, refresh and deletion behavior. Handle token expiry, API version retirement, pagination, rate limits and backoff. Use supported webhooks only if access is available; otherwise use scheduled polling.

If access is not approved, implement the same editorial queue with manual source-link entry and authorized content supplied by the communications team. Mark the automatic connector unavailable; do not ship a pretend integration. The website must remain fully usable.

Future website-to-LinkedIn publishing can reuse the content model but is outside the initial scope; it requires a separate outbound publishing workflow.

## 12. In-site search

Implement a locale-aware, server-side search endpoint and an accessible results page.

- Index approved institutional pages, articles, events, projects, programmes, platforms, publications/reports, media metadata and opportunities/calls.
- Filter by active locale, content type and relevant thematic/date criteria. Respect publication eligibility, withdrawal and access rights before returning results or suggestions.
- Rank titles and exact matches above body text; provide readable excerpts, resource type, date where relevant and language.
- Keep filters and pagination in the URL; support bookmarked results and back-navigation.
- Normalize French accents and common Arabic forms/diacritics carefully; preserve original text for display. Do not claim PostgreSQL has a built-in Arabic stemmer. Start with tested normalization/trigram matching and document its limits.
- Use realistic French, English and Arabic queries in relevance tests, including acronyms and mixed-script titles. Keep a replaceable adapter for a dedicated engine if search quality/scale later demands it.
- Index only authorized public document text. Extraction of approved PDF contents can follow later; confidential documents and job applications must never enter the public index.
- Update the index asynchronously and idempotently on content changes; support full rebuilds.
- Provide empty results, clear filters, query limits, input validation and accessible pagination. Avoid unbounded wildcard/expensive queries.
- Keep internal search results `noindex`; do not store identifiable query strings in analytics/logs by default.

## 13. SEO and content discovery

- Render main public content, headings and crawlable links in server-generated HTML.
- Provide distinct localized title, description, Open Graph and social-share metadata; generate branded share images from approved templates.
- Use one confirmed HTTPS canonical domain. Normalize host/path variants, trailing slash policy and redirects centrally.
- Each published language variant has its own canonical URL and reciprocal hreflang links only to real, published equivalents. Define a valid `x-default` destination. Avoid conflicting automatic/header/HTML alternate-link generation.
- Generate XML sitemaps from published eligible records, meaningful `lastmod` values and actual localized URLs. Exclude drafts, preview/admin/API endpoints and internal search.
- Use robots directives appropriately. `robots.txt` and `noindex` are not security controls; private environments/pages also require access restrictions.
- Provide structured data only when supported by visible facts: Organization/WebSite, BreadcrumbList, Article/NewsArticle, Event, JobPosting and suitable publication types.
- Remove or update expired JobPosting markup promptly. Use correct event timezone/status and avoid advertising unverified search rich-result guarantees.
- Keep list/filter URLs controlled to avoid duplicate-index explosions. Provide crawlable pagination and contextual related-content links.
- Use semantic headings, descriptive links, optimized image alt text, meaningful downloadable filenames and visible document language/type/size.
- Inventory existing official website URLs before replacement. Map migrations with permanent redirects and preserve important document/project links; do not assume the new repository’s name determines the production domain.
- Configure authorized Search Console access and validate sitemaps, indexing and structured data during launch. Report issues rather than promising rankings.

## 14. Contact and email delivery

Build a real localized contact onepager and server-side form with minimal fields: name, email, subject/category, message and optional organization. Only add phone or attachments if a specific approved need exists.

- Route categories to configured IRESEN recipients on the server; never trust a recipient address supplied by the browser.
- Validate and limit all inputs server-side; prevent header injection. Use honeypot/time checks and shared rate limits. Introduce an accessible privacy-assessed challenge only if abuse justifies it.
- Use a verified institutional sender and the visitor’s validated address as Reply-To. Do not spoof the visitor’s domain as From.
- Configure SPF, DKIM and DMARC for the selected delivery path. Prefer approved Microsoft 365/SMTP/Graph integration where operationally suitable; keep an adapter for alternatives.
- Track accepted/queued/sent/failed states, retry transient failures and alert operators to persistent problems. A success message means durable acceptance for delivery, not an unverified claim that the recipient read or received it.
- Prevent duplicate submissions with idempotency and sensible UI behavior. Preserve input on recoverable errors.
- Provide a privacy notice and the appropriate legal basis/consent mechanism validated for this processing. Marketing opt-in, if later introduced, is separate and unchecked by default.
- Keep contact records private, redact email/message content from routine logs and apply an approved retention schedule to records and mail copies.
- Include approved public contact alternatives so the visitor has another route during a service failure. Do not invent email addresses or physical locations.

Public CV uploads, newsletter subscriptions and project-application portals are separate modules, not implied by a contact form. Initially, career/call pages can link to an approved external submission channel. Any later personal-document upload needs private storage, access rules, malware checks and dedicated retention controls.

## 15. Moroccan privacy and institutional security

Treat technical security and legal compliance as related but distinct workstreams. A framework, hosting location or cookie banner cannot establish compliance alone.

### Privacy and applicable requirements

Law 09-08 and CNDP guidance govern personal-data processing such as contact requests, administrator accounts and recruitment submissions. Identify each purpose, controller, legal basis, recipients, necessary fields, retention period and applicable notification/authorization formalities. Prepare clear localized notices and practical rights-request handling. Confirm required CNDP formalities before live collection.

Map personal-data flows for hosting, database, object storage, email, analytics, CAPTCHA, monitoring and backups, including support access and subprocessors. Transfers abroad need assessment under the applicable rules and any required formalities; a consent checkbox is not a universal substitute. Avoid exporting production personal data into public previews or fixtures.

Assess IRESEN’s legal status and system/data classification with its responsible legal/IT functions. Determine whether Law 05-20, DNSSI and applicable cloud requirements, including Decree 2-24-921, apply to the relevant services. Do not assume every institutional website is a designated critical infrastructure, or that all website data has the same residency requirement. Record the determination and resulting hosting/procurement constraints.

Start with minimal third-party tracking. Before loading cookies involving personal data, implement the consent behavior required by CNDP guidance and validated for the actual tools. Provide understandable purposes, refusal/withdrawal controls and localized preferences. Do not load LinkedIn embeds, external video players, maps or trackers before the applicable consent; prefer links or local previews. Server-side analytics/logs also need assessment.

Maintain legal/privacy pages, verified institutional identity, actual contact for rights requests and confirmed CNDP references when issued. Do not invent registration or authorization numbers or label a prototype legally compliant.

### Engineering security baseline

Use OWASP ASVS Level 2 as an engineering target and the DGSSI web-application guidance as a local reference, adapting controls to actual scope and documenting exclusions.

- TLS, secure headers and a tested Content Security Policy. Roll out CSP safely and reconcile nonce/hash choices with caching. Enable HSTS after HTTPS/domain behavior is verified.
- Secure cookies, CSRF protection for cookie-authenticated mutations, strict CORS and server-side authorization on every sensitive operation.
- Least-privilege database/storage/service accounts, separate environment credentials and secret management. No keys in `NEXT_PUBLIC_*`, source control, browser bundles or logs.
- Sanitize rich text and external content; validate URLs and reject unsafe protocols. Avoid raw HTML rendering without a documented sanitizer.
- Defend against SQL injection, SSRF, path traversal, open redirects, broken object authorization and mass assignment. Allowlist remote media hosts and block access to internal/metadata endpoints.
- Bound file size, type and dimensions; validate actual content/MIME, not extensions alone. Reject or sanitize untrusted SVG/HTML. Approved repository brand SVGs are distinct from arbitrary public uploads.
- Prevent public administrative self-registration after controlled bootstrap. No shared/default administrator password.
- Require MFA for production CMS access through a verified supported mechanism or an identity/access gateway. Institutional Entra ID/SSO is a candidate, not an assumed free native CMS feature; document any implementation/licensing dependency.
- Protect login/reset/preview/revalidation/integration endpoints with appropriate tokens, limits and audit trails. Exclude them from public caches.
- Use distributed/shared rate-limit state when multiple instances serve traffic; process-memory limits alone are insufficient in production.
- Avoid personal data in error reporting. Use structured redacted logs, correlation IDs and controlled retention; never log tokens or message bodies.
- Disable unused API surfaces, including GraphQL if unnecessary. Enforce public output projections and schema validation rather than exposing every field by default.
- Use encrypted protected backups, tested restoration and restricted access. Include incident response, credential rotation and dependency patching procedures.
- Run CI with least permissions, pin third-party actions to reviewed commit SHAs and protect deployment secrets. Do not give untrusted fork pull requests production credentials.

## 16. Performance optimization and measurable budgets

Performance is a release requirement. Design and architecture decisions must be measured on real representative pages, not only an empty landing page.

### Initial project budgets

| Measure | Target | Verification |
| --- | --- | --- |
| LCP | ≤ 2.5s | Real-user 75th percentile when sufficient data exists; mobile lab checks before launch |
| INP | ≤ 200ms | Real-user 75th percentile; representative interaction profiling before launch |
| CLS | ≤ 0.1 | Real-user 75th percentile and lab checks |
| Lighthouse performance | ≥ 90 on representative public mobile pages | Documented production-build profile; inspect variability/regressions |
| Lighthouse accessibility/SEO/best practices | ≥ 95 as supporting checks | Supplement with manual accessibility/security/SEO review |
| Initial route JavaScript | Aim ≤ 200KB compressed on a standard public page | Production bundle analysis; document baseline and any justified exception |
| Hero image | Aim ≤ 250KB at typical mobile size | Responsive derivatives, measured visual quality and network inspection |
| Initial page transfer | Aim ≤ 1MB for typical public pages, excluding user-opened video/downloads | Production network audit |

Core Web Vitals thresholds are field metrics; Lighthouse does not prove INP or production compliance. JavaScript/image/transfer values are project budgets, not external standards. Record initial measured baselines and tighten or justify exceptions with evidence.

### Required practices

- Server components and static/cached rendering by default for public content; avoid hydrating entire page sections just for decorative effects.
- Optimize responsive images with AVIF/WebP where appropriate, correct dimensions, `sizes` and focal points. Prioritize the actual LCP asset; do not lazy-load it.
- Lazy-load below-fold media and heavy widgets. Use image/video posters and load third-party players only on interaction and appropriate consent.
- Self-host licensed font subsets, limit weights and preload only critical fonts. Avoid a typography setup that downloads unnecessary Latin and Arabic families on every page.
- Prevent layout shifts with reserved media geometry, stable header behavior and predictable font loading.
- Use explicit cache policies. Cache public published content by locale; never share authenticated, draft or personal responses. Revalidate every affected locale/list/detail route on editorial changes.
- Paginate content, select needed fields, index database filters and avoid N+1 queries. Bound resource sizes and integration timeouts.
- Inspect public-route bundles; keep CMS/admin packages, credentials and integration clients out of client bundles. Use dynamic imports for optional interactions.
- Use compression and immutable caching for versioned static assets; invalidate transformed media correctly after replacement.
- Keep search indexing, LinkedIn sync and mail retries out of public request latency. Background work must be durable and idempotent.
- Add CI performance budgets for a small representative route set and monitor real-user metrics with an approved privacy configuration after launch.

## 17. Operations, deployment and maintenance

- Separate development, preview/staging and production databases, credentials, storage and mail recipients. Use synthetic data in tests and previews.
- Provide a reproducible container build and local development services where useful. Run as a non-root process and place a reverse proxy/CDN/WAF boundary according to the assessed host.
- Document deploy order, database migrations, compatibility, cache behavior, worker/scheduler operation and health checks. Coordinate caches and rate limits across instances when scaling.
- Production jobs require an actual worker or scheduler; request handlers alone do not guarantee scheduled posts, expiry, imports or retries.
- Use reviewed database migrations; do not enable destructive schema synchronization against production. Avoid migrations that make rollback impossible without a recovery plan.
- Configure uptime, failed jobs, email failures, error rate, storage and backup alerts with named owners. Alerts must exclude confidential content.
- Back up database and object storage with versioning/restore procedures. Proposed launch baseline: RPO ≤ 24 hours and RTO ≤ 8 hours, subject to IRESEN’s agreed service requirements; test them rather than merely listing them.
- Maintain a release checklist, rollback/runbook, incident contact, security reporting route and patch/update process.
- Record approved provider costs, regions, ownership, data portability and exit/export procedure. IRESEN should control the domain, repository, services and recovery access.
- Keep third-party integrations optional and isolated. Failure of LinkedIn, analytics or a remote image host must not break institutional content.
- Provide concise editorial training: create content, manage translations, approve/publish, curate the homepage, manage media rights and handle withdrawals.

## 18. Milestones and acceptance criteria

### Milestone 0 — Repository and decisions

Deliver repository metadata/setup, documentation, selected compatible stack/version matrix, architecture ADR, route map and a tracked backlog. Record current repository access/state accurately; this brief does not establish that the repository is empty or already configured.

Acceptance: local setup and contribution path are clear; secrets are excluded; the architecture covers all three languages, CMS integration and portable server deployment.

### Milestone 1 — Clean trilingual boilerplate

Deliver:

- Working compatible Next.js/Payload/PostgreSQL foundation with reproducible local setup, initial migrations and controlled administrator bootstrap.
- Locale routes, translated UI shell, responsive header/footer, language selector, navigation and branded empty pages for the approved information architecture.
- Brand tokens, the inspected public logo/favicons and a recorded Illustrator/color-book discrepancy; no final homepage composition or invented institutional datasets.
- Initial CMS collections for institutional pages, news and media, with published-only public querying, translation eligibility and basic draft/review/publish permissions.
- Minimal SEO framework, localized metadata, robots/sitemap logic, 404/error/loading states and security-header foundation.
- Search/contact adapter contracts; transparent unavailable/empty states if delivery/search integration is not yet implemented. No fake successful submissions.
- CI for install, lint, typecheck, relevant tests and production build; minimal browser checks for locale navigation, Arabic direction and unauthorized draft access.

Acceptance: a new developer can install and run the project following README; all main routes resolve in FR/EN/AR, Arabic uses RTL, empty collections render cleanly, unauthorized users cannot read drafts, and the public shell is responsive/keyboard usable. Remote previews remain restricted and non-indexable.

Complete this foundation before expanding into the full feature build. Report its working commands, screenshots and remaining external dependencies as a concrete milestone.

### Milestone 2 — Design system and core institutional pages

Use the reviewed website exports and Illustrator references as the visual baseline in Section 7. Inspect editable Figma details when available for requirements that depend on them, without blocking implementation on connector access. Reuse project components and implement a coherent token system and responsive templates. Resolve the recorded brand-color/asset discrepancy before finalizing visual variants. Apply updated approved copy, with all three locale versions of the core pages. Build the homepage, Institut, governance, priorities, expertise, transfer, collaboration and contact layouts with the agreed boundaries.

Acceptance: design/brand comparison at desktop/tablet/mobile sizes; Arabic layout review; no rounded full-width section containers; no stale placeholder claims; meaningful keyboard/screen-reader review and measured bundle/LCP baseline.

### Milestone 3 — Full CMS, resources and functional services

Expand all collections, detail/list/filter templates, relationships, media handling, locale workflow, audit/revisions and scheduled/archive states. Implement published-content search and actual contact delivery with failure handling. Deliver secure preview and cache/index updates.

Acceptance: real CRUD workflows succeed; role boundaries and public/private content/file separation are verified; published locale changes appear correctly; contact retry/idempotency works; search returns relevant French, English and Arabic results and removes withdrawn records.

### Milestone 4 — LinkedIn and launch preparation

Implement the official connector if approved access is available, otherwise the documented manual curation workflow. Complete approved content, old-URL migration map, media rights, privacy/security assessment, production hosting decision, backups and restore exercise.

Acceptance: imports are deduplicated and excluded items stay excluded; nothing is auto-published; the site remains operational during connector failure. Accessibility, performance, security, SEO and translation findings are resolved or explicitly tracked with an accepted release decision.

### Milestone 5 — Production release and handover

Deploy only after the owner’s release authorization and the applicable organizational launch checks are complete. Verify actual HTTPS/domain behavior, redirects, email delivery, public API boundaries, job execution, sitemap/indexing and monitoring. Deliver editorial/admin training and operating documentation.

Acceptance: a recoverable, monitored live service with accountable owners, tested restoration, approved public content and no development fixtures, default credentials or exposed private records.

## 19. Quality gates and definition of done

For each feature, verify the relevant subset of these conditions:

- It works in FR, EN and AR, including RTL and realistic long content.
- It respects the approved route/page boundary, brand tokens and responsive grid.
- Loading, empty, error, denied and success states are honest and accessible.
- Public/private access rules hold through browser UI, direct API, local CMS queries, previews, media URLs and caches.
- Translation changes, publishing, withdrawal and slug changes correctly update navigation, search, redirects, caches and SEO.
- Necessary checks pass in CI. Tests cover meaningful behavior, especially permission boundaries, locale publication, search exclusion and contact failure/retry; avoid tests that merely mirror implementation.
- Automated accessibility checks are supplemented with manual interaction checks. Performance is measured against production output.
- No secrets, private source documents or real personal data enter fixtures, logs or public repository assets.
- Documentation and environment examples match the implemented behavior. Known limitations are specific and reproducible.

Before launch, additionally require content/translation approval, verified legal/privacy information, documented applicable CNDP/DGSSI obligations, assessed hosting/data flows, working recovery and operating ownership. A dashboard score is supporting evidence, not a substitute for these checks.

## 20. Open decisions to record while work progresses

Do not block the local foundation on these, but resolve them before dependent production features go live:

- Existing repository contents, permissions and available GitHub security features.
- Confirmed official domain/host variant and migration inventory.
- Production provider/region, institutional data classification and applicable cloud requirements.
- Final public copy, verified key figures, translated terminology and media rights.
- Licensed webfont files for the identified Plus Jakarta Sans family, an approved Arabic companion and original public imagery/illustrations separate from screenshots.
- Reconciliation of Illustrator/SVG Heritage Blue `#256BA2` with color-book `#296BB4`, and correct light/dark/monochrome asset selection.
- Editable Figma details only where the available exports cannot resolve a specific component/interaction question.
- Institutional contact recipients and approved email credentials/provider.
- Administrator accounts and production MFA/SSO implementation.
- LinkedIn organization identity, approved developer access and content-retention terms.
- Retention periods, privacy/rights contacts, CNDP formalities and analytics configuration.
- Repository/software/content licensing and approved public-source boundaries.

## 21. Primary implementation references

Checked while preparing this brief on 7 October 2026. Recheck package compatibility, security advisories and platform permissions at implementation time; these links support technical choices and do not certify deployment compliance.

- Next.js production: https://nextjs.org/docs/app/guides/production-checklist
- Next.js self-hosting: https://nextjs.org/docs/app/guides/self-hosting
- Payload installation/compatibility: https://payloadcms.com/docs/getting-started/installation
- Payload localization: https://payloadcms.com/docs/configuration/localization
- Payload access control: https://payloadcms.com/docs/access-control/overview
- next-intl routing: https://next-intl.dev/docs/routing/configuration
- Google multilingual discovery: https://developers.google.com/search/docs/specialty/international/localized-versions
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Core Web Vitals: https://web.dev/articles/vitals
- OWASP ASVS: https://owasp.org/projects/asvs
- CNDP website compliance: https://www.cndp.ma/conformite-des-sites-web/
- CNDP international transfers: https://www.cndp.ma/transfert-de-donnees-a-letranger/
- CNDP transfer procedure: https://www.cndp.ma/notifier-une-demande-de-transfert-a-letranger/
- DGSSI legislative/regulatory texts: https://www.dgssi.gov.ma/fr/textes-legislatifs-et-reglementaires/
- DGSSI web application security guide: https://www.dgssi.gov.ma/sites/default/files/publications/pdf/2024-07/web_application_security_guide_in_french.pdf
- LinkedIn API access: https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access
- LinkedIn organization Posts API: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api

## 22. First implementation task

Read this document and the repository instructions. Inspect the repository, inventory the supplied website exports/Illustrator assets, record the known color discrepancy and confirm the stack compatibility decision. Complete Milestones 0 and 1 on a reviewable branch. Deliver a running blank trilingual foundation, initial CMS, documentation and passing checks. Report blockers precisely and continue independent work. The next task is design-system and page implementation using the reviewed exports, approved identity and updated content; live Figma access is optional unless a specific missing detail requires it.
