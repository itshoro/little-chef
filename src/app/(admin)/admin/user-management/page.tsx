import { Avatar } from "@/components/users/avatar";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { forbidden, redirect } from "next/navigation";
import { RequestPasswordResetActionForm } from "./_components/request-password-reset-form";
import {
  getAuthenticatedUserFromRequest,
  hasSessionScopes,
} from "@/lib/services/auth";
import { hasUserRoles } from "@/lib/services/user";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";

async function getUsers() {
  return db.select().from(users);
}

const UserManagementPage = async () => {
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

  const users = await getUsers();

  return (
    <>
      <h1>All Users</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th></th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {user.avatar && (
                  <Avatar alt="" size="size-10" src={user.avatar} />
                )}
              </td>
              <td>{user.username}</td>
              <td>
                <RequestPasswordResetActionForm userId={user.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserManagementPage;
