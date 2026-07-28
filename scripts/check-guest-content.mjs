#!/usr/bin/env node
// Fails the build if guest-facing source files contain development
// scaffolding language (SSES references, "pending", "placeholder", etc.).
//
// Scope: only guest-facing (storefront) source. Admin-only UI under
// src/app/store-settings/** and src/components/admin/** is out of scope —
// guests never see it, so "Coming soon" there isn't a governance risk.
//
// src/lib/dev-content.ts is intentionally excluded: it's the approved,
// centralized home for this exact language (see that file's header
// comment) and is expected to contain every trigger phrase as data.
//
// Code comments are stripped before scanning — SSES references belong in
// comments per SSES-000/SSES-005 and must not trip this check.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");

const SCAN_ROOTS = [
  join(ROOT, "src", "app", "(storefront)"),
  join(ROOT, "src", "components"),
];

// Admin-only UI and the DevPlaceholder infrastructure itself are excluded
// at any depth within the scanned roots.
const EXCLUDE_DIRS = new Set(["admin", "dev"]);

const EXCLUDE_FILES = new Set([
  join(ROOT, "src", "lib", "dev-content.ts"),
]);

// Phrases that must never reach guest-facing rendered content.
// "coming soon" intentionally has an approval escape hatch — see
// APPROVED_EXCEPTIONS below.
// Most phrases are plain substrings. "placeholder" is a regex because the
// literal word also appears as Tailwind's `placeholder:` variant prefix,
// the HTML `placeholder=` attribute name, and the `DevPlaceholder`
// component/import identifier — none of that is guest-visible text, so the
// match excludes anything immediately preceded by "dev" or followed by
// ":" or "=".
const TRIGGER_PHRASES = [
  "sses-",
  "pending review",
  "pending approval",
  /(?<!dev)placeholder(?!:|=)/,
  "lorem ipsum",
  "coming soon",
];

function phraseLabel(phrase) {
  return phrase instanceof RegExp ? "placeholder" : phrase;
}

function phraseMatches(text, phrase) {
  return phrase instanceof RegExp ? phrase.test(text) : text.includes(phrase);
}

// Explicit, reviewable exceptions for approved uses of a trigger phrase in
// guest-facing copy. Add an entry here only with real owner sign-off —
// this is a deliberate override, not a place to silence the check.
const APPROVED_EXCEPTIONS = [
  // { file: "src/app/(storefront)/page.tsx", phrase: "coming soon", reason: "…", approvedBy: "…" },
];

function isApproved(filePath, phraseText) {
  const rel = relative(ROOT, filePath);
  return APPROVED_EXCEPTIONS.some(
    (e) => e.file === rel && e.phrase.toLowerCase() === phraseText
  );
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (EXCLUDE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function collectFiles() {
  const files = [];
  for (const root of SCAN_ROOTS) {
    try {
      walk(root, files);
    } catch {
      // directory may not exist in some checkouts; skip quietly
    }
  }
  return files.filter((f) => !EXCLUDE_FILES.has(f));
}

function checkFile(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const stripped = stripComments(raw).toLowerCase();
  const violations = [];

  for (const phrase of TRIGGER_PHRASES) {
    const label = phraseLabel(phrase);
    if (phraseMatches(stripped, phrase) && !isApproved(filePath, label)) {
      violations.push(label);
    }
  }

  return violations;
}

function main() {
  const files = collectFiles();
  const failures = [];

  for (const file of files) {
    const violations = checkFile(file);
    if (violations.length > 0) {
      failures.push({ file: relative(ROOT, file), violations });
    }
  }

  if (failures.length > 0) {
    console.error("\n✖ Guest-facing content check failed.\n");
    for (const { file, violations } of failures) {
      console.error(`  ${file}`);
      for (const v of violations) {
        console.error(`    - contains "${v}"`);
      }
    }
    console.error(
      "\nMove this copy into src/lib/dev-content.ts (devLabel/fallback) and " +
        "render it via DevPlaceholder, or add an explicit, owner-approved " +
        "exception in scripts/check-guest-content.mjs.\n"
    );
    process.exit(1);
  }

  console.log(
    `✓ Guest-facing content check passed (${files.length} files scanned).`
  );
}

main();
