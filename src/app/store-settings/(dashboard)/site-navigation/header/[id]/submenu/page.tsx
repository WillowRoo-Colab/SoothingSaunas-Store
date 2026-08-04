import Link from "next/link";
import { notFound } from "next/navigation";
import { getNavItem, listNavItemChildren } from "@/lib/navItems";
import { NavItemsTable } from "@/components/admin/NavItemsTable";

export default async function HeaderSubmenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parent = await getNavItem(id);
  if (!parent || !parent.isDropdown) notFound();

  const children = await listNavItemChildren(id);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-charcoal">
          Submenu — {parent.title}
        </h2>
        <Link
          href={`/store-settings/site-navigation/header/${id}`}
          className="text-xs font-medium text-charcoal/70 underline hover:text-charcoal"
        >
          Edit dropdown settings
        </Link>
      </div>
      <p className="mt-1 text-sm text-charcoal/70">
        Links shown in each column of the &quot;{parent.title}&quot; dropdown,
        in the order they appear. Change the number of columns or their
        headings from &quot;Edit dropdown settings&quot; above.
      </p>

      <div className="mt-6 flex flex-col gap-8">
        {parent.columnHeadings.map((heading, i) => {
          const columnIndex = i + 1;
          return (
            <div key={columnIndex}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
                  {heading}
                </h3>
                <Link
                  href={`/store-settings/site-navigation/header/new?parentId=${id}&columnIndex=${columnIndex}`}
                  className="text-xs font-medium text-charcoal/70 underline hover:text-charcoal"
                >
                  + New in {heading}
                </Link>
              </div>
              <div className="mt-2">
                <NavItemsTable
                  items={children.filter((child) => child.columnIndex === columnIndex)}
                  location="header"
                  parentId={id}
                  emptyMessage={`No links in ${heading} yet.`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
