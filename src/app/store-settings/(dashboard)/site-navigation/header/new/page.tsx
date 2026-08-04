import { getNavItem } from "@/lib/navItems";
import { NavItemFormFields } from "@/components/admin/NavItemFormFields";
import { createNavItemAction } from "../../actions";

export default async function NewHeaderNavItemPage({
  searchParams,
}: {
  searchParams: Promise<{ parentId?: string; columnIndex?: string }>;
}) {
  const { parentId, columnIndex } = await searchParams;
  const parent = parentId ? await getNavItem(parentId) : null;

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-lg text-charcoal">
        {parent ? `New link in ${parent.title}'s submenu` : "New header nav item"}
      </h2>

      <form action={createNavItemAction} className="mt-6">
        <NavItemFormFields
          location="header"
          parentId={parent?.id}
          columnIndex={columnIndex ? Number(columnIndex) : undefined}
          parentColumnCount={parent?.columnCount ?? undefined}
        />
        <button
          type="submit"
          className="mt-6 rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
        >
          Create item
        </button>
      </form>
    </div>
  );
}
