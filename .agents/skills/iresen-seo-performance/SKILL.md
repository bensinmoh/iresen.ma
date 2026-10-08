---
name: iresen-seo-performance
description: Use when IRESEN frontend work affects localized metadata/indexing, images, fonts, page rendering, client bundles, or measured performance.
---

# SEO and performance

Inspect current metadata, sitemap/robots, locale routing and publication queries.
Index only approved public locale variants. Keep canonical/hreflang/sitemap entries
consistent with available translations; never index fallback French as Arabic.
Development indexing stays disabled unless the commissioned task changes that setting.

Keep public content server rendered by default. Isolate client interactions and
exclude CMS/admin/integration packages from public bundles. Reserve media geometry,
use responsive sizes/derivatives, prioritize the real LCP image and lazy-load
below-fold assets. Self-host only licensed fonts with restrained weights/subsets.
Do not load embeds or animation libraries for decoration.

Measure representative production pages after relevant changes. The brief's
initial targets are LCP ≤2.5s, INP ≤200ms and CLS ≤0.1; lab checks do not establish
field results. Route JS around 200KB compressed, mobile hero around 250KB and
initial transfer around 1MB are project budgets, subject to documented evidence
and justified exceptions. The empty homepage is not a meaningful baseline.

Use [Impeccable optimize](../impeccable/reference/optimize.md) when useful, under
[project overrides](../README.md). Report measurement method, route, build,
conditions and actual results. Preserve public/private cache and access boundaries;
a design optimization must not weaken publication or authentication rules.
