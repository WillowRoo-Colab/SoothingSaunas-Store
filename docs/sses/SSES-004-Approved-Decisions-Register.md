# SSES-004 - Approved Decisions Register

**Soothing Saunas Engineering Specification**

| Property | Value |
|----------|-------|
| **Document ID** | SSES-004 |
| **Version** | 0.1 |
| **Status** | Approved |
| **Authority Level** | Governance Standard |
| **Owner** | Soothing Saunas |
| **Revision Date** | July 26, 2026 |

---

# Purpose

This document records owner-approved architectural, operational, and engineering decisions governing the Soothing Saunas storefront project.

Its purpose is to prevent approved decisions from being unintentionally reopened, reinterpreted, or replaced during implementation.

---

# Scope

This register governs:

- Platform architecture
- Commerce ownership and data authority
- Storefront responsibilities
- Checkout and transaction boundaries
- Documentation authority
- Guest-experience constraints
- Claude Code implementation behavior
- Change-control requirements

---

# Decision Authority

Entries in this register are approved owner decisions.

Implementers may recommend improvements, but MUST NOT modify an approved decision without explicit owner authorization.

---

# Approved Decisions

## Architecture

- Shopify remains the authoritative commerce backend.
- The public storefront follows a headless architecture.
- The public-facing website is independently designed and rendered.
- Shopify Checkout completes payment, taxes, shipping calculations, and order creation.

## Commerce Data

- Shopify is the system of record for products, variants, pricing, inventory, availability, customers, carts, discounts, orders, and refunds.
- The storefront retrieves live commerce data through supported Shopify APIs.
- Pricing, inventory, and checkout logic MUST NOT be duplicated in the custom storefront.

## Storefront Experience

- Soothing Saunas controls customer-facing presentation, navigation, content structure, branding, and page layouts.
- The experience shall educate before persuading.
- Guest understanding, confidence, and trust take priority over pressure-based conversion tactics.
- Dark patterns and manipulative user-experience practices are prohibited.

## Documentation

- SSES documents are authoritative project specifications.
- Human-readable specifications and repository-ready Markdown shall remain synchronized.
- Approved SSES Markdown files are stored in `docs/sses/`.
- Claude-specific onboarding instructions are stored in `.claude/CLAUDE.md`.

## Claude Code

- Claude Code is the primary implementation engineer for repository work.
- Claude shall read `.claude/CLAUDE.md` and the applicable SSES documents before recommending or making changes.
- Claude shall implement approved architecture rather than redesign it.
- When a conflict or ambiguity is discovered, Claude shall document it and request owner direction.

---

# Change Control

1. Identify the decision that may require revision.
2. Document the reason, impact, and affected specifications.
3. Present the proposed change to the owner.
4. Do not implement the change until owner approval is received.
5. Update the affected SSES documents and this register after approval.

---

# Engineering Directives

## MUST

- Treat all entries in this register as binding until superseded.
- Verify proposed work against this register before changing architecture or system boundaries.
- Escalate conflicts instead of silently resolving them through implementation.

## SHOULD

- Reference the relevant SSES document when explaining an implementation decision.
- Keep decision language concise, testable, and traceable.

## MUST NOT

- Reopen approved decisions without a documented reason.
- Replace Shopify-owned commerce responsibilities with custom logic.
- Change authoritative documentation without owner approval.
- Treat an implementation preference as authority to alter project architecture.

---

# Acceptance Criteria

This specification is satisfied when:

- Approved decisions are easy to locate and understand.
- The register does not conflict with SSES-001, SSES-002, SSES-003, or SSES-006.
- Claude can identify which decisions are fixed and which matters remain open.
- Any future decision change follows the documented change-control process.

---

# Owner Directive

This register exists to preserve continuity.

Execute approved decisions consistently.

When a better idea conflicts with an approved decision, present the idea for review rather than implementing it.