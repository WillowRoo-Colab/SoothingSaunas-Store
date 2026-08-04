import { notFound } from "next/navigation";
import { getNavItem } from "@/lib/navItems";
import { NavItemFormFields } from "@/components/admin/NavItemFormFields";
import { updateNavItemAction } from "../../actions";

export default async function EditHeaderNavItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNavItem(id);
  if (!item) notFound();

  const parent = item.parentId ? await getNavItem(item.parentId) : null;
  const boundUpdate = updateNavItemAction.bind(null, id);

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-lg text-charcoal">
        {parent ? `Edit link in ${parent.title}'s submenu` : "Edit header nav item"}
      </h2>

      <form action={boundUpdate} className="mt-6">
        <NavItemFormFields
          location="header"
          navItem={item}
          parentColumnCount={parent?.columnCount ?? undefined}
        />
        <button
          type="submit"
          className="mt-6 rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
