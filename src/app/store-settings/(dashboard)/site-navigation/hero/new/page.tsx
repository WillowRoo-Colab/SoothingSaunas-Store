import { NavItemFormFields } from "@/components/admin/NavItemFormFields";
import { createNavItemAction } from "../../actions";

export default function NewHeroNavItemPage() {
  return (
    <div className="max-w-lg">
      <h2 className="font-display text-lg text-charcoal">New hero button</h2>

      <form action={createNavItemAction} className="mt-6">
        <NavItemFormFields location="hero" />
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
