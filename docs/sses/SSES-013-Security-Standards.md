# SSES-013 - Security Standards
 
**Soothing Saunas Engineering Specification**
 
| Property | Value |
|---|---|
| **Document ID** | SSES-013 |
| **Title** | Security Standards |
| **Version** | 0.1 |
| **Status** | Approved |
| **Authority Level** | Engineering Standard |
| **Revision Date** | July 26, 2026 |
 
# 1. Purpose
 
This standard defines the minimum security controls required to protect Soothing Saunas guests, commerce operations, source code, credentials, integrations, and deployment environments. It converts security expectations into implementation requirements that can be applied consistently by human contributors and AI-assisted development tools.
 
# 2. Scope
 
This standard applies to all systems and workflows that store, process, transmit, expose, or administer Soothing Saunas information or functionality, including:
 
- The headless storefront and server-rendered application layers.
- Shopify Storefront API, Admin API, checkout handoff, webhooks, and app integrations.
- Source repositories, local development environments, CI/CD pipelines, hosting platforms, and content delivery infrastructure.
- Environment variables, secrets, tokens, certificates, signing keys, and service credentials.
- Guest-submitted forms, search inputs, account-related flows, support communications, and analytics events.
- Third-party packages, services, scripts, pixels, APIs, and embedded content.
 
Shopify remains the system of record for commerce data and checkout. This document does not replace Shopify platform security controls; it governs how Soothing Saunas integrates with and exposes those capabilities.
 
# 3. Security Principles
 
| Principle | Requirement |
|---|---|
| **Least Privilege** | Every user, service, token, and integration shall receive only the permissions required for its current function. |
| **Secure by Default** | New features and environments shall begin from restrictive defaults. Access or exposure shall be added intentionally. |
| **Defense in Depth** | Security shall not depend on a single control. Validation, authorization, transport security, headers, monitoring, and platform controls shall reinforce one another. |
| **No Secret Trust in the Client** | Browsers and public storefront code are untrusted environments. Privileged credentials and sensitive decision logic shall remain server-side. |
| **Minimize Data** | Collect, retain, log, and transmit only the information necessary for the approved business purpose. |
| **Traceable Change** | Security-sensitive changes shall be reviewable through version control, deployment records, and the applicable SSES decision process. |
 
# 4. Security Ownership and Boundaries
 
| Area | Primary Responsibility |
|---|---|
| **Shopify** | Checkout security, payment processing, protected commerce records, customer and order data within Shopify, platform authentication, and Shopify-managed infrastructure. |
| **Soothing Saunas Storefront** | Safe rendering, server-side token handling, input validation, security headers, dependency hygiene, secure API usage, and protection of public-facing routes. |
| **Hosting and CI/CD Providers** | Platform-level identity, deployment isolation, managed TLS, build execution, runtime controls, and platform audit records, as contracted and configured. |
| **Owner / Authorized Administrator** | Account ownership, permission approval, recovery methods, vendor authorization, security exceptions, and incident decisions. |
| **Implementers and AI Tools** | Compliance with approved specifications, no unauthorized expansion of access, no exposure of secrets, and escalation of ambiguity or conflict. |
 
# 5. Identity, Authentication, and Administrative Access
 
Administrative access shall be limited to individually attributable accounts. Shared credentials shall not be used when the platform supports named users or service identities.
 
## MUST
 
- Enable multi-factor authentication for Shopify, source control, hosting, domain/DNS, email administration, analytics administration, and other security-relevant accounts when supported.
- Use role-based permissions and the lowest practical privilege level.
- Remove access promptly when a contributor, contractor, integration, or service no longer requires it.
- Keep account recovery methods current and controlled by the owner or an explicitly authorized administrator.
- Use separate service credentials for automation rather than personal administrator credentials when supported.
 
## MUST NOT
 
- Share owner passwords, recovery codes, or persistent administrator sessions through chat, source files, tickets, screenshots, or documentation.
- Grant production administrative access solely for convenience.
- Allow AI tools to create, rotate, disclose, or broaden privileged credentials without explicit owner direction.
 
# 6. Secrets and Environment Configuration
 
Secrets include API tokens, private keys, signing secrets, database credentials, administrative passwords, webhook secrets, and any value that grants non-public access or authority.
 
## MUST
 
- Store secrets in approved environment-variable or secrets-management systems.
- Keep privileged Shopify Admin API credentials server-side only.
- Use environment-specific credentials where the provider supports separation.
- Rotate a secret immediately when exposure is suspected or confirmed.
- Prevent secrets from appearing in logs, client bundles, error messages, screenshots, repository history, or generated documentation.
 
## SHOULD
 
- Use scoped, short-lived, or revocable credentials when available.
- Document the owner, purpose, scope, environment, and rotation expectation for each production secret without recording the secret value.
 
## MUST NOT
 
- Commit `.env` files or secret values to source control.
- Prefix privileged secrets with public-client conventions such as `NEXT_PUBLIC_` or equivalent.
- Copy production credentials into test fixtures, local examples, or support messages.
 
# 7. API and Integration Security
 
- All external API traffic shall use HTTPS with certificate validation.
- Privileged API calls shall originate from trusted server-side code or approved secure platform functions.
- API permissions shall be scoped to the minimum required resources and operations.
- Webhook consumers shall verify provider signatures or equivalent authenticity controls before processing payloads.
- Webhook handlers shall tolerate retries, reject malformed requests, prevent replay where required, and implement idempotent processing for state-changing operations.
- Rate limits, timeouts, bounded retries, and failure handling shall be implemented for third-party calls.
- Integration failures shall fail safely and shall not bypass validation, authorization, inventory, pricing, checkout, or consent requirements.
 
# 8. Input Validation and Output Safety
 
Every value received from a browser, URL, form, webhook, third-party service, CMS, product field, or query parameter shall be treated as untrusted until validated.
 
## MUST
 
- Validate type, length, format, allowed values, and business rules at the server boundary for state-changing or privileged operations.
- Encode output for its destination context and rely on framework-safe rendering defaults.
- Sanitize rich text or HTML before rendering when content can contain markup.
- Use parameterized queries or approved data-access abstractions when a database is introduced.
- Reject unexpected fields or values when permissive handling would create security or integrity risk.
 
## MUST NOT
 
- Use client-side validation as the only validation for a protected operation.
- Execute, interpolate, or render untrusted content as code, HTML, SQL, shell commands, templates, or redirect destinations without an approved safety control.
- Expose detailed stack traces, provider responses, or internal identifiers to guests.
 
# 9. Browser and Application Security Headers
 
Production responses shall use security headers appropriate to the application architecture. Policies shall be tested against required Shopify, analytics, support, media, and content integrations before enforcement.
 
| Control | Minimum Requirement |
|---|---|
| **Content Security Policy** | Define approved script, style, image, font, frame, form-action, connection, and base URI sources. Avoid broad wildcards and unsafe directives unless documented and approved. |
| **Transport Security** | Serve production only over HTTPS and enable HSTS through the hosting or edge platform after confirming HTTPS readiness. |
| **Framing Protection** | Use CSP `frame-ancestors` and/or equivalent protections to prevent unauthorized framing while allowing only approved embedded use. |
| **Referrer Policy** | Limit referrer disclosure using a privacy-preserving policy appropriate to commerce and analytics needs. |
| **Content-Type Protection** | Set `X-Content-Type-Options: nosniff` or equivalent platform control. |
| **Permissions Policy** | Disable browser capabilities not required by the storefront and explicitly allow only approved features. |
| **Cookies** | Cookies set by Soothing Saunas shall use Secure, HttpOnly where script access is unnecessary, and an appropriate SameSite setting. |
 
# 10. Dependency and Supply-Chain Security
 
## MUST
 
- Use a lockfile and deterministic dependency installation in CI/CD.
- Review dependency changes before approval, including newly introduced transitive risk when material.
- Remove unused packages, integrations, scripts, and access grants.
- Address known critical or high-severity vulnerabilities promptly based on exploitability, exposure, and business impact.
- Pin or otherwise control third-party scripts when the integration supports integrity or version restrictions.
 
## SHOULD
 
- Use automated dependency alerts and routine security scanning.
- Prefer maintained packages with clear ownership, active releases, and limited privilege requirements.
- Avoid adding a dependency when the same outcome can be achieved safely with a small, maintainable implementation.
 
# 11. Data Protection and Privacy
 
- Sensitive personal, order, payment, authentication, and support information shall not be placed in public repositories, client logs, analytics payloads, or general-purpose debugging output.
- Payment card information shall remain within Shopify-managed checkout and approved payment systems. Soothing Saunas storefront code shall not collect or process raw payment card data.
- Guest data collection shall be limited to the approved purpose and aligned with published privacy and consent practices.
- Logs and analytics shall avoid full form bodies, credentials, session tokens, payment details, and unnecessary personal information.
- Data exports and support records shall be shared only through approved channels and only with authorized recipients.
- Retention and deletion practices shall follow applicable policy, legal, operational, and platform requirements.
 
# 12. Logging, Monitoring, and Error Handling
 
## MUST
 
- Log security-relevant failures with sufficient context for diagnosis without recording secrets or unnecessary personal data.
- Monitor production deployment failures, repeated server errors, webhook verification failures, and material authentication or authorization anomalies where platform capabilities permit.
- Use generic guest-facing error messages and retain technical detail in protected logs.
- Protect logs and monitoring dashboards through authenticated, least-privilege access.
 
## SHOULD
 
- Define alerts for events that require timely action rather than generating unreviewed noise.
- Maintain correlation identifiers or equivalent traceability across distributed requests without exposing sensitive values.
 
# 13. Development, Testing, and Deployment Security
 
- Development and preview environments shall not use production secrets or production personal data unless explicitly required and approved.
- Preview deployments shall be treated as externally reachable unless access controls prove otherwise.
- Security-sensitive changes shall receive review before production deployment.
- Build and deployment systems shall use protected credentials and limited production permissions.
- Automated tests shall cover security-critical validation, authorization, webhook verification, and failure behavior where those controls exist.
- Production changes shall be reversible through version control, deployment rollback, or an approved remediation process.
 
# 14. Incident and Vulnerability Handling
 
A suspected security incident includes credential exposure, unauthorized access, malicious code, compromised dependency, data disclosure, payment-flow tampering, domain or DNS changes, fraudulent integration activity, or any unexplained event that could affect confidentiality, integrity, or availability.
 
1. Preserve relevant evidence and avoid destructive cleanup until the impact is understood.
2. Contain the issue by revoking or rotating credentials, disabling affected integrations, restricting access, or rolling back unsafe changes as appropriate.
3. Identify affected systems, data, guests, vendors, and timeframes.
4. Notify the owner promptly with known facts, uncertainty, impact, and immediate options.
5. Coordinate required platform, vendor, legal, insurance, or guest communications through the owner.
6. Remediate the root cause and verify the control before restoring normal operation.
7. Document the event, decisions, corrective actions, and any required SSES revision.
 
Vulnerability reports shall be evaluated based on reproducibility, exposure, exploitability, and impact. Public disclosure or guest notification shall not be initiated by an implementer or AI tool without owner authorization unless legally required and delegated.
 
# 15. Security Exceptions
 
A temporary exception may be approved only when the business need is documented and compensating controls reduce risk. Each exception shall identify the affected requirement, scope, reason, risk, compensating controls, owner approval, responsible party, and expiration or review condition. Expired exceptions shall not remain active by default.
 
# 16. Engineering Directives
 
## MUST
 
- Protect privileged credentials and keep them outside client-delivered code.
- Apply least privilege to accounts, tokens, APIs, integrations, and deployment systems.
- Validate untrusted input and safely encode or sanitize output.
- Verify webhook authenticity before acting on payloads.
- Use HTTPS and appropriate production security headers.
- Escalate suspected exposure, conflict, or unsafe requirements to the owner.
 
## SHOULD
 
- Automate repeatable security checks in the development and deployment workflow.
- Design controls that remain maintainable as the storefront, content library, and integration surface expand.
- Prefer platform-managed security capabilities when they reduce custom attack surface without weakening approved architecture.
 
## MUST NOT
 
- Expose secrets in source control, public client code, logs, analytics, screenshots, prompts, or documentation.
- Collect raw payment card data outside Shopify-managed checkout.
- Disable security controls merely to make an integration work without documented owner approval.
- Silently accept a security conflict or implement an unapproved workaround.
- Grant AI tools independent authority to approve exceptions, disclose incidents, or broaden production access.
 
# 17. Acceptance Criteria
 
- No privileged secret is present in the client bundle, repository, generated artifact, or public log.
- Administrative accounts use available multi-factor authentication and least-privilege roles.
- Production traffic uses HTTPS and approved security headers.
- Inputs and webhooks are validated at trusted boundaries.
- Package installation is lockfile-controlled and known material vulnerabilities are reviewed.
- Guest-facing errors do not expose stack traces, credentials, or sensitive provider details.
- Production logging excludes secrets, raw payment data, and unnecessary personal information.
- Security-sensitive deployment and configuration changes are traceable.
- Any active exception is documented, owner-approved, scoped, and time-bounded.
- The human-readable and Claude Markdown sections remain substantively synchronized.
 
# 18. Owner Directive
 
Security shall support the guest experience without becoming invisible technical debt. Build the smallest practical attack surface, use managed controls where they preserve architectural intent, and treat every new integration as a new trust boundary. When security and convenience conflict, document the tradeoff and obtain an owner decision rather than silently weakening the standard.