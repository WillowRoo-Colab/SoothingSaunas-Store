import { TEMPLATE_CATEGORIES } from "@/lib/templates";
import { TemplateGallery } from "@/components/admin/TemplateGallery";

export default function CollectionTemplatesPage() {
  const { label, templates } = TEMPLATE_CATEGORIES.collections;
  return <TemplateGallery categoryLabel={label} templates={templates} />;
}
