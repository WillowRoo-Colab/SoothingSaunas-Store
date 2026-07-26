# SSES-011 - Accessibility & Compliance
 
**Soothing Saunas Engineering Specification**
 
| Property | Value |
|---|---|
| **Document ID** | SSES-011 |
| **Title** | Accessibility & Compliance |
| **Version** | 0.1 |
| **Status** | Approved |
| **Authority Level** | Engineering Standard |
| **Revision Date** | July 26, 2026 |
 
# 1. Purpose
This standard defines accessibility and compliance requirements for the Soothing Saunas storefront, educational content, commerce interfaces, support pathways, and other guest-facing digital experiences. The experience shall be perceivable, operable, understandable, and robust across devices, input methods, browsers, and assistive technologies. Accessibility is an ongoing product-quality and engineering responsibility.
 
# 2. Scope
Applies to headless storefront pages, navigation, search, filters, collections, product pages, cart and checkout handoff, educational content, policies, forms, quizzes, promotions, support content, reusable components, third-party widgets, responsive behavior, new features, revisions, and remediation. Platform-controlled limitations MUST be configured as accessibly as reasonably available and documented when they cannot be corrected within project control.
 
# 3. Accessibility Baseline
- WCAG 2.2 Level AA is the project target for guest-facing experiences within Soothing Saunas control.
- Use semantic HTML first; add ARIA only when native semantics cannot express required behavior.
- Essential functions MUST work by keyboard and MUST NOT require pointer precision, hover, drag, or one input method.
- Core journeys MUST be usable with selected current mainstream screen-reader and browser combinations.
- This standard supports risk reduction and consistent practice; it is not legal advice or a guarantee of legal compliance.
 
# 4. Semantic Structure and HTML
## 4.1 Document Structure
- Unique descriptive page title.
- One primary level-one heading per page.
- Logical heading hierarchy; do not choose levels only for visual size.
- Use native landmark elements where applicable.
- Keep repeated navigation consistent.
- Identify primary language and meaningful language changes.
 
## 4.2 Controls and Names
- Use native controls whenever applicable.
- Links navigate; buttons perform actions.
- Every interactive control MUST expose an accessible name.
- Visible labels SHOULD be included in accessible names.
- Avoid ambiguous duplicate accessible names.
 
# 5. Keyboard and Focus Requirements
- Every essential action MUST be keyboard available.
- Focus order MUST follow logical reading and interaction order.
- Focus MUST remain clearly visible.
- Sticky and overlay content MUST NOT fully obscure focused elements.
- Modal and drawer focus MUST be managed predictably and returned logically.
- No keyboard traps except correct modal containment with an exit.
- Provide a functional skip-to-main-content mechanism.
- Avoid single-character shortcuts unless disable, remap, or focus-only activation is available.
 
# 6. ARIA and Assistive-Technology Support
- ARIA MUST match actual behavior and supplement, not replace, correct HTML.
- Expose applicable expanded, selected, pressed, checked, current, invalid, busy, and disabled states.
- Announce dynamic status and validation results appropriately.
- Hide decorative media; provide meaningful alternatives for informative media.
- Icon-only controls MUST have accessible names.
- Hidden content MUST not remain focusable or active to assistive technology.
- Avoid custom widgets when native elements are sufficient.
 
# 7. Visual Accessibility
## 7.1 Contrast and Color
- Normal text: minimum 4.5:1 contrast.
- Large text: minimum 3:1 contrast.
- Applicable interface components, focus indicators, and meaningful graphics: minimum 3:1 contrast.
- Color MUST NOT be the only means of communicating meaning.
- Brand colors MAY be adjusted to meet accessibility requirements.
 
## 7.2 Text, Zoom, and Reflow
- Support 200 percent text resize without loss of content or function.
- Reflow at narrow viewports and high zoom without two-dimensional scrolling except inherently two-dimensional content.
- Text-spacing overrides MUST not cause clipping or overlap.
- Essential text MUST NOT exist only inside images.
- Support portrait and landscape unless one orientation is essential.
 
# 8. Images, Media, Motion, and Sensory Content
- Product-image alternatives MUST communicate material visual information not already nearby.
- Decorative media MUST use empty alternative text or presentation semantics.
- Meaningful prerecorded video audio requires captions; meaningful visual information requires audio description or equivalent when required.
- Audio-only content requires a transcript or equivalent.
- Audio MUST NOT autoplay; motion autoplay SHOULD be avoided and must have pause/stop when used.
- Nonessential interaction motion MUST respect reduced-motion preferences.
- No seizure-risk flashing.
- Instructions MUST NOT rely only on sensory characteristics.
 
# 9. Forms, Validation, and Commerce Interactions
- Persistent visible labels are required unless an approved unambiguous pattern applies; placeholders are not labels.
- Required fields MUST be identified visually and programmatically.
- Provide instructions before use and describe formats or constraints.
- Errors MUST be textually identified, associated with fields, and summarized when multiple.
- Error messages SHOULD explain correction.
- Validation MUST NOT rely only on color.
- Significant submissions SHOULD provide review, confirmation, reversal, or correction opportunities.
- Time limits MUST provide warning and extension unless essential or externally controlled.
- Cart, promotion, inventory, and loading updates MUST be communicated to assistive technology.
 
# 10. Navigation, Search, and Product Discovery
- Use clear, predictable, consistent navigation labels.
- Programmatically indicate current or selected state when appropriate.
- Search MUST have an accessible name and useful result/empty-state communication.
- Filters and sorting MUST expose labels, values, expanded states, and update behavior.
- Product cards MUST have logical reading order and avoid ambiguous links.
- Carousels, accordions, tabs, and disclosures MUST support keyboard and state exposure.
- Breadcrumbs SHOULD be semantically labeled and indicate the current item.
- Identify unexpected new-window or external-destination behavior.
 
# 11. Content Accessibility
- Use direct, understandable language.
- Use descriptive headings, lists, and short paragraphs.
- Link text SHOULD describe destination or purpose.
- Prefer input-neutral instructions.
- Tables are for tabular relationships and MUST identify headers and scope.
- Explain specialized terms and abbreviations when needed.
- Health-benefit content MUST distinguish education from diagnosis, treatment, or individualized medical advice.
- Accessibility statements MUST not overstate conformance.
 
# 12. Responsive, Touch, and Mobile Requirements
- Touch targets SHOULD be at least 24 by 24 CSS pixels or provide equivalent spacing; primary controls SHOULD be larger where practical.
- Separate adjacent controls sufficiently.
- Essential actions MUST NOT depend on hover.
- Dragging requires a non-drag alternative unless essential.
- Motion and complex gestures require conventional control alternatives.
- Mobile overlays MUST correctly manage focus, escape, labeling, and background inertness.
- On-screen keyboards MUST not obscure active controls or instructions.
 
# 13. Third-Party Components and Platform Boundaries
- Evaluate material integrations for keyboard, screen-reader, contrast, zoom, error handling, and remediation history.
- Select accessible alternatives when available.
- Correct configurable defects before release.
- Document vendor-controlled limitations, impact, mitigation, contact, and review date.
- Do not release a critical inaccessible blocker without owner-approved exception and an effective alternative.
- Use Shopify accessibility settings and document defects outside Soothing Saunas control.
 
# 14. Testing and Validation
## 14.1 Required Methods
- Automated scanning.
- Keyboard-only core-journey review.
- Manual contrast, zoom, reflow, and text-spacing review.
- Screen-reader review of navigation, discovery, cart, forms, dialogs, alerts, and dynamic updates.
- Responsive viewport and orientation review.
- Code review for semantics, names, ARIA, focus, and errors.
 
## 14.2 Core Journeys
Test home to discovery; collection/search to product detail; product detail to cart; cart update and checkout handoff; navigation; policy and educational content; support submission; promotional overlays; and newly introduced critical journeys.
 
## 14.3 Evidence
Material defects, results, exceptions, and remediation decisions MUST be traceable. Automated tools MUST NOT be treated as proof of complete conformance.
 
# 15. Defect Severity and Remediation
- **Critical:** blocks a core journey or creates serious safety, seizure, privacy, or legal-risk concern. Resolve before release unless a time-limited owner exception and effective alternative exist.
- **High:** substantially blocks a feature, input method, assistive technology, or major content area. SHOULD be resolved before release; otherwise owner review and remediation date are required.
- **Moderate:** meaningful friction or partial information loss with an accessible path remaining. Record and prioritize.
- **Low:** limited-impact inconsistency or improvement. Correct through maintenance.
 
# 16. Accessibility Statement and Feedback
- Publish an accessibility statement with commitment, supported contact methods, known limitations when appropriate, and latest substantive review date.
- Provide an accessible barrier-reporting method.
- Route and record feedback for accountable triage.
- Acknowledge reports and provide reasonable status updates based on severity and available information.
- Do not claim perfect, universal, certified, or guaranteed compliance without independent support and approval.
 
# 17. Governance, Exceptions, and Change Control
Accessibility requirements are binding. New components, vendors, and design changes MUST be evaluated before release. Existing defects MUST be triaged by severity. Exceptions MUST identify requirement, scope, user impact, reason, alternative, approval, owner, target date, and review condition. Exceptions MUST NOT normalize avoidable inaccessible design. Review this specification when legal requirements, platform capabilities, or approved architecture change.
 
# 18. Engineering Directives
## MUST
- Build core journeys with semantic HTML, keyboard access, visible focus, accessible names, and programmatic state.
- Test new or materially changed guest-facing functionality using automated and manual methods.
- Record material defects, exceptions, and vendor-controlled limitations.
- Provide an accessible alternative when a critical third-party limitation cannot be corrected.
 
## SHOULD
- Include accessibility criteria in component design, code review, content review, and release acceptance.
- Prefer native controls and simpler interaction patterns.
- Include representative disability or assistive-technology testing when practical for major releases.
- Review accessibility after major theme, component, framework, or platform changes.
 
## MUST NOT
- Remove focus outlines without an accessible replacement.
- Use color, motion, hover, sound, or visual position as the sole means of communication.
- Treat automated scan results as complete proof of accessibility.
- Release a known critical blocker without owner-approved exception and mitigation.
 
# 19. Acceptance Criteria
- Core journeys are keyboard operable without traps.
- Focus is visible and not obscured.
- Semantic structure and meaningful names, roles, values, and states are present.
- Applicable contrast requirements are met.
- Content functions at 200 percent zoom and required reflow/text-spacing conditions.
- Forms provide labels, instructions, errors, and correction support.
- Dynamic updates are announced.
- Images and media provide required alternatives and controls.
- No unresolved critical defects remain after automated and manual review.
- High-severity exceptions and third-party limitations are documented and owner-approved.
- Human-readable and Claude Markdown sections are synchronized.
 
# 20. Owner Directive
Accessibility is part of the Soothing Saunas guest experience. Favor clear structure, understandable content, dependable controls, and inclusive access over novelty that creates avoidable barriers. When a feature cannot be made accessible within approved architecture, document the constraint, preserve an accessible path, and request an owner decision rather than silently accepting exclusion.