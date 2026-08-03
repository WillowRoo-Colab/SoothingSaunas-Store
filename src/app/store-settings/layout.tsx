// The admin UI is intentionally light-themed, independent of the
// storefront's dark default (globals.css sets body to charcoal/cream so
// storefront gaps never flash white). Without this override every page
// under /store-settings — including login/verify/accept-invite/reset-
// password, which sit outside the (dashboard) group's own layout — would
// inherit that dark default instead.
export default function StoreSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream text-charcoal">{children}</div>
  );
}
