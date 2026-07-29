# Soothing Saunas Homepage Build Blueprint

**Implementation Type:** Headless Shopify storefront homepage  
**Page Route:** `/`  
**Primary Experience Mode:** Immersive commerce  
**Visual Theme:** Charcoal environment with cream editorial transitions and restrained gold accents  
**Owner Intent:** “Turn the lights down and say: picture this.”

---

# 1. Homepage Objective

The homepage must perform four jobs in this order:

1. **Create desire** by placing the guest inside the emotional experience of warmth, privacy, restoration, and self-care.
2. **Make the catalog understandable** through obvious product-finding paths.
3. **Reduce uncertainty** through guidance, education, service access, and trust signals.
4. **Create momentum** toward a collection, quiz, educational guide, product page, or consultation.

The homepage must not feel like a product grid placed beneath a banner. It should feel like a guided transition from aspiration to discovery to confidence.

---

# 2. Governing Experience Principles

## 2.1 Page-mode distinction

### Commerce environments
Use the dark charcoal visual system for:

- Homepage
- Product pages
- Collection pages
- Cart and product discovery surfaces
- Promotional commerce landing pages

**Purpose:** Reduce visual noise and create an immersive “picture yourself here” environment.

### Learning environments
Use the cream visual system for:

- Blog
- Guides
- Quizzes
- Educational articles
- Comparison tools
- Health and wellness resources

**Purpose:** Increase visual clarity, concentration, reading comfort, and engagement.

### Cross-mode components
Use intentionally inverted floating cards to connect commerce and education:

- **On cream content pages:** charcoal product card with gold trim
- **On charcoal commerce pages:** cream “Did You Know?” or education card with gold trim

These cards should appear elevated above the host page, visually signaling a bridge into the other experience mode.

---

# 3. Design Tokens

```css
:root {
  /* Core brand */
  --ss-charcoal-950: #151515;
  --ss-charcoal-900: #1c1c1b;
  --ss-charcoal-850: #232321;
  --ss-charcoal-800: #2a2926;

  --ss-cream-050: #fffaf0;
  --ss-cream-100: #faf3e0;
  --ss-cream-150: #f3ead6;

  --ss-gold-500: #c9a86a;
  --ss-gold-400: #d8bb83;
  --ss-gold-600: #a98a51;

  --ss-silver-200: #e0e0e0;
  --ss-white: #ffffff;

  /* Semantic colors */
  --ss-bg-commerce: var(--ss-charcoal-950);
  --ss-bg-learning: var(--ss-cream-100);
  --ss-text-on-dark: #f7f1e5;
  --ss-text-muted-dark: #c9c3b8;
  --ss-text-on-light: #25231f;
  --ss-text-muted-light: #615c53;
  --ss-border-dark: rgba(201, 168, 106, 0.38);
  --ss-border-light: rgba(37, 35, 31, 0.16);

  /* Typography */
  --ss-font-display: "Cormorant Upright", "Playfair Display", Georgia, serif;
  --ss-font-heading: "Playfair Display", Georgia, serif;
  --ss-font-body: "Lato", Arial, sans-serif;

  /* Type scale */
  --ss-text-xs: clamp(0.75rem, 0.72rem + 0.12vw, 0.82rem);
  --ss-text-sm: clamp(0.875rem, 0.84rem + 0.14vw, 0.96rem);
  --ss-text-base: clamp(1rem, 0.96rem + 0.18vw, 1.08rem);
  --ss-text-lg: clamp(1.15rem, 1.05rem + 0.35vw, 1.34rem);
  --ss-text-xl: clamp(1.42rem, 1.24rem + 0.72vw, 1.9rem);
  --ss-text-2xl: clamp(1.9rem, 1.55rem + 1.35vw, 2.8rem);
  --ss-text-3xl: clamp(2.5rem, 1.9rem + 2.5vw, 4.6rem);
  --ss-text-hero: clamp(3rem, 2rem + 4.2vw, 6.5rem);

  /* Layout */
  --ss-container: 1440px;
  --ss-reading-width: 760px;
  --ss-gutter: clamp(1rem, 3vw, 3rem);
  --ss-section-space: clamp(4.5rem, 8vw, 8.5rem);
  --ss-card-radius: 1.25rem;
  --ss-small-radius: 0.65rem;

  /* Effects */
  --ss-shadow-soft: 0 18px 60px rgba(0, 0, 0, 0.22);
  --ss-shadow-raised: 0 28px 80px rgba(0, 0, 0, 0.34);
  --ss-gold-glow: 0 0 0 1px rgba(201, 168, 106, 0.34),
                  0 16px 55px rgba(0, 0, 0, 0.26);

  /* Motion */
  --ss-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ss-speed-fast: 160ms;
  --ss-speed-base: 280ms;
  --ss-speed-slow: 600ms;
}
```

---

# 4. Global Styling Rules

## 4.1 Typography

- Display headlines use **Cormorant Upright**.
- Functional headings use **Playfair Display**.
- Body, navigation, labels, prices, filters, and controls use **Lato**.
- Headline copy should be short, atmospheric, and confident.
- Body copy should remain plain, direct, and readable.
- Avoid large blocks of centered text.
- Maximum paragraph width: `65ch`.
- Gold text is for labels, separators, small emphasis, or decorative detail—not full paragraphs.

## 4.2 Gold usage

Gold is a precision accent, not a background color.

Use gold for:

- Thin outlines
- Small eyebrow labels
- Active navigation indicators
- Icon details
- Focus states
- Fine dividers
- Select CTA emphasis
- Cross-mode card trim

Do not use gold for:

- Large solid page sections
- Long body text
- Every heading
- Multiple competing buttons in one viewport

## 4.3 Image treatment

- Primary imagery must be realistic, calm, tactile, and aspirational.
- Favor wood grain, steam, warm lighting, stone, water, linen, greenery, and architectural space.
- Avoid exaggerated orange color grading.
- Avoid generic spa stock imagery featuring stacked stones as the primary visual.
- Avoid people in primary hero imagery unless a future campaign intentionally calls for them.
- Use image overlays to protect text contrast without flattening the image.
- Below-the-fold images should use responsive sizing and lazy loading.
- The hero image must not be lazy loaded.

## 4.4 Interaction style

- Motion should feel slow, grounded, and deliberate.
- No bouncing elements.
- No spinning prize wheels.
- No aggressive countdown timers.
- No automatic audio.
- No forced full-screen pop-up on initial page load.
- All hover interactions must have an equivalent keyboard focus state.
- Respect `prefers-reduced-motion`.

---

# 5. Homepage Information Architecture

```text
1. Utility announcement
2. Primary header and search
3. Cinematic hero
4. Guided product pathways
5. “How can we help you feel better?” discovery bridge
6. Featured sauna experience
7. Shop by wellness goal
8. Education crossover feature
9. Product ecosystem / complete the ritual
10. Trust and service reassurance
11. Journal and evidence-led learning
12. Email / Wellness Wallet capture
13. Footer
```

The page should alternate between emotional immersion and useful decisions. Do not place more than two visually dense commerce sections back-to-back.

---

# 6. Exact Homepage Sections

## Section 01 — Utility Announcement

**Height:** 34–40px  
**Background:** `--ss-cream-100`  
**Text:** `--ss-charcoal-950`  
**Typography:** Lato, 12–13px, medium weight, letter spacing `0.04em`

### Content rotation
Use no more than three messages:

- “Questions before you choose? Call (504) 285-9552.”
- “Explore saunas, cold therapy, outdoor wellness, and recovery.”
- “Wellness guidance without the pressure.”

Desktop may rotate gently. Mobile should show one message at a time. The bar must not cause layout shift.

---

## Section 02 — Primary Header

**Behavior:** Transparent over hero at page top; transitions to solid charcoal after scroll.  
**Desktop height:** 84px  
**Mobile height:** 68px  
**Border:** 1px bottom border only after solid state  
**Logo:** Gold transparent banner logo  
**Maximum logo width:** 245px desktop / 185px mobile

### Primary navigation

1. Saunas
2. Cold & Water
3. Wellness
4. Accessories
5. Learn
6. Find Your Fit

### Utility controls

- Search
- Account
- Cart
- Support

### Mega-menu behavior

Mega menus must be structured by guest intent rather than only by inventory type.

Example for **Saunas**:

- Shop by Type
  - Infrared
  - Traditional
  - Steam
  - Outdoor
  - Specialty
- Shop by Space
  - One Person
  - Two Person
  - Family
  - Indoor
  - Outdoor
- Start Here
  - Compare Sauna Types
  - Sauna Buying Guide
  - Find Your Fit Quiz

Search should be prominent and capable of handling product types, benefits, room sizes, and common-language queries.

---

## Section 03 — Cinematic Hero

**Theme:** Commerce / charcoal  
**Height:** `min(88svh, 920px)` desktop; `76svh–82svh` mobile  
**Minimum height:** 620px desktop / 560px mobile  
**Image:** Wide high-end sauna interior with expansive landscape view  
**Image position:** Center-right  
**Content alignment:** Lower-left, never vertically centered  
**Overlay:**

```css
background:
  linear-gradient(90deg,
    rgba(21,21,21,.88) 0%,
    rgba(21,21,21,.58) 42%,
    rgba(21,21,21,.12) 72%,
    rgba(21,21,21,.06) 100%),
  linear-gradient(0deg,
    rgba(21,21,21,.62) 0%,
    rgba(21,21,21,0) 48%);
```

### Hero copy

**Eyebrow:**  
`CREATE YOUR PLACE TO RESET`

**Headline:**  
`Come home to yourself.`

**Supporting copy:**  
`Saunas, recovery tools, and restorative rituals chosen to help you build a space that feels better to live in.`

### CTAs

**Primary:** `Explore Saunas`  
**Secondary:** `Find Your Fit`

Primary button:
- Cream fill
- Charcoal text
- Thin gold border on hover

Secondary button:
- Transparent
- Cream text
- Gold border

### Additional hero element

At the lower-right edge, include a restrained “Begin your reset” scroll cue with a vertical gold line. Hide it on narrow mobile screens.

### Hero implementation restrictions

- No carousel.
- No video by default.
- No entrance animation on the LCP image.
- Text may fade upward after first paint, but only if it does not delay content visibility.
- Hero content must remain readable at 200% zoom.

---

## Section 04 — Guided Product Pathways

**Theme:** Charcoal  
**Layout:** Four large editorial category cards  
**Desktop:** 12-column grid, each card spans 3 columns  
**Tablet:** 2 × 2  
**Mobile:** Horizontal snap row showing 85% of next card

### Cards

1. **Infrared Saunas**
   - “Deep warmth. Everyday recovery.”
2. **Traditional Saunas**
   - “Timeless heat. A ritual of your own.”
3. **Cold Plunges**
   - “Reset through contrast.”
4. **Outdoor Wellness**
   - “Turn open air into private restoration.”

### Card visual treatment

- Aspect ratio: 4:5 desktop; 3:4 mobile
- Full-bleed image
- Bottom gradient
- Gold eyebrow
- Cream title
- One-line descriptor
- Arrow link
- 1px gold border appears on hover
- Image scale maximum: `1.035`
- No floating prices in this section

### Section heading

`Choose where your reset begins.`

### Purpose

This is the primary curated product-finding path. It must immediately demonstrate catalog breadth without showing a cluttered grid.

---

## Section 05 — Discovery Bridge

**Theme:** Cream  
**Transition:** Broad curved or angled cream field rising into the charcoal section. Avoid a simple horizontal cut.

### Left column

**Eyebrow:** `NOT SURE WHERE TO START?`

**Heading:**  
`How can we help you feel better?`

**Body:**  
`Tell us what you want more of—rest, recovery, warmth, energy, privacy, or a better daily ritual—and we’ll help narrow the options.`

### Right column

A three-question preview card for the future **“Don’t Sweat It”** quiz.

Questions previewed as selectable chips:

- What are you hoping to improve?
- Where will your setup live?
- What kind of experience feels right?

CTA: `Take the 3-question quiz`

Secondary text link: `Compare sauna types instead`

### Visual treatment

- Cream background
- Charcoal text
- Dark charcoal quiz card
- Thin gold trim
- Cream selection chips
- Strong focus states
- No actual email gate before the quiz begins

---

## Section 06 — Featured Sauna Experience

**Theme:** Charcoal  
**Layout:** 55/45 split  
**Desktop image:** Left  
**Copy:** Right  
**Mobile:** Image first, copy second

### Content model

This is not “featured product of the week.” It is an editorial product spotlight selected through CMS configuration.

Required fields:

- Product reference
- Experience label
- Curated headline
- 2–3 sentence narrative
- Three key attributes
- Starting price
- Primary CTA
- Optional secondary guide link

### Example copy

**Eyebrow:** `FEATURED EXPERIENCE`

**Headline:**  
`A quieter kind of luxury.`

**Body:**  
`Built for homes where restoration deserves its own room. Natural materials, enveloping heat, and enough space to make slowing down feel intentional.`

**Attributes:**
- Designed for 2–3 guests
- Indoor installation
- Choice of heating system

**CTA:** `View the sauna`  
**Secondary:** `See what to know before buying`

### Product image treatment

- Architectural crop
- Small floating product-detail card, not a full product tile
- Cream card with gold trim may show price and one key feature
- No fake scarcity

---

## Section 07 — Shop by Wellness Goal

**Theme:** Charcoal with subtle tonal change (`--ss-charcoal-900`)  
**Heading:** `What would you like more of?`

### Goal cards

- Better Sleep
- Muscle Recovery
- Stress Relief
- Warmth & Comfort
- Skin & Self-Care
- Outdoor Reset

Each card links to a curated content-plus-product destination, not directly to a single product.

### Visual language

- Small atmospheric imagery or abstract tactile crops
- Minimal line icon
- Brief outcome-oriented label
- One supporting sentence
- Gold top rule
- Cream text

### Compliance requirement

Avoid claiming that products diagnose, cure, or treat medical conditions. Wellness language should distinguish experience, comfort, routine, and evidence-supported possibilities from guaranteed medical outcomes.

---

## Section 08 — Education Crossover Feature

**Theme:** Charcoal host section  
**Component:** Cream elevated “Did You Know?” card with gold trim

### Layout

- Full-width atmospheric background image
- Cream card overlaps the lower portion of the image
- Card width: 520–680px
- Card offset alternates left/right by campaign

### Example content

**Label:** `DID YOU KNOW?`

**Heading:**  
`Not all sauna heat feels the same.`

**Body:**  
`Traditional, infrared, and steam systems warm the body and the room differently. The best choice depends on the experience you want, the space you have, and how you plan to use it.`

**CTA:** `Compare sauna types`

### Component name

`<LearningBridgeCard />`

This component must be reusable on product and collection pages.

---

## Section 09 — Complete the Ritual

**Theme:** Charcoal  
**Purpose:** Cross-sell without making the homepage feel like a discount marketplace.

### Layout

One primary lifestyle image plus a curated row of four accessory cards:

- Sauna stones and buckets
- Essential oils and diffusers
- Robes, towels, and slippers
- Recovery and infrared devices

### Heading

`The room matters. So does the ritual.`

### Product card rules

- No sale badge unless the product is truly discounted
- No aggressive red
- Product image on warm neutral background
- Product title limited to two lines
- Price visible
- Reviews shown only when real data exists
- Quick add allowed only for simple products with no meaningful configuration
- Configurable products route to the product page

### Bundle-ready behavior

Reserve a CMS field for:

- Companion products
- Bundle label
- Bundle discount messaging
- Shopify product/variant references

Do not hard-code bundle prices into the component.

---

## Section 10 — Trust and Service Reassurance

**Theme:** Cream  
**Heading:** `A major purchase should never feel like a blind one.`

### Four trust columns

1. **Real guidance**
   - “Talk through space, heat type, installation, and use before choosing.”
2. **Clear product information**
   - “Specifications and requirements presented in plain language.”
3. **Support after purchase**
   - “A direct customer-service line when you need help.”
4. **Secure Shopify checkout**
   - “Commerce, payment, tax, and order processing remain within Shopify.”

### Contact strip

`Questions? Call (504) 285-9552 or email support@soothingsaunas.com.`

The phone number must be a `tel:` link. Email must be a `mailto:` link.

---

## Section 11 — Journal and Learning

**Theme:** Cream  
**Heading:** `Learn before you decide.`  
**Supporting text:** `Practical guidance, product comparisons, and evidence-aware wellness education.`

### Editorial cards

Show three cards:

1. Buying guide
2. Wellness education
3. Product care / ownership guide

### Card hierarchy

- One large lead story
- Two smaller supporting stories
- Category label
- Reading time
- Clear title
- Short summary
- No generic “Read More”; use descriptive links

### Cross-marketing card

Within this cream section, include one charcoal product feature card with gold trim.

Example:

**Label:** `MENTIONED IN THIS GUIDE`  
**Product image**  
**Product title**  
**Price**  
**CTA:** `View product`

Component name: `<CommerceBridgeCard />`

---

## Section 12 — Wellness Wallet Capture

**Theme:** Charcoal  
**Treatment:** Quiet final invitation, not a modal

### Copy

**Eyebrow:** `WELLNESS WALLET`

**Heading:**  
`A little more room to build your reset.`

**Body:**  
`Get thoughtful product guidance, new educational resources, and opportunities to earn Wellness Wallet credit.`

### Form

- Email
- Optional phone number revealed after email entry
- Consent text
- Submit button: `Join the list`

### Incentive language

Do not promise a fixed reward unless an active promotion has been configured. The future quiz may award $50, $75, or $100 Wellness Wallet credit under separately governed promotional rules.

---

## Section 13 — Footer

**Theme:** Deep charcoal  
**Top border:** 1px gold at 30% opacity  
**Logo:** Gold  
**Columns:**

1. Shop
2. Learn
3. Support
4. Company

### Required utility links

- Contact
- Shipping
- Returns
- Warranty
- Privacy
- Terms
- Accessibility
- Sitemap

### Required contact

- (504) 285-9552
- support@soothingsaunas.com
- Social links from the active site configuration

### Footer closing line

`Restoration is personal. Your space should be too.`

---

# 7. Reusable Component Inventory

Claude should build the homepage from reusable sections and primitives rather than one monolithic page file.

```text
app/components/
  layout/
    SiteHeader
    MegaMenu
    SearchTrigger
    CartTrigger
    SiteFooter
    SectionShell

  typography/
    Eyebrow
    DisplayHeading
    SectionHeading
    RichText

  commerce/
    EditorialCategoryCard
    FeaturedProductExperience
    ProductCard
    ProductRail
    PriceDisplay
    QuickAdd
    CommerceBridgeCard

  editorial/
    LearningBridgeCard
    ArticleCard
    ArticleFeature
    DidYouKnowCard

  discovery/
    QuizPreview
    WellnessGoalCard
    ComparisonLink
    SearchPanel

  trust/
    TrustGrid
    ContactStrip
    ServicePromise

  forms/
    NewsletterForm
    ConsentText

  motion/
    Reveal
    ParallaxMedia
```

## Component architecture rule

Every homepage section should accept data through props or CMS-derived configuration. Text, product handles, collection handles, imagery, and links must not be permanently embedded in layout components.

---

# 8. Suggested Route Component

```tsx
export default function HomePage() {
  return (
    <main id="main-content" className="homepage homepage--commerce">
      <CinematicHero />
      <GuidedProductPathways />
      <DiscoveryBridge />
      <FeaturedProductExperience />
      <WellnessGoalGrid />
      <LearningBridgeFeature />
      <CompleteTheRitual />
      <TrustAndService />
      <JournalFeature />
      <WellnessWalletCapture />
    </main>
  );
}
```

The actual imports and data-loading method must match the repository’s approved framework and Shopify architecture.

---

# 9. Section Shell Pattern

```tsx
type SectionTone = "charcoal" | "cream" | "tonal-dark";

interface SectionShellProps {
  id?: string;
  tone?: SectionTone;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export function SectionShell({
  id,
  tone = "charcoal",
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={["section-shell", className].filter(Boolean).join(" ")}
    >
      <div className="section-shell__inner">
        {(eyebrow || title || description) && (
          <header className="section-shell__header">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
```

```css
.section-shell {
  position: relative;
  padding-block: var(--ss-section-space);
  overflow: clip;
}

.section-shell__inner {
  width: min(calc(100% - (2 * var(--ss-gutter))), var(--ss-container));
  margin-inline: auto;
}

.section-shell[data-tone="charcoal"] {
  background: var(--ss-bg-commerce);
  color: var(--ss-text-on-dark);
}

.section-shell[data-tone="tonal-dark"] {
  background: var(--ss-charcoal-900);
  color: var(--ss-text-on-dark);
}

.section-shell[data-tone="cream"] {
  background: var(--ss-bg-learning);
  color: var(--ss-text-on-light);
}
```

---

# 10. Button System

```css
.ss-button {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .6rem;
  padding: .85rem 1.3rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: var(--ss-font-body);
  font-size: var(--ss-text-sm);
  font-weight: 700;
  letter-spacing: .025em;
  text-decoration: none;
  transition:
    transform var(--ss-speed-fast) var(--ss-ease),
    background-color var(--ss-speed-base) var(--ss-ease),
    color var(--ss-speed-base) var(--ss-ease),
    border-color var(--ss-speed-base) var(--ss-ease);
}

.ss-button:hover {
  transform: translateY(-2px);
}

.ss-button:focus-visible {
  outline: 3px solid var(--ss-gold-400);
  outline-offset: 4px;
}

.ss-button--primary-dark {
  background: var(--ss-cream-100);
  color: var(--ss-charcoal-950);
}

.ss-button--outline-dark {
  background: transparent;
  color: var(--ss-text-on-dark);
  border-color: var(--ss-gold-500);
}

.ss-button--primary-light {
  background: var(--ss-charcoal-950);
  color: var(--ss-cream-100);
}
```

Only one button per section should have dominant visual weight.

---

# 11. Cross-Mode Card Specification

## Learning card on commerce pages

```css
.learning-bridge-card {
  background: var(--ss-cream-100);
  color: var(--ss-text-on-light);
  border: 1px solid var(--ss-gold-500);
  border-radius: var(--ss-card-radius);
  box-shadow: var(--ss-shadow-raised);
  padding: clamp(1.5rem, 4vw, 3rem);
}
```

## Product card on learning pages

```css
.commerce-bridge-card {
  background: var(--ss-charcoal-950);
  color: var(--ss-text-on-dark);
  border: 1px solid var(--ss-gold-500);
  border-radius: var(--ss-card-radius);
  box-shadow: var(--ss-shadow-raised);
  padding: clamp(1.25rem, 3vw, 2.25rem);
}
```

## Shared rules

- Card must visibly overlap or float above its host section.
- Card must preserve the destination mode’s design language.
- Card must contain one clear action.
- Card must not resemble an advertisement from a third party.
- On mobile, reduce overlap to prevent clipping and horizontal scrolling.

---

# 12. Responsive Rules

## Desktop: 1200px and above

- Maximum content width: 1440px
- Hero copy width: 620px
- 12-column grid
- Full mega menu
- Four category cards in one row
- Alternating split layouts
- Cross-mode cards may overlap by 48–88px

## Tablet: 768px–1199px

- 8-column grid
- Category cards use 2 × 2 layout
- Header switches to simplified navigation
- Hero content width: 70%
- Product rails may scroll horizontally
- Section overlaps reduced to 32–48px

## Mobile: below 768px

- 4-column grid
- Single-column reading order
- Horizontal snap rails for product and category discovery
- Minimum tap target: 44 × 44px
- Hero title maximum 3–4 lines
- Avoid text over highly detailed image regions
- No hover-dependent information
- Sticky header only after the guest begins scrolling upward
- Cross-mode cards remain within viewport gutter
- Do not use fixed-height text cards

---

# 13. Accessibility Requirements

- One `h1` only.
- Logical heading order.
- Visible skip link.
- Keyboard-operable navigation, mega menus, search, carousels, and forms.
- Focus states use gold plus sufficient contrast.
- Decorative images use empty alt text.
- Product and editorial images use descriptive alt text.
- Text embedded in imagery is prohibited.
- Minimum body size: 16px.
- Do not rely on color alone for state or meaning.
- All controls must maintain accessible names.
- Reduced-motion mode disables parallax, smooth reveal movement, and decorative transforms.
- Horizontal rails require visible controls and must remain operable without dragging.
- Form errors must be announced programmatically and explained in text.

---

# 14. Performance Requirements

- Hero image must be responsive, preloaded, and marked high priority.
- Do not lazy load the hero image.
- Do not animate the hero image during initial rendering.
- Below-the-fold images should use lazy loading.
- Reserve image dimensions to prevent layout shift.
- Use modern image formats with width-based `srcset`.
- Load only the font weights actually used.
- Prefer server-rendered content.
- Hydrate only components that require interaction.
- Product rails should not download every product image before entering the viewport.
- Third-party scripts must not block the main thread during initial rendering.
- Target:
  - LCP ≤ 2.5s at the 75th percentile
  - INP ≤ 200ms at the 75th percentile
  - CLS ≤ 0.1 at the 75th percentile

---

# 15. Shopify Data Boundaries

The storefront controls presentation and guest interaction. Shopify remains the system of record for:

- Products
- Variants
- Prices
- Availability
- Discounts
- Cart
- Checkout
- Orders
- Taxes
- Shipping
- Payments

Homepage sections may reference Shopify products and collections, but must not duplicate authoritative price or availability data in static content.

### Recommended homepage configuration object

```ts
interface HomepageConfig {
  hero: {
    image: ResponsiveImage;
    eyebrow: string;
    heading: string;
    body: string;
    primaryCta: LinkConfig;
    secondaryCta: LinkConfig;
  };
  categoryPaths: CategoryPath[];
  quizPreview: QuizPreviewConfig;
  featuredExperience: ProductEditorialReference;
  wellnessGoals: WellnessGoal[];
  learningBridge: LearningBridgeConfig;
  ritualCollection: ProductReference[];
  trustItems: TrustItem[];
  journalFeature: ArticleReference[];
  commerceBridge?: ProductReference;
  newsletter: NewsletterConfig;
}
```

Use Shopify metaobjects, the selected CMS, or repository-managed configuration according to the approved content architecture. Do not create a second commerce database.

---

# 16. Analytics Events

Track meaningful decisions, not every decorative interaction.

```text
homepage_hero_primary_click
homepage_hero_secondary_click
homepage_category_path_click
homepage_search_open
homepage_quiz_start
homepage_featured_product_click
homepage_wellness_goal_click
homepage_learning_bridge_click
homepage_product_card_click
homepage_quick_add
homepage_support_click
homepage_article_click
homepage_email_signup
```

Each event should include:

- Component ID
- Destination
- Position
- Product or collection ID when applicable
- Device class
- Experiment ID when applicable

Do not expose sensitive form values in analytics.

---

# 17. Content Voice

The homepage voice should be:

- Inviting, not sentimental
- Premium, not elitist
- Calm, not sleepy
- Informed, not clinical
- Helpful, not pushy
- Aspirational, not unrealistic

### Preferred language

- Reset
- Restore
- Warmth
- Ritual
- Space
- Recovery
- Feel better
- Find your fit
- Build your retreat
- Learn before you decide

### Avoid

- “Transform your life overnight”
- “Detox all toxins”
- “Cure”
- “Guaranteed healing”
- “Limited time” unless true
- “Buy now before it’s gone” unless inventory data supports it
- Overuse of “luxury”
- Generic filler such as “Welcome to our store”

---

# 18. Claude Implementation Directive

Paste the following instruction above this blueprint:

> Build the Soothing Saunas homepage from this blueprint using the repository’s approved framework, component architecture, Shopify data layer, and SSES requirements. Treat this document as the page-level implementation specification. Reuse existing approved primitives where available. Do not replace the defined information architecture, color-mode distinction, typography hierarchy, copy hierarchy, cross-mode card system, responsive behavior, accessibility requirements, or Shopify ownership boundaries with generic theme conventions. Before writing code, inspect the existing repository and return: (1) the files to create, (2) the files to modify, (3) existing components that will be reused, and (4) any conflicts with approved SSES requirements. Do not silently resolve conflicts.

---

# 19. Homepage Acceptance Criteria

The homepage is complete only when:

- The first viewport creates an immersive sauna-centered experience.
- A guest can immediately identify category, search, and guided-discovery paths.
- The charcoal and cream modes communicate commerce versus learning.
- Cross-mode bridge cards work in both directions.
- Navigation exposes the major catalog breadth without overwhelming the header.
- The page includes aspiration, discovery, education, trust, service, and conversion.
- The layout does not resemble an unmodified Shopify theme.
- Product prices and availability remain sourced from Shopify.
- Mobile layout is not merely a compressed desktop layout.
- Keyboard navigation and focus states are complete.
- The hero remains fast and stable.
- All configurable content can be changed without rewriting structural components.
- No medical claim or false scarcity is introduced.
- Analytics cover the major guest decisions.
- The finished page feels cohesive, premium, calm, and unmistakably Soothing Saunas.
