import { Avatar } from "@/components/users/avatar";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { validateRequest } from "@/lib/auth";
import {
  findUsers,
  sessionHasActiveScopes,
  userHasScopes,
} from "@/lib/dal/user";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { forbidden, redirect } from "next/navigation";
import { RequestPasswordResetActionForm } from "./actions/request-password-reset/form";

const UserManagementPage = async () => {
  // todo: extract verification logic for re-use in other admin pages
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user, session } = await validateRequest();

  if (!user) redirect("/login");
  if (!(await userHasScopes(user, ["admin"]))) forbidden();

  // todo: consider extending the scope lifetime if already present
  if (!(await sessionHasActiveScopes(session, ["sudo"]))) {
    const params = new URLSearchParams();
    params.set("redirect", "/admin");
    params.set("scope", "sudo");

    redirect(`/verify?${params.toString()}`);
  }

  const users = await findUsers("%", 20);

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
