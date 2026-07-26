# SSES-000 - Documentation Governance Standard
**Soothing Saunas Engineering Specification**
| Property | Value |
|---|---|
| **Document ID** | SSES-000 |
| **Title** | Documentation Governance Standard |
| **Version** | 0.4 |
| **Status** | Approved |
| **Authority Level** | Documentation Governance |
| **Revision Date** | July 26, 2026 |
---
# 1. Purpose
This standard establishes the authoritative documentation system for the Soothing Saunas Engineering Specification (SSES) library.
It ensures that human-readable Word documents and repository-ready Claude Markdown remain structurally synchronized, traceable, reviewable, and safe to use as implementation authority.
# 2. Scope
This standard applies to every document issued under the SSES identifier, including:
- Architecture decisions
- Engineering standards
- Design standards
- Operating procedures
- Data contracts
- Integration specifications
- Security requirements
- Acceptance criteria
- Governance records
- New SSES documents
- Revisions to approved SSES documents
- Markdown copies stored in the engineering repository
- Superseded or retired specifications
- Supporting appendices formally incorporated into an SSES document
# 3. Governing Principles
| Principle | Requirement |
|---|---|
| **Single Source of Truth** | The approved SSES library is the authoritative source for project requirements. Informal chat instructions, draft code, screenshots, and implementation assumptions do not override an approved specification. |
| **Synchronized Dual Format** | Each approved specification shall contain a formatted human-readable section and a synchronized Claude Markdown section. Both sections express the same requirements and authority. |
| **Explicit Authority** | Every document shall identify its authority level, status, version, and revision date. |
| **Controlled Change** | Approved requirements may change only through documented revision and owner approval. |
| **Traceable Decisions** | Material decisions, exceptions, and conflicts shall be captured in the governing specification rather than left only in conversation history. |
| **Implementation Fidelity** | Engineering work shall implement approved specifications. It shall not silently redesign, weaken, reinterpret, or bypass them. |
# 4. Document Identification and Naming
## 4.1 Document Identifier
Each specification shall use the identifier format `SSES-NNN`, where `NNN` is a unique three-digit number.
Once assigned, an identifier shall not be reused for a different subject.
## 4.2 Official Title
The official title shall be concise, specific, and stable. It shall describe the governed subject without embedding temporary project phases, dates, or implementation tools unless those items are essential to the specification.
## 4.3 File Naming
The approved Word filename shall use:
`SSES-NNN - Official Title (vX.Y).docx`
The repository Markdown filename shall use lowercase kebab-case unless the repository standard requires preservation of the SSES identifier, for example:
`sses-000-documentation-governance-standard.md`
# 5. Required Document Metadata
| Field | Requirement |
|---|---|
| **Document ID** | Permanent SSES identifier. |
| **Title** | Official document title. |
| **Version** | Current semantic document version. |
| **Status** | Lifecycle state defined by this standard. |
| **Authority Level** | Type and weight of authority conveyed by the document. |
| **Revision Date** | Date the current version was approved or issued. |
# 6. Authority Levels
| Authority Level | Function |
|---|---|
| **Governance** | Controls the documentation system, decision process, ownership, and change rules. |
| **Architecture** | Controls permanent or foundational platform structure and system boundaries. |
| **Engineering Standard** | Defines mandatory engineering, experience, quality, security, or implementation requirements. |
| **Procedure** | Defines an approved repeatable process or operational workflow. |
| **Reference** | Provides approved supporting information but does not independently override higher-authority requirements. |
When requirements conflict, the more specific approved document governs within its scope unless it conflicts with a higher-level governance or architecture decision.
Unresolved conflicts shall be documented and escalated to the owner. They shall not be resolved through silent implementation choices.
# 7. Document Status
| Status | Meaning |
|---|---|
| **Draft** | Under development. Not implementation authority. |
| **In Review** | Submitted for validation. Not implementation authority unless the owner explicitly authorizes limited use. |
| **Approved** | Current implementation authority. |
| **Superseded** | Replaced by a newer approved version or document. Retained for history only. |
| **Retired** | No longer applicable and not replaced. Retained for history only. |
The word `LOCKED` shall not be used as a document status.
Approval state is shown by `Status: Approved`. The binding force of the document is conveyed through the Authority Level and its approved content.
# 8. Versioning Standard
SSES documents shall use a two-part version number: `Major.Minor`.
- **Minor revision**: clarification, expansion, formatting correction, or requirement change that preserves the document's fundamental scope and architecture.
- **Major revision**: initial formal release, substantial scope change, replacement of governing decisions, or change that materially alters implementation obligations.
Version numbers shall be identical in the cover page, human-readable metadata, Claude Markdown metadata, filename, footer, and repository record.
# 9. Required Word Document Structure
Every approved SSES Word document shall use this sequence:
1. Professional cover page containing brand identification, document ID, title, version, status, authority level, revision date, and authority statement.
2. Formatted human-readable specification using approved headings, tables, directives, and acceptance criteria.
3. A hard page break.
4. A visible `CLAUDE MARKDOWN` section title.
5. A second hard page break when necessary to begin the repository copy cleanly.
6. A complete Courier New Markdown version synchronized to the human-readable specification.
# 10. Human-Readable Formatting Standard
- Use a consistent Soothing Saunas visual system with charcoal, cream, navy, and restrained gold accents.
- Use Playfair Display or an approved serif equivalent for major titles.
- Use Lato or an approved sans-serif equivalent for body text.
- Use clear numbered sections when the document benefits from stable references.
- Use tables for metadata, authority mappings, status definitions, comparison rules, and structured criteria.
- Use MUST, SHOULD, and MUST NOT directives when implementation behavior requires explicit priority.
- Avoid decorative formatting that weakens readability, accessibility, or professional use.
- Keep headings with the content that follows and prevent table rows from splitting where practical.
# 11. Claude Markdown Synchronization Standard
The Claude Markdown section is not an abbreviated summary.
It is a repository-ready expression of the approved specification and shall preserve all material requirements, exceptions, directives, acceptance criteria, ownership rules, and conflict-resolution rules.
## 11.1 Synchronization Requirements
- Section names and logical order shall match the human-readable section.
- Metadata values shall match exactly.
- Every MUST, SHOULD, MUST NOT, acceptance criterion, and owner directive shall appear in both formats.
- Tables may be converted to Markdown tables or equivalent structured lists without changing meaning.
- Formatting-only elements may differ, but requirements may not be omitted, softened, or added independently.
- The Markdown copy shall use Courier New in the Word document and plain Markdown syntax suitable for repository storage.
## 11.2 Synchronization Check
Before approval, the author or reviewer shall compare the two formats section by section.
A document shall not be marked Approved while the two formats contain unresolved substantive differences.
# 12. Normative Language
| Term | Meaning |
|---|---|
| **MUST / SHALL** | Mandatory requirement. |
| **SHOULD** | Strong recommendation. Departure requires a documented reason. |
| **MUST NOT / SHALL NOT** | Prohibited behavior. |
| **MAY** | Permitted option, not a requirement. |
# 13. Approval and Change Control
Only the owner, or a person explicitly delegated by the owner, may approve an SSES document or a revision that changes implementation authority.
1. Draft the change in both human-readable and Markdown sections.
2. Identify affected SSES documents and implementation areas.
3. Resolve conflicts or record them for owner decision.
4. Update version, revision date, filename, footer, and metadata.
5. Perform synchronization and visual-quality checks.
6. Obtain explicit approval.
7. Replace the active repository copy and retain the prior approved version as superseded history.
No approved requirement may be changed solely in code, a task prompt, a pull request description, or conversation history.
The governing SSES document shall be revised when the approved rule changes.
# 14. Conflict and Exception Handling
When an implementer discovers a conflict, ambiguity, technical impossibility, or newly introduced constraint, the implementer shall not silently choose a new architecture or weaken an approved standard.
- Document the conflict precisely.
- Identify the affected SSES sections.
- Describe implementation impact and available options.
- Preserve the current approved behavior where safe and practical.
- Request an owner decision.
- Update the governing specification after approval.
Temporary exceptions shall identify:
- Scope
- Reason
- Owner approval
- Expiration or review condition
- Requirement to which the exception applies
# 15. Repository and Source Control
- The Markdown copy shall be stored in the designated documentation directory of the active engineering repository.
- The repository copy shall match the Claude Markdown section in the approved Word document.
- Commit messages shall identify the SSES number and version when adding or revising a specification.
- Superseded versions shall remain traceable through source control or an approved archive.
- Implementation work shall reference the governing SSES identifier in issues, milestones, or pull requests when the requirement materially controls the work.
# 16. Quality and Acceptance Criteria
An SSES document is ready for approval only when all applicable criteria are satisfied:
- The identifier is unique and correct.
- The title, version, status, authority level, and revision date are consistent everywhere.
- The scope and authority are clear.
- Normative requirements are unambiguous.
- The human-readable and Claude Markdown sections are substantively synchronized.
- The document contains no unresolved placeholders, contradictory instructions, or accidental legacy terminology.
- The Word document renders without clipping, broken tables, missing content, or pagination defects.
- The repository filename and Markdown syntax are valid.
- Owner approval is explicit.
# 17. Engineering Directives
## MUST
- Treat approved SSES documents as implementation authority.
- Maintain synchronized human-readable and Claude Markdown content.
- Use `Status: Approved` for active approved documents.
- Record material changes through versioned document revision.
- Escalate conflicts rather than silently redesigning requirements.
## SHOULD
- Write requirements so a new implementer can act without relying on conversation history.
- Use stable section numbering and clear acceptance criteria.
- Cross-reference related SSES documents when dependencies exist.
## MUST NOT
- Use `LOCKED` as a lifecycle status.
- Approve a document whose Word and Markdown sections materially differ.
- Treat chat history, draft code, or screenshots as superior to an approved SSES requirement.
- Reuse an existing SSES identifier for a different subject.
- Alter approved authority without owner approval.
# 18. Owner Directive
The SSES library exists to preserve decisions, prevent drift, and allow implementation to proceed from a stable source of truth.
**Freeze the forest. Improve the trees.**
When a new idea does not belong to the active milestone or current specification, capture it for later rather than allowing it to derail approved work.
SSES-000  |  Version 0.4  |  Approved 