# SSES-001 – Project Architecture

**Soothing Saunas Engineering Specification**

| Property | Value |
|----------|-------|
| **Version** | 0.1 |
| **Status** | Approved |
| **Authority Level** | Architecture |

---

# Purpose

This document defines the permanent technical architecture of the Soothing Saunas platform.

All engineering work shall conform to these architectural decisions unless explicitly changed by the owner.

---

# Architecture Status

| Item | Value |
|------|-------|
| **Architecture** | Approved |
| **Commerce Platform** | Shopify |
| **Storefront Model** | Headless |
| **Public Website** | Independently designed and rendered |
| **Commerce Engine** | Shopify |
| **Checkout** | Shopify Checkout |
| **System of Record** | Shopify (Commerce Data) |

---

# Authoritative Responsibilities

## Soothing Saunas Custom Storefront

Responsible for:

- Homepage
- Landing pages
- Blog
- Buying guides
- FAQs
- Policies
- Headers
- Footers
- Navigation
- Search experience
- Custom product page layouts
- Typography
- Spacing
- Branding
- Animations
- Educational content
- Buying guidance
- Guest journey
- User experience

---

## Shopify Commerce Backend

Responsible for:

- Products
- Variants
- Pricing
- Compare-at pricing
- Inventory
- Availability
- Customers
- Shopping carts
- Discounts
- Checkout
- Taxes
- Shipping calculations
- Payment processing
- Orders
- Refunds

---

# Commerce Flow

1. Guest browses the custom storefront.
2. Storefront retrieves live product data from Shopify.
3. Guest selects a product variant.
4. Storefront adds the selected variant to a Shopify cart.
5. Guest continues browsing within the custom storefront.
6. Guest proceeds to Shopify Checkout.
7. Shopify completes:
   - Payment processing
   - Tax calculation
   - Shipping calculation
   - Order creation

---

# Engineering Directives

## MUST

- Treat Shopify as the authoritative commerce backend.
- Keep all customer-facing presentation under Soothing Saunas control.
- Build reusable, maintainable components.
- Use Shopify APIs for commerce functions instead of recreating them.

---

## SHOULD

- Separate presentation from commerce logic.
- Favor modular architecture.
- Document reusable components.

---

## MUST NOT

- Rebuild payment processing.
- Duplicate inventory or pricing logic.
- Modify approved architectural decisions without explicit owner approval.
- Use manipulative UX patterns.

---

# Owner Directive

You are implementing an already approved architecture.

Your role is to execute the specification, **not** redesign it.

If a conflict is discovered, document the conflict instead of changing the architecture.