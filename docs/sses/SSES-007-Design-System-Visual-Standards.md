# SSES-007 - Design System & Visual Standards

**Soothing Saunas Engineering Specification**

| Property | Value |
|---|---|
| **Document ID** | SSES-007 |
| **Title** | Design System & Visual Standards |
| **Version** | 0.2 |
| **Status** | Approved |
| **Authority Level** | Engineering Standard |
| **Revision Date** | July 27, 2026 |

# 1. Purpose

This specification establishes the authoritative design system and visual standards for Soothing Saunas. It translates the approved brand identity into reusable rules for color, typography, spacing, iconography, imagery, responsive behavior, and interface consistency so that every guest-facing surface feels intentional, calm, credible, and recognizably part of the same brand.

# 2. Scope

This specification applies to the headless Shopify storefront and all digital interfaces produced under the Soothing Saunas brand, including:

- Global navigation, headers, footers, search, and utility interfaces
- Home, collection, product, educational, journal, policy, account, cart, and support pages
- Reusable components, forms, cards, banners, modals, drawers, and interactive states
- Marketing graphics, branded content modules, email-adjacent web assets, and social-linked landing pages
- Desktop, tablet, and mobile responsive behavior
- Future interface additions that extend the approved design system

This document governs presentation and visual consistency. Component composition belongs to SSES-008, content writing belongs to SSES-009, and accessibility requirements belong to SSES-011.

# 3. Design System Principles

| Principle | Requirement |
|---|---|
| **Calm Confidence** | The interface shall communicate warmth, wellness, and authority without feeling clinical, crowded, or overly decorative. |
| **Guest-First Clarity** | Visual hierarchy shall help guests understand where they are, what is offered, and what action to take next. |
| **Education Before Pressure** | Design shall support informed decisions and shall not rely on aggressive urgency, visual manipulation, or distracting sales tactics. |
| **Premium Restraint** | Gold and ornamental styling shall be used as deliberate accents rather than dominant decoration. |
| **System Consistency** | The same visual tokens and interaction patterns shall be reused across pages and components. |
| **Responsive Integrity** | The design shall preserve hierarchy, usability, and brand character across supported screen sizes. |

# 4. Brand Color System

The approved Soothing Saunas brand color system is:

| Token | Hex | Primary Use |
|---|---|---|
| **Charcoal** | `#151515` | Primary dark background, dark navigation, premium contrast surfaces, and high-emphasis text on light backgrounds. |
| **Cream** | `#FAF3E0` | Primary light background, warm content surfaces, and softened contrast against charcoal. |
| **Gold** | `#C9A86A` | Brand accent, selected states, restrained rules, highlights, and premium emphasis. |
| **Silver** | `#E0E0E0` | Subtle borders, dividers, disabled surfaces, and neutral supporting detail. |
| **White** | `#FFFFFF` | High-contrast text on dark surfaces and clean utility surfaces where cream is unsuitable. |

Interface implementations MUST use named design tokens rather than repeated hard-coded color values.

## 4.1 Color Usage Rules

- Charcoal and cream SHOULD form the dominant visual foundation of the storefront.
- Gold MUST remain an accent color and MUST NOT be used as the primary body-text color.
- White MAY replace cream where maximum legibility or platform consistency requires it.
- Silver SHOULD be used for low-emphasis structural detail rather than primary calls to action.
- Color combinations MUST satisfy the contrast requirements established by SSES-011.
- New colors MUST NOT be introduced into the permanent palette without owner approval and an SSES revision.

## 4.2 Contextual Tone: Dark-Dominant vs. Light-Dominant

The approved palette supports two deliberate tonal modes, both built from the same tokens. Which mode leads is determined by the guest's task on that surface, not by a fixed page-type list.

| Mode | Composition | Use When |
|---|---|---|
| **Dark-dominant** | Charcoal background, cream text, gold accents. | The guest is browsing, comparing, or picturing themselves using a product — homepage, collection pages, product pages. The goal is an immersive, calm, relaxing feeling, consistent with imagining oneself relaxing in the product itself. |
| **Light-dominant** | Cream background, charcoal text, gold accents. | The guest is reading or learning — journal/blog content, buying guides, FAQs, policy pages. The goal is sustained readability without losing brand identity. |

- The homepage SHOULD be dark-dominant throughout, including sections that might otherwise default to a light surface (for example, category browsing), because the entire homepage is a browsing/first-impression experience rather than a reading one. See SSES-003 for the guest-experience rationale.
- Checkout is Shopify-hosted (SSES-006); its branding SHOULD be configured in Shopify's Checkout branding settings to approximate this palette, but is not directly styled by storefront code.
- Mode selection is a per-surface design decision, not a global theme toggle. A single page MAY transition between modes across sections if the task genuinely changes (for example, a product page's reading-heavy specification table MAY use a light-dominant panel within an otherwise dark-dominant page), but transitions SHOULD be deliberate and infrequent rather than alternating section-by-section without reason.

# 5. Typography

The approved storefront typography pair is Cormorant Upright for expressive brand headings and Lato for functional interface and body text. Approved fallbacks shall preserve the same serif-versus-sans-serif roles.

| Role | Primary Typeface | Usage |
|---|---|---|
| **Display / Brand** | Cormorant Upright | Hero headlines, editorial titles, selected feature statements, and limited premium brand moments. |
| **Interface / Body** | Lato | Navigation, body copy, product information, labels, buttons, forms, tables, captions, and utility text. |
| **Fallback Serif** | Georgia or approved equivalent | Used only when Cormorant Upright is unavailable. |
| **Fallback Sans Serif** | Arial, Helvetica, or system sans-serif | Used only when Lato is unavailable or system rendering requires it. |

## 5.1 Type Hierarchy

| Level | Recommended Treatment | Requirements |
|---|---|---|
| **Display** | Cormorant Upright; large; controlled line length | Reserved for major brand or editorial moments. Must remain readable on mobile. |
| **H1** | Cormorant Upright or Lato, depending on page function | One primary H1 per page. Must identify the page purpose clearly. |
| **H2-H4** | Lato, semibold or bold | Used for stable information hierarchy and scannability. |
| **Body** | Lato, regular | Default reading text. Avoid overly narrow measure and low-contrast styling. |
| **UI / Label** | Lato, medium or semibold | Buttons, labels, tabs, filters, and form controls. |
| **Caption / Meta** | Lato, regular | Supporting information only; must remain legible and not be reduced below accessible minimums. |

- Headings MUST use a consistent scale and MUST NOT be selected solely for visual size.
- Body text SHOULD use comfortable line height and a readable line length of approximately 45-80 characters where practical.
- All-caps text SHOULD be limited to short labels and navigation accents.
- Decorative letter spacing MUST NOT reduce legibility.
- Fonts MUST be loaded efficiently and include only required families, weights, and styles.

# 6. Spacing and Layout System

Spacing shall be based on a consistent 4-pixel foundation so components align predictably while allowing an 8-pixel rhythm for most visible layout decisions.

| Token | Value | Typical Use |
|---|---|---|
| `space-1` | 4 px | Micro gaps, icon alignment, compact internal spacing. |
| `space-2` | 8 px | Small control gaps and compact component padding. |
| `space-3` | 12 px | Related text groups and small card spacing. |
| `space-4` | 16 px | Default control padding and common content gaps. |
| `space-6` | 24 px | Card padding and section sub-spacing. |
| `space-8` | 32 px | Major component separation. |
| `space-12` | 48 px | Section spacing on smaller screens. |
| `space-16` | 64 px | Primary section spacing on larger screens. |
| `space-24` | 96 px | Large editorial or hero separation where justified. |

## 6.1 Layout Rules

- Page content MUST align to a shared responsive container system.
- Horizontal padding MUST scale appropriately by viewport and MUST prevent content from touching screen edges.
- Section spacing SHOULD be consistent for equivalent page structures.
- Grid gaps, card padding, and control spacing MUST use approved spacing tokens.
- One-off spacing values SHOULD be avoided unless a documented component need cannot be represented by the token scale.
- Whitespace is a structural element and MUST NOT be removed merely to increase content density.

# 7. Shape, Borders, and Elevation

| Element | Standard |
|---|---|
| **Corner Radius** | Use a restrained, consistent radius scale. Interactive controls and cards shall not mix unrelated corner styles. |
| **Borders** | Use subtle silver, cream, or low-opacity neutral borders. Heavy outlines require a functional reason. |
| **Dividers** | Use thin, low-emphasis rules. Gold dividers are reserved for selected brand emphasis. |
| **Shadows** | Use soft, minimal elevation to communicate layering. Dramatic or glossy shadows are prohibited. |
| **Surface Layers** | Drawers, modals, menus, and sticky surfaces shall separate clearly from background content without appearing detached from the brand. |

# 8. Iconography and Visual Symbols

- Icons MUST use a consistent stroke weight, optical size, and visual family.
- Icons SHOULD be simple, recognizable, and understandable without decorative complexity.
- Functional icons MUST include an accessible label when meaning is not conveyed by adjacent text.
- Gold MAY be used for selected or premium icon emphasis but MUST NOT make every icon visually dominant.
- The heat-wave symbol MAY be used as a branded cursor or supporting motif only when it does not impair usability or platform conventions.
- Emoji MUST NOT be used as permanent interface icons in production UI.

# 9. Imagery and Media

Imagery shall reinforce warmth, restoration, credible wellness education, and the physical experience of the products. It shall not create misleading expectations or overwhelm product information.

| Category | Standard |
|---|---|
| **Product Imagery** | Clear, high-resolution, accurately representative, consistently cropped, and sufficient to understand scale, materials, controls, and installation context. |
| **Lifestyle Imagery** | Warm, calm, aspirational, and believable. Avoid exaggerated luxury staging that conflicts with the actual product or guest expectation. |
| **Educational Imagery** | Diagrams and supporting visuals shall clarify information and identify when an image is illustrative rather than product-specific. |
| **Background Media** | Video or animation shall be restrained, performant, and nonessential to understanding or navigation. |
| **Image Treatment** | Use consistent aspect ratios within a component family. Avoid arbitrary filters, heavy overlays, or inconsistent color grading. |

- Images MUST include meaningful alternative text when required by SSES-011.
- Images MUST be optimized and delivered responsively in accordance with SSES-012.
- Critical product details MUST NOT exist only inside an image.
- Autoplay media MUST NOT include sound and MUST respect reduced-motion preferences where applicable.

# 10. Components and Interface States

All reusable components shall visually express their purpose and state consistently. SSES-008 governs component architecture; this section governs visual treatment.

| State | Required Treatment |
|---|---|
| **Default** | Clear affordance and stable visual hierarchy. |
| **Hover** | Visible but restrained change for pointer-capable devices; not the only way information is conveyed. |
| **Focus** | Strong, visible keyboard focus indicator that is not removed for visual preference. |
| **Active / Selected** | Persistent visual distinction using more than color alone where practical. |
| **Disabled** | Reduced emphasis while preserving legibility; must not appear interactive. |
| **Loading** | Communicate progress without causing layout shift or trapping the guest. |
| **Success** | Confirm completion clearly and identify the next relevant action. |
| **Error** | Identify the affected field or action, explain the problem, and preserve entered data where practical. |
| **Empty** | Explain the state and provide a useful next action when one exists. |

# 11. Responsive Behavior

- The interface MUST be designed mobile-first and enhanced for larger viewports.
- Breakpoints MUST respond to content and component needs rather than device-brand assumptions.
- Navigation, filters, comparison tables, media galleries, and purchase controls MUST remain usable on narrow screens.
- Text MUST reflow without horizontal scrolling except for deliberately scrollable data structures.
- Touch targets MUST remain appropriately sized and separated.
- Content order MUST remain logical when grids collapse into a single column.
- Fixed and sticky elements MUST NOT obscure essential content or controls.
- Responsive changes MUST preserve the same information and task priority unless an approved exception is documented.

# 12. Motion and Interaction

- Motion SHOULD support orientation, feedback, and continuity rather than decoration alone.
- Animations MUST be brief, smooth, and interruptible.
- Parallax, continuous movement, and large entrance animations SHOULD be avoided.
- Interactive feedback MUST not depend solely on animation.
- Reduced-motion preferences MUST be respected.
- Animations MUST NOT delay access to core content, cart actions, checkout pathways, or support information.

# 13. Brand Consistency Rules

| Area | Requirement |
|---|---|
| **Logo** | Use approved logo assets without distortion, recoloring, cropping, added effects, or insufficient clear space. |
| **Tone of Presentation** | Visual presentation shall feel calm, restorative, informative, premium, and approachable. |
| **Promotions** | Promotional treatments shall remain consistent with the brand and shall not use casino-style wheels, flashing urgency, or deceptive countdown patterns. |
| **Calls to Action** | Primary and secondary actions shall have consistent hierarchy, wording placement, and visual treatment. |
| **Educational Content** | Health and wellness education shall be visually distinguished from product purchase controls without appearing disconnected from the commerce experience. |
| **Guest Language** | Interfaces should use the term “guest” where a human-centered label is appropriate and system terminology does not require another term. |

# 14. Design Tokens and Implementation

- Colors, spacing, typography, radii, borders, shadows, and responsive values MUST be represented as centrally managed design tokens.
- Components MUST consume tokens rather than duplicating raw values across stylesheets.
- Token names MUST describe semantic purpose where practical, such as `color-surface-primary`, rather than only visual appearance.
- Theme values MUST support consistent use across server-rendered and client-rendered interfaces.
- Changes to foundational tokens MUST be reviewed for system-wide impact before release.
- An implementation MAY introduce component-level tokens when the component cannot be expressed clearly with global tokens, but those tokens must remain documented and reusable.

# 15. Prohibited Visual Patterns

- Unapproved colors, fonts, icon families, or decorative styles presented as permanent brand elements.
- Inconsistent button shapes, card radii, shadows, or spacing for equivalent actions.
- Low-contrast text used for aesthetic effect.
- Excessive gold, gradients, glow effects, glass effects, or visual ornament that weakens clarity.
- Forced motion, flashing content, or animated elements that distract from reading or purchasing.
- Deceptive scarcity, false urgency, hidden costs, confusing opt-ins, or visually manipulative dark patterns.
- Layouts that prioritize desktop appearance while leaving mobile behavior unresolved.

# 16. Quality and Acceptance Criteria

A feature or page satisfies this specification only when all applicable criteria are met:

- Approved brand colors and typography are used through documented tokens.
- Visual hierarchy is clear and consistent with comparable pages and components.
- Spacing, alignment, radii, borders, and elevation follow the system.
- All interaction states are visibly defined and usable.
- Responsive layouts preserve content order, usability, and brand character.
- Imagery is accurate, optimized, consistently treated, and accessible.
- No unapproved visual patterns or one-off design systems have been introduced.
- The implementation has been reviewed at representative mobile, tablet, and desktop viewport widths.
- Related requirements in SSES-003, SSES-008, SSES-011, and SSES-012 are satisfied.

# 17. Engineering Directives

## MUST

- Use the approved palette, typography roles, spacing system, and centrally managed design tokens.
- Maintain consistent visual treatment for equivalent components and interface states.
- Preserve responsive usability and hierarchy across supported viewport sizes.
- Respect approved logo assets and brand presentation.
- Escalate requests that materially change the brand system rather than introducing silent exceptions.

## SHOULD

- Prefer restrained, calm, and readable presentation over novelty.
- Reuse established patterns before creating new visual variants.
- Document component-specific visual tokens when global tokens are insufficient.
- Review design changes in the context of the full guest journey, not only an isolated screen.

## MUST NOT

- Introduce permanent colors, fonts, icon families, or major layout conventions without approval.
- Use visual urgency, deception, or distraction to pressure a purchase.
- Remove focus indicators or reduce accessibility for aesthetic preference.
- Hard-code repeated brand values when a design token exists.
- Allow desktop and mobile implementations to drift into separate visual systems.

# 18. Owner Directive

The Soothing Saunas visual system exists to make every guest interaction feel calm, coherent, trustworthy, and intentionally designed. The design should help a guest understand the product, learn without pressure, and move forward with confidence. Visual novelty is not a substitute for clarity.

**Freeze the forest. Improve the trees.**