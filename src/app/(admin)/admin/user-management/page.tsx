import { Avatar } from "@/components/users/avatar";
import { needsActivityUpdate } from "@/domain/auth/session";
import { db } from "@/drizzle/db";
import { fileReference, users } from "@/drizzle/schema";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import {
  redirectToSignIn,
  redirectToVerify,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { eq } from "drizzle-orm";
import { forbidden } from "next/navigation";
import { RequestPasswordResetActionForm } from "./_components/request-password-reset-form";

async function getUsers() {
  return db
    .select()
    .from(users)
    .leftJoin(fileReference, eq(fileReference.id, users.avatarId));
}

const UserManagementPage = async () => {
  // todo: extract verification logic for re-use in other admin pages
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user, session } = await requireSession({
    onUnauthenticated: () => redirectToSignIn("/admin/user-management"),
  });

  if (user.role !== "admin") forbidden();

  if (needsActivityUpdate(session, new Date(), 15 * 60 * 1000)) {
    redirectToVerify("/admin");
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
            <tr key={user.users.id}>
              <td>{user.users.id}</td>
              <td>
                {user.file_references && (
                  <Avatar
                    alt=""
                    size="size-10"
                    src={user.file_references.url}
                  />
                )}
              </td>
              <td>{user.users.username}</td>
              <td>
                <RequestPasswordResetActionForm userId={user.users.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserManagementPage;
