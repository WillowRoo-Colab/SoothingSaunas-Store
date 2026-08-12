import { TEMPLATE_CATEGORIES } from "@/lib/templates";
import { TemplateGallery } from "@/components/admin/TemplateGallery";
import { listAllProducts } from "@/lib/shopify/products";

export default async function ProductTemplatesPage() {
  const { label, templates } = TEMPLATE_CATEGORIES.products;
  const handleOptions = await listAllProducts();

  return (
    <TemplateGallery
      categoryLabel={label}
      templates={templates}
      handleOptions={handleOptions}
    />
  );
}
