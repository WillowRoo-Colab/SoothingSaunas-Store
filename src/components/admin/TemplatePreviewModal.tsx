"use client";

import { useState } from "react";
import type { TemplateEntry } from "@/lib/templates";

// The iframe just points at the real, live storefront route — during
// `npm run dev` Next.js's own Fast Refresh keeps it current automatically
// whenever the template's code changes, the same as any other browser tab
// on that URL. In production there's no Fast Refresh (code only changes on
// redeploy), so "Reload" forces a fresh fetch instead.
export function TemplatePreviewModal({
  template,
  onClose,
}: {
  template: TemplateEntry;
  onClose: () => void;
}) {
  const [variableValue, setVariableValue] = useState(
    template.variableSegment?.placeholder ?? ""
  );
  const [reloadKey, setReloadKey] = useState(0);

  const src = template.variableSegment
    ? `${template.variableSegment.basePath}${
        variableValue || template.variableSegment.placeholder
      }`
    : template.previewPath;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-[92vh] w-[95vw] flex-col overflow-hidden rounded-2xl bg-cream shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-silver px-4 py-3">
          <div>
            <p className="font-display text-lg text-charcoal">{template.label}</p>
            <p className="font-mono text-xs text-charcoal/60">{src}</p>
          </div>

          <div className="flex items-center gap-3">
            {template.variableSegment ? (
              <div className="flex items-center gap-2">
                <label htmlFor="preview-variable" className="text-xs font-medium text-charcoal/70">
                  {template.variableSegment.label}
                </label>
                <input
                  id="preview-variable"
                  value={variableValue}
                  onChange={(e) => setVariableValue(e.target.value)}
                  placeholder={template.variableSegment.placeholder}
                  className="rounded border border-silver px-2 py-1 text-sm"
                />
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="rounded border border-silver px-3 py-1.5 text-sm font-medium text-charcoal/70 transition-colors hover:text-charcoal"
            >
              Reload
            </button>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-silver px-3 py-1.5 text-sm font-medium text-charcoal/70 transition-colors hover:text-charcoal"
            >
              Open in new tab
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold text-lg text-gold transition hover:bg-charcoal hover:text-cream"
            >
              &times;
            </button>
          </div>
        </div>

        <iframe key={`${src}-${reloadKey}`} src={src} title={`${template.label} preview`} className="flex-1 bg-white" />
      </div>
    </div>
  );
}
