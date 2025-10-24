import { needsActivityUpdate } from "@/domain/auth/session";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import {
  redirectToSignIn,
  redirectToVerify,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { forbidden } from "next/navigation";

const AdminPanel = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user, session } = await requireSession({
    onUnauthenticated: () => redirectToSignIn("/admin"),
  });

  if (user.role !== "admin") forbidden();

  if (needsActivityUpdate(session, new Date(), 15 * 60 * 1000)) {
    redirectToVerify("/admin");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Admin Panel</h1>
      <p className="text-lg">Welcome, {user.username}!</p>
    </div>
  );
};

export default AdminPanel;
