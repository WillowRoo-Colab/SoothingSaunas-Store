import { TEMPLATE_CATEGORIES } from "@/lib/templates";
import { TemplateGallery } from "@/components/admin/TemplateGallery";

export default function PromosAdsTemplatesPage() {
  const { label, templates } = TEMPLATE_CATEGORIES["promos-ads"];
  return <TemplateGallery categoryLabel={label} templates={templates} />;
}
