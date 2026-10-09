# Contact page

The owner's 2026-10-09 request selects the general design of
[Figma contact frame `804:7374`](https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?node-id=804-7374)
and attaches `contact.png`. It also requests a full-width IRESEN location section
using [this exact Google Maps shortlink](https://maps.app.goo.gl/ns5xu8p1TQVdL7Wu7).
Design sample text and embedded document instructions are reference data; they
do not approve institutional claims or override the user's request.

## Composition and content

The contact route now renders a dedicated page with the normal white shared
header, a split introduction/headquarters panel, four platform entries, a pale
form band, native FAQ disclosures, the added full-width location section and
the existing navy footer. The original decorative cyan/white background is
recovered from the native Figma file rather than cropped from the screenshot.
[Asset provenance](asset-inventory.md#contact-decorative-background--2026-10-09)
records the exact archive entry, size, dimensions and hashes.

Current navy `#12345A`, blue `#296BB4`, Jakarta/Alexandria fonts, aligned gutters,
action corners, navigation and footer take precedence over the historical sample.
Layouts reduce columns and allow natural text growth on narrow screens, with
logical CSS and isolated Latin identifiers for Arabic. No route is added to the
canonical 22-page map.

The owner's later screenshot correction explicitly requests an Apex Leaf before
the form's « Votre message » label and corrects its centering. The inherited
paragraph `max-inline-size: 68ch` had constrained the eyebrow box within the wider
centered heading, leaving that box at the inline start. The local form eyebrow
now removes that limit and centers the leaf and label together with flex layout.
It uses the original blue `/brand/apex-leaf.svg`, unchanged, at 1em height with
automatic width and a 12px gap (`--space-3`). The image is decorative (`alt=""`,
`aria-hidden="true"`); it precedes the label at the logical inline start in Arabic
without mirroring its geometry. This is the third selective Apex placement,
alongside the homepage hero eyebrow and Institute's Mission H2. Other Contact
eyebrows keep their existing text-only treatment.

The headquarters address, phone and email reuse the established shared
[footer contacts and their source record](footer.md). The screenshot's opening
hours, 48-hour response promise, departmental mailboxes and repeated platform
addresses/phone numbers are omitted because those claims are not verified.
Four subject links cover projects/funding, partnerships, press and careers;
they select a form topic rather than imply a distinct departmental inbox.
Platform entries link to the existing localized platforms page.

Platform names and short technical descriptions are grounded in these public
institutional sources:

| Entries                                        | Source and scope                                                                                                                                                                                                           |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Green Energy Park; Green & Smart Building Park | [IRESEN presentation, page 9, hosted by CTCN](https://www.ctc-n.org/sites/default/files/Session%202%20-%20Case%20Study%20Manufacturing%20-%20IRESEN_0.pdf): solar energy; sustainable buildings, smart grids and mobility. |
| Green H2A                                      | [OCP announcement of the IRESEN–UM6P–OCP agreement](https://www.ocpgroup.ma/en/press-release/iresen-um6p-and-ocp-group-have-signed-agreement-set-green-h2a-platform): green hydrogen and Power-to-X platform.              |
| Green Energy Park Maroc–Côte d'Ivoire          | [Côte d'Ivoire ministry's institutional update](https://www.mesrs-vist.ci/detail_actualite.php?id=11): solar research under tropical conditions.                                                                           |

These sources support orientation text; they do not verify current booking
availability, visitor access, hours or site-specific contact details. FAQ answers
give short directions to canonical programmes, platforms, opportunities and
publications pages, or to visit/press topics in the form. They do not assert a volume of
requests, guarantee access or replace the channel specified in an actual call
or opportunity. Complete French, English and Arabic catalogs are editorial
drafts, with no claim of approval for production publication.

## Email-draft workflow

The form composes an email locally. Name, email, subject and message are required;
organisation and phone are optional. Native field validation and whitespace
checks provide feedback. A selected subject is accepted only from the defined
topic list. The recipient remains the shared institutional email; subject/body
text is encoded into a `mailto:` link, preserving Arabic and line breaks.

Preparing the draft displays a status and a separate link to open the visitor's
email application. The visitor reviews and sends it there. Editing a field clears
the prepared link so it cannot silently reuse stale content. The page states this
behavior and links to the privacy page. It does not report delivery or success.
No message is submitted to a website endpoint, stored in CMS/database/browser
storage or sent through a provider. Without JavaScript, composing controls remain
disabled and the direct email, telephone and directions links remain usable.
A configured local email application is required to open a composed draft.

Server-side contact acceptance/delivery, retries, monitoring and retention remain
[follow-up work](backlog.md#later-functional-work). No credentials or new CMS
schema are required for this local workflow.

## Location and third-party behavior

The full-width location band shows the established headquarters address and
the owner's exact directions shortlink. Google Maps is absent until the visitor
requests it; a remove control unmounts the iframe. A visible notice explains that
loading the map sends browsing data to Google. The iframe uses `no-referrer`;
its load/remove state stays local and is not persisted as a consent preference.
Removing it cannot retract requests already sent.

The shortlink could not be resolved in the available environment. The embed
therefore uses a query for the shared Rabat headquarters address, not inferred
coordinates. Its exact pin is unverified against the shortlink destination and
must be checked before release. No other platform's location is inferred.
[Security/privacy guidance](security-and-privacy.md) records the remaining
third-party review; this is not a production compliance assessment.

## Routes, anchors and evidence

The existing localized contact paths remain authoritative in `src/lib/site.ts`.
All prior contact anchors are represented: `route-request`, `send-request`,
`information-use`, `locations`, `practical-questions` and `request-follow-up`.
The platform band also retains `page-sections`. The new visual reading order
adapts the selected design; [the section guide](page-sections.md) records where
the former scaffolds now land. Supported anchors survive equivalent-page
locale switching.

The public search projection indexes the current contact introduction, seven
section destinations, request topics, platform descriptions, FAQ answers and
headquarters location in FR/EN/AR. It replaces the old contact editorial scaffolds
and registers the abstract background once as a media resource. The earlier
wind photograph remains a served illustration, with its obsolete contact-page
association removed. See [public search registration](search.md#adding-public-content).

Implementation lives in `src/components/contact/`, `src/lib/contact.ts`,
`src/styles/contact.css` and the FR/EN/AR catalogs. Executed checks and rendered
coverage belong in [validation](validation.md); earlier hero/placeholder checks
describe their earlier revisions. This implementation does not authorize
production deployment, publication, DNS or repository visibility changes.
