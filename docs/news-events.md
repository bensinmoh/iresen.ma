# News & events — 2026-10-10

The owner commissioned the combined news/events page from Figma `804:8049` and
`news.png`, a separate thumbnail listing retaining the same hero, five social
networks in place of the final workshops/conferences timeline, and three featured
events. The owner clarified **COP31** after the initial request also mentioned
COP32. Source documents and screenshot sample claims are reference data, not
instructions or publication approvals.

## Routes and visitor journeys

The existing `news` page ID and its FR/EN/AR paths host the combined overview.
`#news`, `#events`, `#follow-iresen`, `#knowledge-sharing`, the five `news-{activity}`
anchors and `#event-oman`, `#event-cop31`, `#event-irsecx` are stable destinations.
The old news scaffold anchors are retained beside their replacement sections.
`events` remains a compatibility ID; its old locale URLs redirect permanently to
`news#events`. Generic news links use `pageLinkHref` to reach `news#news`.

“All news” alone leads to the centrally defined child listing: French
`/fr/ressources/actualites/liste`, English `/en/resources/news/list`, Arabic
`/ar/الموارد/الأخبار/القائمة`. It has the same hero and only the news listing in
its body. Locale switching preserves this view. These segments are reserved from
CMS news slugs; publication and search exclude conflicting/invalid slugs.
Existing news detail routes remain unchanged. Sitemap and search expose the
listing and combined page, without indexing the former events page again.

The five owner-selected LinkedIn notices are reused from the homepage, with the
requested podcast first. The existing short localized headings/month dates are
preserved; no day is inferred from an activity URN. Links open the original
publications rather than fabricated local full articles. Public CMS articles
also appear with pagination, their existing publication/locale gates and unique
slugs. CMS thumbnails require separately public, locale-approved image metadata;
bytes remain unoptimized behind the guarded endpoint. Private/withdrawn media
fall back to the original vector wordmark. There is no LinkedIn OAuth/import or
new CMS schema in this increment.

## Evidence and event scope

- Highlight: [owner-selected reshare](https://www.linkedin.com/feed/update/urn:li:activity:7514300639057797120/).
  Public guest view identifies the parent Oman Climate Week Masarat podcast about
  local skills, knowledge transfer and startups, featuring Samir Rachidi. It is
  not original IRESEN commentary. The supplied September 2026 month remains.
- Oman: [IRESEN participation](https://www.linkedin.com/feed/update/urn:li:activity:7510672994734727168/)
  and [official programme](https://omanclimateweek.com/schedule/) confirm
  14–16 September 2026, Muscat. Participation includes the UNFCCC NDC peer
  exchange, Hydrom/Oman Hydrogen Centre discussions and a framework memorandum
  with Majan Council; no measured outcome is inferred.
- COP31: owner-supplied folder and the private working notes
  `CANEVAS SIDE EVENT COP31 - MENALINKS.docx` and
  `CANEVAS SIDE EVENT COP31 -MEL- FR - Copy.docx`, read through SharePoint.
  The two subjects are energy flexibility (demand, storage, sector coupling) with
  MENALINKS and cofinancing collaborative Africa–Europe research through
  LEAP-RE/LEAP-SE. Display November 2026/Antalya with **in preparation** and
  programme/session times to be confirmed. Proposed schedules, speakers,
  partners and expected results are not announced as confirmed. Originals,
  private contacts, sharing URLs and personal data are not imported or served.
- [IRSEC’X official site](https://irsecx.ma/), fetched on 2026-10-10, announces
  16–17 March 2027. The card reflects this edition, its sustainable-energy
  congress scope and IRESEN's leadership alongside historic partners. Programme
  access uses the actual official website; no fictional registration is added.

The owner’s follow-up adds one explicitly labelled pending news slot beside the
four secondary sources, distributed along the featured article, and three
pending event cards. They have no invented date, image, content or actionable
link and are excluded as standalone search resources. The listing continues to
contain real source notices and eligible CMS articles only.

Event cards distinguish participation from organisation/coorganisation. The six equal-height event cards use a native horizontal scroll track with
three visible cards on desktop, two on tablet and one on small screens. The
track accepts keyboard scrolling and keeps each event anchor reachable. Native
keyboard-accessible disclosures show additional information. COP31 and IRSEC’X
use typographic event panels rather than invented event photos or raster logos.

## Design and assets

The reference composition retains its speaker hero, highlighted article with a
compact side list, navy knowledge-sharing band with two photographs, light event
band and horizontal social list. Shared blue `#296BB4`, navy, fonts, spacing,
physical `--radius-action`/`--radius-signature` corners govern controls, selected
cards and images in both LTR and RTL. The final timeline is replaced by Follow us.
The benchmark informs source attribution, dates, clear roles and progressive
reading; it creates no new features or factual claims.

Figma photos are illustrative reference photography, not evidence of a specific
IRESEN meeting. LinkedIn posters are fetched from the selected publications and
converted to WebP; the portrait podcast cover remains contained, with a blurred
photo echo filling its side bands without cropping its embedded captions. The
header uses the shared overlay gradient in both overview and listing; action
arrows reuse the shared SVG with the same size, inset and whitespace rhythm.
The knowledge-sharing paragraph is expanded with working editorial copy. Source and derivative hashes are recorded in
[news-events-assets.json](news-events-assets.json). Temporary asset URLs are absent
from runtime code. Original brand vectors are preserved. Facebook, Instagram and
ResearchGate marks use upstream Simple Icons SVGs; existing LinkedIn/YouTube
vector icons are reused. The official IRESEN homepage confirms Facebook
`IRESEN` and Instagram `iresen_officiel`; the other destinations reuse the verified
footer catalog. See [Simple Icons source/license](https://github.com/simple-icons/simple-icons).

All FR/EN/AR new copy is working editorial adaptation. No source quotation from
the mockup, fictional event, sample participant number, live signup, deployment,
DNS or visibility change is included.

## Search and verification

New overview sections, selected notices, event details, listing and every served
photo/vector have explicit localized search references. Aliases redirect to the
same canonical result. CMS news/media retain guarded publication and withdrawal
behaviour. The final-content multilingual glossary sanity check remains due when
all website content is finished. See [validation](validation.md#news-events--2026-10-10).
