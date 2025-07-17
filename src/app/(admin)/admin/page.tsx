import {
  getAuthenticatedUserFromRequest,
  hasSessionScopes,
} from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { hasUserRoles } from "@/lib/services/user";
import { forbidden, redirect } from "next/navigation";

const AdminPanel = async () => {
  // todo: extract verification logic for re-use in other admin pages
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user, session } = await getAuthenticatedUserFromRequest();

  if (!user) redirect("/login");
  if (!(await hasUserRoles(user, ["admin"]))) forbidden();

  // todo: consider extending the scope lifetime if already present
  if (!(await hasSessionScopes(session, ["sudo"]))) {
    const params = new URLSearchParams();
    params.set("redirect", "/admin");
    params.set("scope", "sudo");

    redirect(`/verify?${params.toString()}`);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Admin Panel</h1>
      <p className="text-lg">Welcome, {user.username}!</p>
    </div>
  );
};

export default AdminPanel;
