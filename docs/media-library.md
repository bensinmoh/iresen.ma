# Médiathèque — 2026-10-10

The owner commissioned the existing media page with reports, photographs, videos
and institutional links. The retained research-institute benchmark informs a
visitor-first resource directory: clear categories, direct access and concise
source information. Its source remains unchanged; no additional route is introduced.

## Delivered scope

- Twenty owner-supplied photographs, selected across platforms, research/testing,
  projects, events and institutional life, including the supplied portrait of
  Samir Rachidi, Directeur général d’IRESEN. The owner explicitly authorized their
  public inclusion. Originals remain private; orientation-corrected WebP copies
  meet at least 1920 pixels in width or 1080 pixels in height, resized from verified originals with proportional enlargement only where needed. See the hash manifest below.
- A filterable gallery with native full-image links, an accessible modal,
  previous/next controls, Escape dismissal, restored focus and derivative download.
- Eight locally imported owner-supplied videos, excluding Drone. The owner
  explicitly authorized all eight public on 2026-10-10, retaining original titles
  in FR/EN/AR, without deployment. Existing CMS publication/locale/rights gates
  apply; every metadata query uses `overrideAccess: false`, `draft: false` and
  `fallbackLocale: false`. Files use the guarded locale endpoint, without Next's
  persistent image cache. Native controls use `preload="none"`, no autoplay and
  posters extracted from the actual source. Empty and unavailable states are separate.
- Ten PDF resource links from the supplied Ministry strategies folder. Original
  document titles and language are retained. Descriptions are localized working
  copy based on the documents. PDFs remain at their external source; neither a
  private-source PDF import nor a Drive sharing change is made.
- Official destinations for MASEN, ANRE, AMEE, ONEE and MTEDD.

The twenty photos are recorded in `src/data/media-photos.json`; source hashes and
public derivative fingerprints are in `docs/media-library-photos.json`.
`src/data/media-reports.json` records source links, language and source byte sizes.
`src/data/media-videos.json` contains only public upload filenames, extracted
poster paths, durations and original-file fingerprints, never upload bytes or
credentials. Six MP4 originals are stored byte-identically in the local CMS; two
M4V originals are preserved locally with losslessly remuxed MP4 playback copies.
The eight original files total 2,604,894,773 bytes. These full-size archival
uploads remain local CMS data, outside Git; deployment/storage transfer is separate.
No event dates, subtitles, complete transcripts or unrestricted reuse licence are
invented. Source dates are not event dates. Video captions currently retain the
original titles. A video-caption accessibility rule is explicitly excluded from
the automated scan because the supplied sources have no reviewed subtitle files.

The owner subsequently requested a shorter hero and a generated media-library
visual, removal of the missions band on this page, varied photo sizes, a compact
horizontal video rail, animated section links and a modern centered viewer.
The hero now uses a generated illustrative still-life of scientific reports,
photographic prints and a camera, not a claimed IRESEN location; its prompt and
fingerprints are in `docs/media-library-hero.json`. Other shared heroes and
brand SVG geometry are preserved. The media hero is 76dvh minimum, with natural
growth for enlarged/long text. The supplied Samir Rachidi portrait appears first. A large photo and four smaller
photos compose each desktop group, alternating the large image left/right; tablet/mobile reflow retains the source order. The video cards use full-height thumbnails with a softly blurred blue-tinted
background and a cover-cropped foreground. Activating a card opens a centered native
video dialog; actual films retain their original 16:9 framing. No-JavaScript
visitors retain direct guarded-file links. The horizontal rail supports native
scrolling, keyboard access and SVG controls.
The centered native dialog enlarges from the clicked photo using a scoped
transform animation, then reveals icon controls; download remains a text action.
Photos fill their frames without exposed borders, with Samir’s face positioned centrally. The centered popup is limited to 80vw and 80dvh; its image covers the available stage. Download includes a downward SVG arrow. Video cards use cover cropping and a larger play icon that appears on hover or keyboard focus, arriving from above while the thumbnail enlarges slightly and a 15% black overlay appears. The keyboard focus ring sits inside video cards so the horizontal rail cannot clip its top edge. The play control is centered in the area above each card’s title. The video popup offers a guarded original-file download immediately left of close. Grid sizing reserves space for controls within the 80% viewport cap, without inner scrolling. Filtering uses scoped
FLIP transforms for retained tiles and short reveals for incoming photos.
Reduced motion bypasses image/control/tile animation and smooth scrolling. Scoped light/ink surfaces,
vector controls and logical CSS follow the current shared design rules.

## Routing and search

The canonical `media` page ID and five legacy anchors remain. `videos` and
`reports` are added as stable anchors. All FR/EN/AR catalogue keys are complete;
localized working descriptions are distinct from final editorial approval.

Twenty static photo originals and the separately identified generated hero have
searchable localized metadata through
`publicAssetReferences`; hero usage does not duplicate its photo result. Video
posters are derivatives of their CMS originals, not separate search results.
Ten document references and five institutional destinations link to reachable
page anchors. CMS videos use the existing guarded update/delete projection;
withdrawal remains governed by the shared access/search tests. The local index
was rebuilt and the eight video results checked in all three locales. The final
whole-site glossary/content sanity check remains pending final website content.

## Sources and boundaries

- [Owner-supplied Ministry strategies folder](https://drive.google.com/drive/folders/16ruE_KIPGATcGTyEzkbsRxrYZA-hu0Jv).
- [MASEN](https://www.masen.ma/), [ANRE](https://anre.ma/),
  [AMEE](https://amee.ma/), [ONEE](https://www.one.org.ma/),
  [MTEDD](https://www.mtedd.gov.ma/).
- The supplied portrait filename identifies Samir Rachidi; the current role is
  supported by the [Université Ibn Tofail, 4 March 2026](https://www.uit.ac.ma/le-president-de-luniversite-ibn-tofail-a-recu-dr-samir-rachidi-directeur-general-de-iresen/).

Other photographs, source archives, local import manifests, credentials and private
references stay excluded. No fictional content, new CMS collection, deployment,
DNS change or production publication is introduced. Public inclusion here is on
the development site, as explicitly requested by the owner.

## Video navigation pills — 2026-10-10

The video rail now has one expanding pill per approved video, with no border or
inset stroke. The group sits below the thumbnails, centered within the equal
32px gaps before the reports link. Pills reveal their associated video and follow
native scrolling, resize and RTL; shared terminal offsets retain separate item
selection. Controls disappear without overflow. Reduced motion is direct;
no-JavaScript retains native scrollbars and guarded file links. Existing anchors,
CMS/media gates and search references remain. See [requirements](horizontal-scroll-indicators.md).
