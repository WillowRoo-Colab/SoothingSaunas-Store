import { TEMPLATE_CATEGORIES } from "@/lib/templates";
import { TemplateGallery } from "@/components/admin/TemplateGallery";
import { getCollections } from "@/lib/shopify/collections";

export default async function CollectionTemplatesPage() {
  const { label, templates } = TEMPLATE_CATEGORIES.collections;
  const collections = await getCollections(100);
  const handleOptions = collections.map(({ handle, title }) => ({ handle, title }));

  return (
    <TemplateGallery
      categoryLabel={label}
      templates={templates}
      handleOptions={handleOptions}
    />
  );
}
