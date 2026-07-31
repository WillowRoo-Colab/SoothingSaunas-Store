import { listAdminProfiles, requireRole } from "@/lib/supabase/auth";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { inviteAdmin, updateAdminRole, setAdminStatus } from "./actions";

export default async function AdminsPage() {
  const { user: currentUser } = await requireRole("owner");
  const admins = await listAdminProfiles();

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <section>
        <h2 className="font-display text-lg text-charcoal">Invite an admin</h2>
        <form action={inviteAdmin} className="mt-3 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded border border-silver px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue="editor"
              className="rounded border border-silver px-3 py-2 text-sm"
            >
              <option value="editor">Editor</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
          >
            Send invite
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg text-charcoal">All admins</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-silver text-charcoal/60">
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 pr-4 font-medium">Role</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">2FA</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.userId} className="border-b border-silver/60">
                <td className="py-2 pr-4">{admin.email}</td>
                <td className="py-2 pr-4">
                  <form action={updateAdminRole} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={admin.userId} />
                    <select
                      name="role"
                      defaultValue={admin.role}
                      className="rounded border border-silver px-2 py-1 text-xs"
                    >
                      <option value="editor">Editor</option>
                      <option value="owner">Owner</option>
                    </select>
                    <button
                      type="submit"
                      className="text-xs font-medium text-charcoal/70 underline hover:text-charcoal"
                    >
                      Save
                    </button>
                  </form>
                </td>
                <td className="py-2 pr-4 capitalize">{admin.status}</td>
                <td className="py-2 pr-4">{admin.mfaEnrolled ? "Enrolled" : "Not enrolled"}</td>
                <td className="py-2">
                  {admin.userId === currentUser.id ? (
                    <span className="text-xs text-charcoal/50">This is you</span>
                  ) : admin.status === "suspended" ? (
                    <form action={setAdminStatus}>
                      <input type="hidden" name="userId" value={admin.userId} />
                      <input type="hidden" name="status" value="active" />
                      <button
                        type="submit"
                        className="text-xs font-medium text-charcoal/70 underline hover:text-charcoal"
                      >
                        Reactivate
                      </button>
                    </form>
                  ) : (
                    <form action={setAdminStatus}>
                      <input type="hidden" name="userId" value={admin.userId} />
                      <input type="hidden" name="status" value="suspended" />
                      <ConfirmSubmitButton
                        confirmMessage={`Suspend ${admin.email}? They'll immediately lose access.`}
                        className="text-xs font-medium text-red-600 underline hover:text-red-700"
                      >
                        Suspend
                      </ConfirmSubmitButton>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
