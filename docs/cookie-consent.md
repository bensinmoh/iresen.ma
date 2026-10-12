# Cookie consent — 2026-10-12

The owner commissions the initial consent request and cookie management. This
supersedes automatic Google Maps loading from 2026-10-09. No deployment, analytics,
advertising service, integration, CMS schema or publication gate is added.

## Visitor journey and inventory

- First public visit: a non-modal banner offers **Accept all** in IRESEN blue first,
  a readable grey **Reject all**, **Accept necessary cookies only**, and a vector
  settings button revealing **Customize** on hover or keyboard focus. Continuing to browse does not grant
  consent. The site remains usable without deciding or accepting.
- Desktop preferences use a 56rem maximum width and one action row. At 64rem
  and below, acceptance/refusal share the first row; necessary-only and a compact
  gear share the second. The gear applies customized choices inside preferences
  and opens preferences from the initial banner; both have explicit localized
  accessible names and hover/focus labels. At intermediate banner widths, the action group sits at the trailing side in
  two rows. A ResizeObserver and font-ready recheck select the longest label
  fitting the actual button: full wording first, then “Uniquement le nécessaire”,
  then “Le nécessaire” only when needed. Hidden measurements are clipped out
  of the layout and accessibility tree. Action rows
  stretch evenly from a 48px minimum; hidden labels sit outside mobile layout
  and cannot inflate button height. Enlarged text can grow the matching rows.
- The preferences distinguish **necessary cookies** and **optional cookies**.
  Necessary-only and rejection both disable every optional purpose. Only one
  optional purpose is currently active: **external services / Google
  Maps**. Its checkbox defaults off; necessary operation is always enabled.
  No fictitious analytics/advertising category is offered.
- Google Maps has no iframe or request until explicit permission. Refusal leaves
  the placeholder and original directions link. Withdrawal immediately unmounts
  the iframe. Already transmitted Google data and third-party cookies cannot be
  erased by the site. Google controls its service; its privacy policy is linked.
- `iresen_consent` stores version, external-service choice and expiry, with no
  visitor identifier. Acceptance and refusal both last **180 days**, across public
  routes and locales. It is first-party, host-only, `Path=/`, `SameSite=Lax`, and
  `Secure` on HTTPS. Client-readable storage is required for the client-side gate;
  it is not an authentication or authorization credential.
- Invalid, outdated, missing and expired decisions fail closed. Storage failure
  shows an error and disables optional services in open tabs even if an earlier
  stored decision allowed them. A failed write cannot persist withdrawal across a
  reload: the error explains that a previous stored choice may return and asks
  the visitor to check browser settings. Changes propagate between
  open tabs through BroadcastChannel, and recheck on focus/pageshow and every
  30 seconds for expiry.
- The footer's permanent **Manage my cookies** button and existing cookies-page
  control reopen native dialog preferences, centered on both viewport axes with bounded
  internal scrolling. Its SVG close cross has a localized accessible name. Escape
  and Close abandon unsaved
  edits; focus returns to the originating control or main content if that control was
  removed. Banner decisions return focus to main content without jumping scroll. The canonical
  cookies link remains available for information without JavaScript.
- Without JavaScript, Google Maps remains blocked; direct contact/directions links
  and server-rendered information remain available. No consent is inferred.
- CMS authentication and isolated `/cms-preview` browser state are outside this
  public consent UI. Self-hosted fonts/media and ordinary outbound links do not
  load Google Maps. No separate analytics or advertising provider was found in the public application.

FR/EN/AR copy is explicit, with logical layout and unchanged brand tokens. The
existing four cookie-page anchors and central routes remain. Updated descriptions
and complete consent terminology enter `staticSearchDocuments`; no new asset or
route is introduced. Rebuild the local search index after changing this catalog.
Future optional providers must be inventoried, assigned a distinct purpose when
needed, gated before network activity, and increment `consentVersion` when the
consented scope changes. Never interpret this Google Maps choice as permission
for a future analytics or advertising provider.

## Legal boundary and sources

The engineering uses CNIL references for easy one-click refusal,
prior purpose information, persistent choices and withdrawal at any time; 180 days
implements its generally appropriate six-month retention recommendation.
Sources: [CNIL implementation guidance](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite)
and [updated FAQ](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ).
The owner selects a blue primary acceptance button and muted grey refusal; the
refusal remains enabled, readable and directly accessible. Legal review of the
final visual hierarchy remains part of release assessment. These are engineering
references, not a claim that French law alone determines
IRESEN's obligations. Institutional legal/IT review under Moroccan Law 09-08,
CNDP formalities, Google transfers/terms, final notices and production hosting
remains required as recorded in [security and privacy](security-and-privacy.md).
A banner alone cannot certify the entire site's legal compliance.

## Verification

Unit tests cover decision validation, both choices, policy versions and expiry.
The dedicated browser suite begins with empty storage and checks FR/EN/AR first
visits, no Google requests before consent, refusal persistence, opt-in, reload,
withdrawal, dialog focus/Escape, responsive containment and scoped axe checks.
Existing browser journeys explicitly begin with a stored refusal in Playwright;
contact map tests opt in explicitly. No-JavaScript contact tests assert no map
request and preserved contact/disclosure journeys. See [validation](validation.md).

Local review also permits only the additional loopback host `127.0.0.1` in
Next.js `allowedDevOrigins`, as required by the installed Next guide. This fixes
blocked dev assets/hot updates for the existing review URL; no production origin
or public visibility setting changes. Production browser checks use a separate
build directory and port so they cannot corrupt the owner's dev cache.

Owner follow-up — 2026-10-12: the footer retains its Cookie preferences link
without a duplicate Manage my cookies button. The linked page opens preferences;
first-visit and blocked-map controls remain.
