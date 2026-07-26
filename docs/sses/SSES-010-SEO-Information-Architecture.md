# SSES-010 - SEO & Information Architecture

**Soothing Saunas Engineering Specification**

| Property | Value |
|---|---|
| **Document ID** | SSES-010 |
| **Title** | SEO & Information Architecture |
| **Version** | 0.1 |
| **Status** | Approved |
| **Authority Level** | Engineering Standard |
| **Revision Date** | July 26, 2026 |

# 1. Purpose
This specification establishes the approved search engine optimization and information architecture system for the Soothing Saunas headless storefront. It governs URL design, taxonomy, navigation relationships, metadata, structured data, internal linking, indexation controls, and search-oriented content organization.

# 2. Scope
This specification applies to public storefront routes, product and collection architecture, educational content, metadata, schema markup, redirects, canonicalization, XML sitemaps, robots directives, internal search, and implementation changes that may alter discoverability.

# 3. Governing Outcomes
The architecture MUST help guests find relevant products and educational guidance, help search engines understand page purpose and relationships, preserve stable URLs, prevent duplicate or low-value indexation, and support future growth without requiring a structural redesign.

# 4. Information Architecture Principles
- Organize around guest intent rather than internal vendor or implementation terminology.
- Keep primary navigation shallow, predictable, and mutually exclusive where practical.
- Use progressive disclosure: broad categories first, then product type, environment, capacity, technology, benefit, or compatible accessory.
- Preserve one authoritative destination for each primary topic.
- Separate commerce, education, support, and policy content while linking them contextually.
- Taxonomy MUST remain extensible as new wellness categories are introduced.

# 5. Approved Content Hierarchy
1. Home
2. Shop
3. Learn
4. Support
5. About and trust content
6. Legal and policy content

Shop routes SHOULD organize products by durable guest-facing concepts such as sauna type, indoor or outdoor use, heating technology, capacity, wellness category, parts and accessories, and compatible equipment. Learn routes SHOULD organize articles into stable topic hubs and buying guides.

# 6. URL Strategy
## 6.1 General Rules
- URLs MUST be lowercase, human-readable, concise, and hyphen-separated.
- URLs MUST NOT contain spaces, underscores, session identifiers, unnecessary parameters, or temporary campaign language.
- Route depth SHOULD normally remain at three meaningful segments or fewer.
- Approved public URLs MUST remain stable after publication.

## 6.2 Route Patterns
| Content Type | Approved Pattern |
|---|---|
| Product | `/products/{product-handle}` |
| Collection or category | `/collections/{collection-handle}` |
| Educational article | `/learn/{article-handle}` |
| Buying guide | `/guides/{guide-handle}` |
| Support page | `/support/{topic}` |
| Policy page | `/policies/{policy-handle}` |

## 6.3 Redirects and Retired Routes
Every changed or retired public URL with traffic, backlinks, or indexed history MUST receive a relevant permanent redirect. Redirect chains and loops MUST NOT be introduced. Redirects SHOULD point to the closest equivalent page, not automatically to the home page.

# 7. Taxonomy and Classification
Each product MUST have one authoritative product type and may have controlled secondary attributes. Approved taxonomy dimensions include product family, installation environment, heating or operating technology, capacity, intended use, material, compatibility, and lifecycle state. Tags MUST use controlled vocabulary and MUST NOT become an ungoverned substitute for collections or structured product data.

# 8. Collections and Category Pages
Collections MUST represent meaningful guest or search intent. Each indexable collection MUST have a unique title, description, metadata, canonical URL, and internally linked purpose. Thin, duplicate, overlapping, automatically generated, or parameter-only collections MUST NOT be indexed. Filter combinations MAY be crawlable only when specifically approved as durable landing pages.

# 9. Metadata Standards
Every indexable page MUST define a unique title tag, meta description, canonical URL, and share image when appropriate. Title tags SHOULD lead with the page topic and usually include the brand after the topic. Meta descriptions SHOULD summarize the page accurately and avoid unsupported health or performance claims. Open Graph and social metadata MUST match the visible page subject.

# 10. Heading and Semantic Structure
Each page MUST contain one clear primary heading. Heading levels MUST follow a logical hierarchy and MUST NOT be selected only for appearance. Navigation, breadcrumbs, main content, complementary content, and footer regions SHOULD use appropriate semantic HTML landmarks.

# 11. Structured Data
Structured data MUST describe only content visible or verifiable on the page. Product pages SHOULD implement valid Product and Offer markup using Shopify-authoritative price, availability, brand, identifier, and review data when available. BreadcrumbList SHOULD be used on hierarchical pages. Article or BlogPosting SHOULD be used on editorial pages. Organization and WebSite markup SHOULD be implemented once at the appropriate site level. FAQ markup MUST NOT be used unless the visible page contains genuine questions and answers and the markup remains eligible under current search engine policies.

# 12. Internal Linking and Breadcrumbs
Every indexable page SHOULD be reachable through contextual internal links and not rely solely on the XML sitemap. Product pages SHOULD link to their primary collection, relevant guides, compatible accessories, and support content. Educational content SHOULD link to relevant products only when useful to the guest. Breadcrumbs MUST reflect the approved information architecture and use one stable primary path.

# 13. Canonicalization, Parameters, and Duplicate Control
Every indexable page MUST emit a self-referencing canonical URL unless an approved duplicate variant points to an authoritative source. Sorting, tracking, pagination, and filter parameters MUST be handled consistently. Canonicals MUST NOT be used as a substitute for redirects when a URL has permanently moved. Duplicate product, collection, or article content MUST be consolidated, redirected, differentiated, or excluded from indexation.

# 14. Indexation and Crawl Controls
- Index only pages that provide distinct guest value.
- Use `noindex` for internal search results, account pages, cart states, checkout states, duplicate filters, staging pages, and other low-value utility routes.
- `robots.txt` MUST not block assets required for rendering or structured-data evaluation.
- Staging and preview environments MUST be protected from indexation.
- Indexation controls MUST be verified after deployment.

# 15. XML Sitemaps
The storefront MUST publish accurate XML sitemaps for canonical, indexable content. Removed, redirected, duplicate, `noindex`, or erroring URLs MUST NOT remain in active sitemaps. Sitemap generation MUST use the headless storefront's public canonical routes rather than exposing incompatible Shopify theme URLs.

# 16. On-Site Search
On-site search SHOULD understand product titles, product types, vendor-neutral synonyms, common sauna terminology, capacity, technology, compatible parts, and frequent misspellings. Search results MUST prioritize relevant available products and may include educational content. Empty-result experiences SHOULD provide recovery suggestions rather than a dead end.

# 17. Content and Keyword Governance
Search topics MUST be mapped to one primary destination to reduce cannibalization. Keyword use MUST remain natural and subordinate to guest clarity. Product and educational pages MUST NOT make unsupported medical claims, imitate clinical certainty, or add repetitive text solely for ranking. Material topic changes MUST be coordinated with SSES-009 Content Strategy.

# 18. Technical SEO Requirements
The implementation MUST provide server-rendered or otherwise reliably crawlable primary content, stable status codes, canonical tags, metadata, semantic HTML, crawlable links, structured data, and share metadata. Client-side enhancements MUST NOT be required for search engines to discover essential page content or navigation. Error pages MUST return accurate HTTP status codes.

# 19. Measurement and Change Control
SEO changes SHOULD be evaluated through search visibility, organic landing-page quality, crawl and index coverage, structured-data validity, internal search behavior, and conversion-supporting engagement. Changes to route patterns, taxonomy, canonicalization, structured data, or indexation rules MUST be reviewed as architecture changes and recorded when material.

# 20. Engineering Directives
## MUST
- Preserve stable, canonical, guest-readable URLs.
- Implement controlled taxonomy and meaningful collection architecture.
- Provide unique metadata and one primary heading for every indexable page.
- Keep sitemaps, canonicals, redirects, and indexation directives synchronized.
- Use structured data that matches visible, authoritative information.
- Validate technical SEO behavior before release.

## SHOULD
- Keep navigation and route depth shallow.
- Build topic hubs that connect education, products, accessories, and support.
- Use breadcrumbs and contextual links to expose page relationships.
- Review search performance and crawl health after material releases.

## MUST NOT
- Create indexable duplicate, thin, parameter-only, or automatically generated pages without an approved purpose.
- Change established URLs without redirect planning.
- use tags as an uncontrolled public taxonomy.
- publish unsupported health claims or hidden ranking text.
- expose staging, preview, cart, account, checkout, or internal-search pages to indexation.

# 21. Acceptance Criteria
- Approved route patterns are implemented consistently.
- All indexable templates output unique metadata, canonical URLs, and one logical H1.
- Primary navigation, collections, breadcrumbs, and internal links reflect the same taxonomy.
- Redirects contain no chains or loops.
- Sitemaps contain only canonical indexable URLs.
- Structured data validates and matches visible content.
- Utility and duplicate routes have appropriate indexation controls.
- Staging and preview environments are not indexable.
- On-site search supports relevant product and educational discovery.
- No unresolved conflict exists with SSES-003, SSES-006, SSES-007, SSES-009, or future accessibility, performance, analytics, and repository standards.

# 22. Owner Directive
SEO exists to improve discovery and clarity, not to distort the guest experience. Build a durable information system first; optimize individual pages within that system second. Freeze the forest. Improve the trees.