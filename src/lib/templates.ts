// Static registry of storefront page templates available to preview from
// the admin Templates section. Plain data today — there's exactly one real
// template (the product page), and Collections / Promos & Ads have none
// built yet. Each entry's `previewPath` is a real, live storefront route;
// the preview panel just points an iframe at it, so it reflects whatever
// the component code currently renders — no separate preview-only copy of
// the page to keep in sync.

export type TemplateCategory = "collections" | "products" | "promos-ads";

/** A live Shopify record's handle/title, used to populate the preview
 * modal's variable-segment field as a dropdown instead of free text. */
export interface HandleOption {
  handle: string;
  title: string;
}

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
    templates: [
      {
        id: "default-collection",
        label: "Default Collection Template",
        description:
          "Used for every collection today — sort, grid/list view toggle, and the product grid.",
        previewPath: "/collections/traditional-saunas",
        variableSegment: {
          label: "Preview a different collection (handle)",
          placeholder: "traditional-saunas",
          basePath: "/collections/",
        },
      },
    ],
  },
  products: {
    label: "Products",
    templates: [
      {
        id: "default-product",
        label: "Default Product Template",
        description:
          "Used for every product today — image gallery with zoom, and the info panel (price, description, metafields, buy button).",
        previewPath: "/products/elation-sauna",
        variableSegment: {
          label: "Preview a different product (handle)",
          placeholder: "elation-sauna",
          basePath: "/products/",
        },
      },
      {
        id: "enhanced-product",
        label: "Enhanced Product Template",
        description:
          "Same gallery with zoom, but the scrolling banner sits at the top of the info column and an \"Enhance Your Experience\" add-ons section (with a live-updating total) appears below the description.",
        previewPath: "/products/template-b/georgian-cabin-sauna",
        variableSegment: {
          label: "Preview a different product (handle)",
          placeholder: "georgian-cabin-sauna",
          basePath: "/products/template-b/",
        },
      },
    ],
  },
  "promos-ads": {
    label: "Promos/Ads",
    templates: [],
  },
};
