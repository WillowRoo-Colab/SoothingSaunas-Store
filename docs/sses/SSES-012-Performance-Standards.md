# SSES-012 - Performance Standards

**Soothing Saunas Engineering Specification**

| Property | Value |
|---|---|
| **Document ID** | SSES-012 |
| **Title** | Performance Standards |
| **Version** | 0.1 |
| **Status** | Approved |
| **Authority Level** | Engineering Standard |
| **Revision Date** | July 26, 2026 |

---

# 1. Purpose

This specification defines the performance standards for the Soothing Saunas headless storefront. It establishes measurable requirements for loading speed, responsiveness, visual stability, asset delivery, caching, runtime efficiency, and performance validation so that the guest experience remains fast and dependable across devices and network conditions.

Performance is a product requirement, not a discretionary optimization phase. Approved design, content, commerce, analytics, and integration work shall be implemented within the budgets and acceptance criteria defined by this specification.

# 2. Scope

This standard applies to all guest-facing routes and shared storefront systems, including:

- Homepage, collection, product, search, cart, editorial, guide, policy, and account-related storefront routes.
- Images, video, fonts, icons, CSS, JavaScript, JSON, and third-party resources.
- Server-rendered, statically generated, streamed, client-rendered, and hydrated interface behavior.
- Shopify Storefront API requests, commerce data loading, and cart interactions within the headless storefront.
- CDN configuration, cache policy, invalidation behavior, compression, and delivery headers.
- Build output, bundle composition, route-level code loading, and dependency cost.
- Laboratory testing, field monitoring, performance regression controls, and release gates.

# 3. Performance Principles

| Principle | Requirement |
|---|---|
| Guest-First Speed | The storefront shall prioritize meaningful content and usable commerce actions over decorative or nonessential work. |
| Field Experience Over Single Scores | Real-user performance at the 75th percentile is the primary experience indicator. Laboratory scores support diagnosis and release validation but do not replace field data. |
| Performance by Default | Components, media, integrations, and content patterns shall be designed to remain within defined budgets without requiring later rescue work. |
| Progressive Delivery | Critical content shall arrive first. Noncritical media, scripts, and features shall load only when needed or when the browser is idle. |
| Measured Change | Material changes shall be evaluated against a repeatable baseline. Regressions shall be investigated rather than accepted silently. |
| Resilient Commerce | Performance optimization shall not compromise cart accuracy, checkout handoff, pricing, inventory display, accessibility, security, or analytics integrity. |

# 4. Core Web Vitals Standards

Core Web Vitals shall be evaluated at the 75th percentile of page loads, segmented by mobile and desktop where field data is available.

| Metric | Approved Target | Release Interpretation |
|---|---|---|
| Largest Contentful Paint (LCP) | 2.5 seconds or less | Good. Values above 2.5 seconds require investigation; values above 4.0 seconds are release-blocking unless an owner-approved exception exists. |
| Interaction to Next Paint (INP) | 200 milliseconds or less | Good. Values above 200 milliseconds require investigation; values above 500 milliseconds are release-blocking unless an owner-approved exception exists. |
| Cumulative Layout Shift (CLS) | 0.10 or less | Good. Values above 0.10 require investigation; values above 0.25 are release-blocking unless an owner-approved exception exists. |

The storefront SHOULD target an LCP of 2.0 seconds or less on primary landing, collection, and product routes under representative mobile conditions to preserve operational margin below the approved threshold.

# 5. Supporting Performance Targets

| Measure | Target | Requirement |
|---|---|---|
| Time to First Byte (TTFB) | 800 ms or less at the 75th percentile | Server, edge, and data-fetching behavior shall be investigated when sustained field performance exceeds this target. |
| First Contentful Paint (FCP) | 1.8 seconds or less in representative mobile lab tests | Critical text, structure, and primary styling shall appear without waiting for noncritical application work. |
| Total Blocking Time (TBT) | 200 ms or less in Lighthouse mobile tests | Long tasks shall be reduced, split, deferred, or moved off the main thread where practical. |
| Speed Index | 3.4 seconds or less in Lighthouse mobile tests | Above-the-fold visual completion shall not depend on avoidable late-loading media or scripts. |
| Lighthouse Performance | 90 or higher on approved representative routes | A score below 90 requires documented review. A score below 80 blocks release unless explicitly approved. |
| JavaScript Errors | Zero uncaught errors during the tested guest journey | Errors affecting navigation, product selection, cart, or checkout handoff are release-blocking. |

Laboratory targets shall be measured using a documented test profile. Results shall not be compared across materially different devices, throttling settings, locations, or tool versions without noting the difference.

# 6. Route and Experience Coverage

Performance validation shall include, at minimum:

- The homepage.
- One representative collection page with typical product density.
- One representative product page with a typical gallery and product options.
- Search results and no-results states.
- Cart drawer or cart page behavior, including quantity changes and removal.
- One long-form educational or buying-guide page.
- One policy or low-complexity informational page.
- The transition from storefront cart to Shopify Checkout.

Testing shall cover cold-load and repeat-visit behavior. Mobile testing is mandatory because it represents the stricter performance constraint; desktop testing remains required for regression detection and layout-specific issues.

# 7. Image and Media Optimization

## 7.1 Image Requirements

- Images MUST be delivered at dimensions appropriate to the rendered slot and device pixel ratio.
- Raster images MUST use modern compressed formats when supported by the delivery platform, with an appropriate fallback where required.
- Responsive images MUST use `srcset` and `sizes`, or an equivalent image component that produces correct responsive candidates.
- Width and height, aspect-ratio, or equivalent reserved space MUST be provided to prevent layout shift.
- The likely LCP image MUST NOT be lazy-loaded and SHOULD receive explicit loading priority when that improves discovery.
- Below-the-fold and nonvisible carousel images SHOULD be lazy-loaded.
- Decorative images MUST NOT be allowed to delay primary content or commerce actions.
- Image quality settings SHALL balance fidelity with file size; original vendor assets MUST NOT be shipped directly when a smaller derivative is sufficient.

## 7.2 Video and Rich Media

- Autoplay video MUST NOT block initial rendering or download full media before guest intent is established.
- Video posters, previews, or facades SHOULD be used before loading the full player.
- Third-party embeds SHOULD use a lightweight facade and load the full embed only after interaction or proximity to the viewport.
- Background media MUST degrade gracefully on reduced-data, reduced-motion, and constrained-network conditions.

# 8. Fonts, Icons, and CSS

- Only approved font families, weights, and styles required by the visible experience shall be delivered.
- Critical font files SHOULD be self-hosted or delivered through an approved low-latency origin with long-lived caching.
- Font loading MUST use a strategy that prevents invisible text and minimizes disruptive swaps.
- Preload SHALL be limited to resources that are demonstrably critical to the first render.
- Icon systems SHOULD use optimized SVG or a similarly efficient method rather than a large unused icon font or library.
- Critical CSS SHOULD be available with the initial document or early route payload.
- Unused CSS MUST be removed or excluded from route delivery where the framework and build process support it.
- Animations MUST prefer compositor-friendly properties and MUST comply with reduced-motion preferences.

# 9. JavaScript and Bundle Standards

## 9.1 Delivery Rules

- JavaScript SHALL be treated as a constrained resource, especially on mobile devices.
- Route-level code splitting MUST be used where supported so guests do not download code for unrelated routes or features.
- Noncritical components, analytics, personalization, chat, reviews, and rich media SHOULD be dynamically imported or deferred.
- Tree shaking and production minification MUST be enabled for release builds.
- Large dependencies MUST be justified against lighter native or focused alternatives.
- Duplicate libraries, polyfills, and utility implementations MUST be removed when they provide equivalent behavior.
- Hydration and client-side state MUST be limited to the portions of the page that require interactivity.
- Long-running tasks SHOULD be broken into smaller units or moved off the main thread when practical.

## 9.2 Initial JavaScript Budgets

| Budget | Target | Control |
|---|---|---|
| Initial route JavaScript, compressed | 200 KB or less for standard content routes | Exceeding the target requires documented review and a reduction plan. |
| Initial route JavaScript, compressed | 250 KB or less for interactive product or cart routes | Exceeding the target requires owner approval or an approved temporary exception. |
| Single third-party script, compressed | 50 KB or less unless business-critical | Larger scripts require impact measurement, justification, and deferred loading where possible. |
| Main-thread long tasks | No avoidable task over 50 ms during initial interaction readiness | Repeated long tasks shall be profiled and reduced before release. |

These budgets are project controls, not universal browser limits. They may be revised through approved SSES change control after measured evidence demonstrates that a different budget better protects the guest experience.

# 10. Data Fetching and Shopify Performance

- Above-the-fold storefront data MUST be requested using the minimum fields required for the route.
- GraphQL queries MUST avoid broad or unused selections, unnecessary nested connections, and duplicate requests.
- Requests that can run concurrently SHOULD run concurrently unless ordering is required for correctness.
- Waterfall data fetching MUST be eliminated where data dependencies do not require sequencing.
- Product, collection, and editorial data SHOULD use server, build, or edge caching appropriate to freshness requirements.
- Cart mutations MUST preserve correctness and SHOULD provide immediate progress feedback without blocking unrelated interaction.
- Failed or slow commerce requests MUST degrade predictably and display recoverable guest-facing states.
- Prefetching MAY be used for high-confidence navigation but MUST NOT create excessive API traffic or compete with critical resources.

# 11. Caching and CDN Strategy

| Resource Class | Required Strategy |
|---|---|
| Hashed static assets | Long-lived public caching with immutable semantics when filenames change with content. |
| Images and media derivatives | CDN delivery, format negotiation where available, responsive transformation, and long-lived caching when source identity is stable. |
| HTML and route responses | Caching appropriate to route freshness, personalization, and commerce correctness, with stale-while-revalidate or equivalent patterns where safe. |
| Shopify and external API data | Server or edge caching only when consistent with inventory, price, publication, and privacy requirements. |
| Authenticated or guest-specific data | Private or no-store behavior when shared caching could expose or corrupt user-specific state. |
| Invalidation | A documented mechanism shall refresh affected content after product, price, inventory, publication, or configuration changes. |

- The storefront MUST use an approved CDN or edge delivery layer for public assets and cacheable responses.
- Brotli or gzip compression MUST be enabled for compressible text resources.
- Cache-Control and related headers MUST be explicit for material resource classes.
- Caching MUST NOT cause stale pricing, invalid cart behavior, private-data exposure, or broken publication controls.
- Cache misses, revalidation, and invalidation behavior SHOULD be observable during troubleshooting.

# 12. Third-Party Resource Governance

Every third-party script, embed, tag, widget, or SDK introduces performance, privacy, security, and operational cost.

- Third-party resources MUST have an identified owner, business purpose, and removal path.
- New third-party resources MUST be measured on representative routes before approval.
- Consent-dependent resources MUST NOT load before the applicable consent condition is satisfied.
- Nonessential third-party resources SHOULD load after primary content and commerce controls are usable.
- Resources that create material Core Web Vitals regression, long tasks, duplicate tracking, or unstable layout MUST be remediated, replaced, conditionally loaded, or removed.
- A third-party outage MUST NOT prevent basic storefront navigation, product discovery, cart access, or checkout handoff.

# 13. Loading Priority and Lazy Loading

- Critical text, navigation, primary styling, the LCP candidate, and essential route data MUST receive priority over decorative or below-the-fold resources.
- Native lazy loading SHOULD be used for eligible images and iframes when it does not harm the LCP experience.
- Content immediately below the fold MAY be loaded eagerly when testing demonstrates that delayed discovery creates visible blank space or interaction delay.
- Lazy-loaded components MUST reserve layout space and MUST NOT create unexpected page movement.
- Intersection observers, scroll listeners, and prefetch mechanisms MUST be implemented efficiently and cleaned up when no longer needed.
- Loading indicators SHOULD communicate progress without replacing stable page structure or causing layout shift.

# 14. Performance Testing and Tooling

## 14.1 Required Test Types

| Test Type | Purpose | Minimum Use |
|---|---|---|
| Lighthouse or equivalent lab audit | Repeatable diagnosis under controlled conditions | Representative routes before release and after material performance changes. |
| Browser performance profiling | Main-thread, network, rendering, and memory diagnosis | Required when budgets or interaction targets are exceeded. |
| Field Core Web Vitals monitoring | Actual guest experience across devices and networks | Continuous after sufficient traffic exists. |
| Synthetic monitoring | Availability and repeatable route timing from controlled locations | Recommended for primary commerce routes. |
| Bundle analysis | Dependency and route payload inspection | Required when JavaScript budgets regress or major dependencies change. |
| Network inspection | Cache, compression, priority, waterfall, and duplicate-request review | Required for material route or integration changes. |

## 14.2 Test Reproducibility

- Test records MUST identify the route, commit or release, tool version, device profile, throttling profile, cache state, location when relevant, and date.
- Comparisons MUST use equivalent conditions or clearly disclose material differences.
- At least three laboratory runs SHOULD be collected for a release decision, with the median used for comparison unless the approved tool provides a more robust aggregate.
- One unusually favorable run MUST NOT be used to dismiss a reproducible regression.

# 15. Monitoring and Regression Control

- Performance metrics SHOULD be monitored by route template and device class rather than only as a whole-site average.
- Releases SHOULD be annotated in monitoring systems so regressions can be associated with deployment changes.
- A sustained regression that moves a Core Web Vital from Good to Needs Improvement or Poor MUST trigger investigation.
- Performance incidents affecting commerce usability shall be handled with the same urgency as functional defects of comparable guest impact.
- Regression findings, accepted exceptions, and remediation ownership MUST be recorded in the appropriate engineering workflow.
- Performance data collection MUST comply with approved privacy, consent, security, and analytics standards.

# 16. Release Gates and Exceptions

A production release is eligible for approval only when all applicable acceptance criteria are met or an explicit temporary exception has been approved.

| Gate | Release Requirement |
|---|---|
| Core Web Vitals | No known change introduces a material regression beyond approved thresholds on representative routes. |
| Lighthouse | Representative routes meet the approved target or have documented review and approval. |
| Bundle Budget | Initial compressed JavaScript remains within the applicable route budget or has an approved exception. |
| Functional Integrity | Performance work does not break navigation, product configuration, pricing, cart, checkout handoff, accessibility, security, or analytics. |
| Asset Delivery | Critical images, fonts, CSS, and scripts use appropriate sizing, priority, compression, and caching. |
| Errors | No uncaught JavaScript errors or failed critical requests occur during tested guest journeys. |
| Documentation | Material exceptions, known constraints, and follow-up work are recorded with an owner and review condition. |

A temporary exception MUST identify the affected route or feature, measured impact, business reason, owner approval, mitigation, responsible party, and expiration or review date. An exception does not permanently revise this standard.

# 17. Responsibilities

| Role | Responsibility |
|---|---|
| Owner | Approves this standard, material budget changes, and temporary exceptions that permit release outside approved limits. |
| Implementer | Builds within the approved budgets, measures material changes, documents regressions, and escalates conflicts. |
| Reviewer | Validates test conditions, inspects representative routes, and confirms that exceptions and acceptance evidence are complete. |
| Content and Merchandising Contributors | Provide appropriately sized media and avoid content patterns that create avoidable payload, layout shift, or blocking behavior. |
| AI Assistant | May implement and test approved performance requirements but must not silently relax budgets, remove required functionality, or redefine acceptance criteria. |

# 18. Engineering Directives

## MUST

- Meet the approved Core Web Vitals thresholds at the 75th percentile when sufficient field data exists.
- Prioritize critical guest content and commerce functionality over nonessential resources.
- Optimize responsive media and reserve layout space.
- Enforce route-level JavaScript budgets and investigate regressions.
- Use explicit caching, compression, and CDN delivery strategies.
- Test representative routes before release.
- Document and obtain approval for temporary exceptions.

## SHOULD

- Target performance margin better than the minimum approved thresholds.
- Defer or conditionally load noncritical and third-party resources.
- Use field monitoring, synthetic monitoring, and bundle analysis to detect regressions early.
- Design components and content patterns to remain performant by default.

## MUST NOT

- Lazy-load the likely LCP image.
- Ship unoptimized vendor media when an appropriate derivative can be produced.
- Allow decorative features or third-party tools to block core storefront use.
- Compare performance results gathered under materially different conditions without disclosure.
- Accept a performance regression silently because a single Lighthouse score remains passing.
- Compromise commerce correctness, accessibility, privacy, or security to improve a metric.

# 19. Acceptance Criteria

SSES-012 is satisfied when:

- Core Web Vitals targets and supporting performance targets are implemented as measurable project controls.
- Representative route coverage is defined and used for release validation.
- Image, video, font, CSS, JavaScript, data-fetching, caching, and third-party delivery rules are implemented.
- Initial JavaScript budgets are measured and enforced or formally excepted.
- Laboratory tests are reproducible and field data is used when available.
- Release gates prevent unapproved material regressions.
- Performance monitoring and remediation ownership are established.
- The human-readable and Claude Markdown sections are substantively synchronized.

# 20. Owner Directive

The Soothing Saunas storefront shall feel calm, immediate, and trustworthy. Performance work exists to protect the guest from unnecessary waiting, unstable interfaces, delayed interaction, and hidden technical cost. New features shall earn their place within the approved performance budget rather than transferring their cost to every guest.