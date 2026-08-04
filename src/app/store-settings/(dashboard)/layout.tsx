import Image from "next/image";
import Link from "next/link";
import { SettingsSidebar } from "@/components/admin/SettingsSidebar";
import { signOut } from "./actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between border-b border-silver px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Back to homepage">
            <Image
              src="/Gold-Transparent-LogoWords.png"
              alt="Soothing Saunas"
              width={924}
              height={563}
              className="h-8 w-auto"
            />
          </Link>
          <h1 className="font-display text-xl text-charcoal">Store Settings</h1>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-charcoal/70 underline hover:text-charcoal"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="flex flex-1">
        <SettingsSidebar />
        <main className="flex-1 px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
