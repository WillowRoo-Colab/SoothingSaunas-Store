# SSES-006 – Headless Shopify Commerce Architecture

**Soothing Saunas Engineering Specification**

| Property | Value |
|----------|-------|
| **Version** | 0.1 |
| **Status** | Approved |
| **Authority Level** | Architecture |

---

# Document Authority

This document defines the approved commerce architecture for Soothing Saunas.

These architectural decisions are owner-approved and shall be implemented without redesign.

If implementation conflicts arise, report them instead of changing this architecture.

---

# Architecture Overview

Soothing Saunas is a **headless Shopify storefront**.

The public website is independently designed, rendered, and controlled by Soothing Saunas.

Shopify serves as the commerce backend and the authoritative system of record for all commerce data.

---

# Commerce Responsibilities

## Shopify SHALL Control

- Products
- Variants
- Pricing
- Compare-at pricing
- Inventory
- Availability
- Customer accounts
- Shopping cart records
- Discounts and promotions
- Checkout
- Shipping calculations
- Tax calculations
- Payment processing
- Orders
- Refunds
- Transaction history

---

## Custom Storefront SHALL Control

- Page layouts
- Navigation
- Typography
- Spacing
- Educational content
- Buying guides
- Product comparisons
- FAQs
- Policy presentation
- Product storytelling
- Search experience
- Branding
- User interface

---

# Commerce Flow

1. Guest browses the custom storefront.
2. Storefront requests live product and variant data from Shopify.
3. Guest selects product options and quantity.
4. Storefront submits the selected Shopify variant to the Shopify cart.
5. Guest may continue shopping within the custom storefront.
6. Guest proceeds to Shopify Checkout.
7. Shopify completes:
   - Payment processing
   - Tax calculation
   - Shipping calculation
   - Order creation

---

# Data Strategy

- Never hard-code prices or inventory.
- Always retrieve live commerce data from Shopify.
- Presentation logic belongs to the custom storefront.
- Commerce truth belongs to Shopify.

---

# Engineering Directives

## MUST

- Use Shopify Storefront APIs or other supported commerce interfaces.
- Separate presentation from commerce logic.
- Preserve Shopify as the authoritative source for commerce data.
- Build reusable integration layers.

---

## SHOULD

- Cache non-sensitive content where appropriate.
- Structure integrations to support future growth.
- Isolate Shopify-specific code from presentation components.

---

## MUST NOT

- Duplicate payment processing.
- Implement a separate order system.
- Calculate taxes independently of Shopify.
- Maintain a second inventory database.
- Replace Shopify Checkout.

---

# Acceptance Criteria

The implementation is considered complete when:

- The storefront displays live Shopify product information.
- Cart operations synchronize with Shopify.
- Checkout is performed through Shopify.
- Presentation changes do not require commerce logic changes.
- Commerce changes do not require redesign of presentation components.