# Soothing Saunas Development Guide

## Mission

This repository contains the Soothing Saunas website and supporting systems.

The objective is to create an education-first wellness platform that prioritizes guest confidence, trust, and long-term relationships over short-term conversions.

---

## Engineering Specifications

Before making architectural decisions or modifying code, read the following specifications:

1. docs/sses/SSES-001-Project-Architecture.md
2. docs/sses/SSES-002-Company-Philosophy.md
3. docs/sses/SSES-003-Guest-Experience-Standards.md
4. docs/sses/SSES-004-Approved-Decisions-Register.md
5. docs/sses/SSES-005-AI-Roles-Responsibility.md
6. docs/sses/SSES-006-Headless-Shopify-Commerce-Architecture.md
7. docs/sses/SSES-007-Design-System-Visual-Standards.md
8. docs/sses/SSES-008-Component-Architecture.md
9. docs/sses/SSES-009-Content-Strategy.md
10. docs/sses/SSES-010-SEO-Information-Architecture.md
11. docs/sses/SSES-011-Accessibility-Compliance.md
12. docs/sses/SSES-012-Performance-Standards.md
13. docs/sses/SSES-013-Security-Standards.md

These documents are authoritative.

If implementation conflicts arise, report the conflict rather than changing the specifications.

---

## Framework Notes

@AGENTS.md

Read `AGENTS.md` and, where relevant, `node_modules/next/dist/docs/` before writing Next.js-specific code. The installed Next.js version may postdate this model's training data — do not assume training-data conventions still apply.

---

## Development Philosophy

- Implement before redesigning.
- Preserve architectural boundaries.
- Keep Shopify responsible for commerce.
- Keep the custom storefront responsible for presentation.
- Prioritize maintainability, accessibility, and scalability.

---

## AI Behavior

When uncertain:

- Ask.
- Explain assumptions.
- Do not invent architecture.
- Do not replace approved decisions.