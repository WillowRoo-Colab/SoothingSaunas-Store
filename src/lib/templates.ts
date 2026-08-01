// Static registry of storefront page templates available to preview from
// the admin Templates section. Plain data today — there's exactly one real
// template (the product page), and Collections / Promos & Ads have none
// built yet. Each entry's `previewPath` is a real, live storefront route;
// the preview panel just points an iframe at it, so it reflects whatever
// the component code currently renders — no separate preview-only copy of
// the page to keep in sync.

export type TemplateCategory = "collections" | "products" | "promos-ads";

export interface TemplateEntry {
  id: string;
  label: string;
  description: string;
  previewPath: string;
  /** Shown only for templates that take a variable identifier (e.g. a
   * product handle) so the admin can preview the same template against a
   * different real record. Plain data only (no functions) — this crosses
   * the server/client boundary as a prop, and functions can't serialize
   * across it. */
  variableSegment?: {
    label: string;
    placeholder: string;
    /** Final preview path is `${basePath}${value}`. */
    basePath: string;
  };
}

export const TEMPLATE_CATEGORIES: Record<
  TemplateCategory,
  { label: string; templates: TemplateEntry[] }
> = {
  collections: {
    label: "Collections",
    templates: [],
  },
  products: {
    label: "Products",
    templates: [
      {
        id: "default-product",
        label: "Default Product Template",
        description:
          "Used for every product today — image gallery with zoom, and the info panel (price, description, metafields, buy button).",
        previewPath: "/products/the-palmer-sauna",
        variableSegment: {
          label: "Preview a different product (handle)",
          placeholder: "the-palmer-sauna",
          basePath: "/products/",
        },
      },
    ],
  },
  "promos-ads": {
    label: "Promos/Ads",
    templates: [],
  },
};
