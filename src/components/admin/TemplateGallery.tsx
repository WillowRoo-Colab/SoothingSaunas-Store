"use client";

import { useState } from "react";
import type { TemplateEntry } from "@/lib/templates";
import { TemplatePreviewModal } from "./TemplatePreviewModal";

export function TemplateGallery({
  categoryLabel,
  templates,
}: {
  categoryLabel: string;
  templates: TemplateEntry[];
}) {
  const [openTemplate, setOpenTemplate] = useState<TemplateEntry | null>(null);

  if (templates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-silver px-6 py-12 text-center">
        <p className="text-sm text-charcoal/70">
          No {categoryLabel.toLowerCase()} templates have been built yet.
        </p>
        <p className="mt-1 text-xs text-charcoal/50">
          They&apos;ll appear here to preview and select as they&apos;re created.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => setOpenTemplate(template)}
            className="flex flex-col items-start gap-2 rounded-xl border border-silver bg-white p-4 text-left transition-shadow hover:shadow-md"
          >
            <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-charcoal/5 text-xs text-charcoal/40">
              Preview
            </div>
            <p className="font-display text-base text-charcoal">{template.label}</p>
            <p className="text-xs text-charcoal/60">{template.description}</p>
            <span className="mt-1 text-xs font-medium text-gold">
              Open enlarged preview →
            </span>
          </button>
        ))}
      </div>

      {openTemplate ? (
        <TemplatePreviewModal template={openTemplate} onClose={() => setOpenTemplate(null)} />
      ) : null}
    </>
  );
}
