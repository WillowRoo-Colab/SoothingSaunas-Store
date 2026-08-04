import { NavItemFormFields } from "@/components/admin/NavItemFormFields";
import { createNavItemAction } from "../../actions";
import type { FooterGroupLabel } from "@/lib/navItems";

const VALID_GROUPS: FooterGroupLabel[] = ["Shop", "Learn", "Support", "Company"];

export default async function NewFooterNavItemPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group } = await searchParams;
  const defaultGroupLabel = VALID_GROUPS.find((g) => g === group);

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-lg text-charcoal">New footer nav item</h2>

      <form action={createNavItemAction} className="mt-6">
        <NavItemFormFields location="footer" defaultGroupLabel={defaultGroupLabel} />
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
