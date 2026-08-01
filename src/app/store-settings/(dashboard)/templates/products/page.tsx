import { TEMPLATE_CATEGORIES } from "@/lib/templates";
import { TemplateGallery } from "@/components/admin/TemplateGallery";

export default function ProductTemplatesPage() {
  const { label, templates } = TEMPLATE_CATEGORIES.products;
  return <TemplateGallery categoryLabel={label} templates={templates} />;
}
