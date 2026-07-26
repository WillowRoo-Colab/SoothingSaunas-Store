# SSES-008 - Component Architecture
**Soothing Saunas Engineering Specification**

| Property | Value |
|---|---|
| **Document ID** | SSES-008 |
| **Title** | Component Architecture |
| **Version** | 0.1 |
| **Status** | Approved |
| **Authority Level** | Architecture |
| **Revision Date** | July 26, 2026 |

---

# 1. Purpose
This specification establishes the component architecture for the Soothing Saunas headless storefront. It defines how interface components are classified, named, composed, reused, documented, tested, and changed so the storefront remains consistent, accessible, scalable, and safe to modify.

The objective is to create a predictable component system in which engineers and AI implementation assistants can determine where a component belongs, what data it may own, how it may be extended, and when a new component is justified.

# 2. Scope
This specification applies to reusable user-interface components and storefront composition, including:
- Foundational interface primitives, controls, and layout utilities.
- Commerce components that present Shopify-derived data or initiate commerce actions.
- Content components used for educational, editorial, policy, and promotional experiences.
- Page sections, page templates, and route-level composition.
- Component naming, file placement, public interfaces, variants, slots, and documentation.
- Responsive, accessibility, performance, testing, and deprecation requirements.

This specification does not independently define brand appearance, guest-experience policy, Shopify system ownership, repository branching, or testing infrastructure. Those matters remain governed by the applicable SSES documents.

# 3. Related Authority
| Document | Relationship |
|---|---|
| **SSES-001 - Project Architecture** | Defines platform boundaries and the approved technology architecture within which components operate. |
| **SSES-003 - Guest Experience Standards** | Defines the experience outcomes and interaction expectations components must support. |
| **SSES-005 - AI Roles & Responsibilities** | Defines implementation authority, escalation, and documentation obligations for AI-assisted work. |
| **SSES-006 - Headless Shopify Commerce Architecture** | Defines Shopify ownership, commerce data boundaries, checkout control, and integration responsibilities. |
| **SSES-007 - Design System & Visual Standards** | Defines visual tokens, typography, color, spacing, imagery, and responsive visual behavior. |
| **SSES-011 - Accessibility & Compliance** | Defines accessibility requirements that every component must satisfy. |
| **SSES-014 - Testing & Quality Assurance** | Defines the broader testing and release-quality framework. |
| **SSES-015 - Repository Standards** | Defines repository layout and source-control conventions. |

Where a component-specific requirement conflicts with a higher-authority governance or architecture requirement, the higher-authority requirement governs. Unresolved conflicts MUST be escalated rather than resolved through silent implementation choices.

# 4. Architectural Principles
| Principle | Requirement |
|---|---|
| **Single Responsibility** | Each component MUST have one clear primary responsibility and a stable reason to change. |
| **Composition Over Duplication** | Complex experiences SHOULD be assembled from smaller governed components rather than copied markup. |
| **Explicit Interfaces** | Inputs, outputs, events, states, and content slots MUST be declared and understandable without reading internal implementation details. |
| **Local Predictability** | A component MUST behave consistently wherever it is used unless an approved variant explicitly changes behavior. |
| **Minimal Hidden State** | Reusable components MUST NOT depend on undocumented global state, route assumptions, or ambient side effects. |
| **Accessibility by Default** | Accessible structure and interaction MUST be built into the component rather than added only at page assembly. |
| **Data Boundary Discipline** | Components MUST consume only the data required for their responsibility and MUST NOT silently become alternate systems of record. |
| **Progressive Specialization** | General primitives may support variants; specialized components SHOULD be created when domain behavior becomes materially different. |

# 5. Component Hierarchy
| Layer | Responsibility | Examples |
|---|---|---|
| **Layer 1 - Tokens and Foundations** | Non-visual or low-level foundations consumed by components. | Design tokens, spacing scales, typography roles, breakpoints, motion rules. |
| **Layer 2 - Primitives** | Small reusable controls with minimal business meaning. | Button, link, icon, input, badge, divider, surface. |
| **Layer 3 - Composites** | Reusable combinations of primitives that solve a defined interface task. | Quantity selector, accordion item, media tile, price display, form field. |
| **Layer 4 - Domain Components** | Components that express Soothing Saunas or commerce-specific behavior. | Product card, sauna specification panel, wellness guide card, cart line item. |
| **Layer 5 - Sections** | Page-width compositional units that combine domain components and content. | Featured collection, education panel, comparison section, product gallery section. |
| **Layer 6 - Templates** | Route-level structures that define page regions and composition contracts. | Product template, collection template, article template, policy template. |

A higher layer MAY depend on lower layers. A lower layer MUST NOT import or depend on a higher layer. Circular dependencies between component layers are prohibited.

# 6. Component Classification Rules
| Classification | Use When | Must Not |
|---|---|---|
| **Primitive** | The behavior is generic, broadly reusable, and not tied to commerce or editorial meaning. | Fetch Shopify data, own page-level state, or encode product-specific business rules. |
| **Composite** | Multiple primitives consistently form a reusable interaction or presentation pattern. | Become a route template or absorb unrelated domain logic. |
| **Domain Component** | The component has stable commerce, wellness, educational, or Soothing Saunas-specific meaning. | Reimplement generic primitives internally without documented need. |
| **Section** | The unit represents a page region with layout, content, and composition responsibilities. | Own global navigation, checkout, or unrelated route behavior. |
| **Template** | The unit governs route-level regions and permitted section composition. | Contain product data as hard-coded content or bypass approved commerce interfaces. |

# 7. Naming Conventions
Component names MUST describe purpose rather than visual appearance, temporary campaign language, or implementation mechanics.

| Element | Convention | Example |
|---|---|---|
| **Component** | PascalCase noun or noun phrase. | ProductCard, WellnessGuideCard, QuantitySelector |
| **File** | Match the component name using the repository's approved filename convention. | ProductCard.tsx or product-card.tsx, as governed by SSES-015 |
| **Props / Inputs** | camelCase names describing meaning. | product, headingLevel, showVendor |
| **Boolean Inputs** | Use positive, readable prefixes such as is, has, show, allow, or enable. | isLoading, showPrice, allowQuantityEdit |
| **Events / Callbacks** | Use on + action or outcome. | onAddToCart, onQuantityChange, onDismiss |
| **Variants** | Use semantic names tied to purpose or hierarchy. | primary, secondary, compact, editorial |
| **Slots / Regions** | Use content-role names. | media, heading, actions, supportingContent |

Names such as `BlueButton`, `BigCard`, `NewHomepageBlock`, `FinalProductTile`, or `TestComponent` MUST NOT be used in approved production architecture.

# 8. Public Component Interface
Every reusable component MUST expose the smallest stable public interface required for its approved uses.

| Interface Element | Requirement |
|---|---|
| **Required Inputs** | Only inputs necessary for the component's core responsibility SHOULD be required. |
| **Optional Inputs** | Optional inputs MUST have documented defaults or clearly defined absence behavior. |
| **Variants** | Variants MUST represent meaningful, approved differences. They MUST NOT become arbitrary styling escape hatches. |
| **Events** | Events MUST describe user or system outcomes and MUST NOT expose internal implementation details. |
| **Content Slots** | Slots MUST define the kind of content permitted and any semantic or accessibility constraints. |
| **Data Shape** | Complex input objects SHOULD use approved domain types or data contracts rather than untyped maps. |
| **Pass-through Attributes** | Native attributes MAY be supported when safe, but MUST NOT bypass required semantics or accessibility behavior. |

A component MUST NOT accept unrestricted style objects, arbitrary class injection, or catch-all configuration solely to avoid making an architectural decision. Documented escape hatches require an approved use case and owner-aware review.

# 9. Composition and Slot Rules
- Components SHOULD provide explicit composition regions when content legitimately varies.
- A slot MUST have a defined semantic purpose; generic unnamed content injection SHOULD be avoided for complex components.
- Parent components MUST NOT reach into or depend on a child's internal DOM structure.
- Child components MUST NOT mutate parent-owned data.
- Composition MUST preserve logical heading order, focus order, and reading order.
- Sections SHOULD accept structured content and approved child components rather than raw page markup.
- Templates MUST define required regions, optional regions, and permitted section families.

# 10. State Ownership
| State Type | Owner |
|---|---|
| **Ephemeral interaction state** | The lowest component that fully owns the interaction, such as accordion expansion or temporary input visibility. |
| **Shared section state** | The nearest shared parent or an approved state boundary. |
| **Cart and checkout state** | The approved commerce state layer governed by SSES-006; presentation components consume and invoke it but do not replace it. |
| **Route and query state** | The route or approved navigation layer, not arbitrary leaf components. |
| **Server-derived commerce data** | The approved data-fetching boundary; components receive normalized data through explicit interfaces. |
| **Persistent guest preference** | An approved persistence service with documented consent, privacy, and synchronization behavior. |

State MUST be lifted only as high as necessary. Global state MUST NOT be introduced to avoid defining clear component ownership.

# 11. Data and Shopify Boundaries
- Presentation primitives MUST NOT call Shopify APIs directly.
- Commerce data access MUST occur through approved storefront data services or route-level data boundaries.
- Components MUST treat Shopify as the system of record for products, variants, pricing, inventory, discounts, checkout, orders, and other commerce data governed by SSES-006.
- Components MAY derive temporary presentation values, but MUST NOT persist alternate authoritative commerce records.
- Add-to-cart, cart update, and checkout actions MUST use approved commerce actions and error handling.
- Components MUST render loading, empty, unavailable, error, and success states where those states are possible.

# 12. Styling and Responsive Behavior
Components MUST consume approved design tokens and visual rules from SSES-007. Component architecture MUST separate semantic behavior from incidental styling.
- Hard-coded brand colors, arbitrary spacing values, and duplicate typography scales MUST NOT be introduced when an approved token exists.
- Responsive behavior SHOULD be intrinsic to the component's responsibility and documented at meaningful layout thresholds.
- A component MUST remain usable when content is longer, shorter, localized, missing where optional, or presented on narrow screens.
- Variants MUST NOT be used to create ungoverned one-off page designs.
- Visual changes that alter brand or system behavior require the governing design-system change, not a local component override.

# 13. Accessibility Requirements
- Use semantic HTML appropriate to the component's role.
- Interactive components MUST support keyboard operation, visible focus, and predictable focus management.
- Accessible names, descriptions, states, and relationships MUST be exposed when not conveyed by native semantics.
- Heading levels MUST be configurable or composition-safe where the component can appear in different document contexts.
- Error, loading, unavailable, and success states MUST be conveyed without relying on color alone.
- Decorative images and icons MUST be hidden from assistive technology; meaningful media MUST have approved alternative text behavior.
- Components MUST NOT create keyboard traps, inaccessible hover-only actions, or reading-order conflicts.

# 14. Rendering and Execution Boundaries
Components MUST be compatible with the storefront's approved rendering model. Server and client execution responsibilities MUST be explicit.

| Rule | Requirement |
|---|---|
| **Server-first** | Components SHOULD remain server-renderable when they do not require browser-only state or effects. |
| **Client boundary** | Browser-only behavior MUST be isolated to the smallest practical interactive boundary. |
| **Hydration** | Initial server and client output MUST remain deterministic to avoid hydration mismatch. |
| **Side effects** | Side effects MUST be explicit, scoped, and cleaned up when applicable. |
| **Browser APIs** | Access to window, document, storage, observers, and media APIs MUST be guarded and limited to approved client execution. |

This section does not mandate a specific framework API. Framework-specific rules belong in the approved project architecture or repository implementation standards.

# 15. Performance Standards
- Components MUST avoid unnecessary client-side JavaScript and repeated data fetching.
- Large or below-the-fold media SHOULD use approved responsive image and loading strategies.
- Expensive computation SHOULD be moved outside repeated render paths or memoized only when measured benefit exists.
- A component MUST NOT import an entire library when an approved smaller entry point or native capability satisfies the need.
- Sections and templates SHOULD support deferred loading where it improves guest experience without hiding critical content or causing layout instability.
- Component changes that materially affect bundle size, rendering, or Core Web Vitals MUST be evaluated under SSES-012.

# 16. Documentation Requirements
Every reusable domain component, section, and template MUST have implementation-adjacent documentation sufficient for an engineer or AI assistant to use it without inspecting unrelated pages.

| Documentation Item | Required Content |
|---|---|
| **Purpose** | The responsibility and intended use of the component. |
| **Layer / Classification** | Primitive, composite, domain component, section, or template. |
| **Public Interface** | Inputs, outputs, events, slots, defaults, and variants. |
| **States** | Loading, empty, error, unavailable, success, selected, disabled, or other applicable states. |
| **Accessibility** | Semantic role, keyboard behavior, focus behavior, and labeling requirements. |
| **Examples** | Approved representative uses and prohibited misuse when useful. |
| **Dependencies** | Lower-layer components, services, data contracts, and governing SSES references. |

Documentation MUST be updated in the same change that alters a public interface or approved behavior.

# 17. Testing Requirements
- Primitives and composites MUST be tested for core behavior and accessibility-sensitive interactions.
- Domain components MUST be tested against representative valid, missing, unavailable, and error data states.
- Sections and templates MUST be tested for composition, responsive behavior, heading structure, and critical commerce flows.
- Public interface changes MUST include regression coverage appropriate to their impact.
- Snapshot-only testing MUST NOT be treated as sufficient evidence for interactive or business-critical behavior.
- Visual regression testing SHOULD be used for stable, high-value components when supported by SSES-014.

# 18. Creation and Reuse Decision
Before creating a new component, the implementer MUST evaluate the following sequence:
1. Can an existing component satisfy the requirement without changing its responsibility?
2. Can an approved variant satisfy the requirement without creating unrelated conditionals?
3. Can the requirement be composed from existing lower-layer components?
4. Is the behavior repeated or expected to repeat in a stable way?
5. Would adding the behavior to an existing component make its public interface or responsibility unclear?
6. Does the proposed component belong to the correct hierarchy layer and folder?

A new component is justified when it has a clear responsibility, a stable interface, an appropriate hierarchy layer, and a documented need that cannot be cleanly satisfied through approved composition.

# 19. Change, Deprecation, and Removal
- Breaking public-interface changes MUST be documented and coordinated with all known consumers.
- Deprecated components MUST identify the replacement path and removal condition.
- A deprecated component MUST NOT gain new features except those required for safe migration or defect correction.
- Removal MUST occur only after approved consumers have migrated or an owner-approved exception is recorded.
- Renaming without behavioral change SHOULD preserve traceability through source control and migration notes.
- Material changes to hierarchy or ownership boundaries require revision of this specification or the applicable architecture document.

# 20. Quality and Acceptance Criteria
- Every component has a clear classification and responsibility.
- Dependency direction follows the approved hierarchy with no circular layer dependency.
- Public interfaces are typed or structurally defined, minimal, and documented.
- Component behavior does not depend on undocumented global state or page-specific DOM assumptions.
- Shopify and commerce ownership boundaries remain consistent with SSES-006.
- Responsive, accessibility, loading, empty, error, and unavailable states are addressed where applicable.
- Reusable components have appropriate automated test coverage.
- Human-readable and Claude Markdown sections remain substantively synchronized.

# 21. Engineering Directives
## MUST
- Classify every reusable component within the approved hierarchy.
- Use explicit, minimal public interfaces and clear state ownership.
- Preserve dependency direction from higher layers to lower layers.
- Use approved commerce services and respect Shopify system-of-record boundaries.
- Document and test reusable component behavior.
- Escalate architectural ambiguity rather than creating silent one-off conventions.

## SHOULD
- Prefer composition over duplication and uncontrolled conditional complexity.
- Keep browser-only execution within the smallest practical boundary.
- Use semantic variants and content roles rather than appearance-based names.
- Design components to tolerate realistic content length and responsive conditions.

## MUST NOT
- Create circular dependencies between component layers.
- Allow primitives to fetch commerce data or own domain business logic.
- Use arbitrary style escape hatches to bypass the approved design system.
- Duplicate an existing component solely for a page-specific visual variation.
- Silently change a component's public contract or responsibility.
- Treat component-local state as an alternate commerce system of record.

# 22. Owner Directive
The component library exists to make the storefront easier to understand, safer to change, and more consistent for every guest. Reuse must preserve clarity; it must not become an excuse for oversized components or hidden complexity.

**Freeze the forest. Improve the trees.**

Add a component only when its responsibility is clear, its place in the hierarchy is justified, and its interface can remain stable.