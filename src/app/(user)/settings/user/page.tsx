import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import type { Metadata } from "next";
import { UpdateAvatar } from "./_components/update-avatar-form";
import { UpdatePasswordForm } from "./_components/update-password-form";
import { UpdateUsername } from "./_components/update-username-form";

export const metadata: Metadata = {
  title: "User Preferences",
};

const UserPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user } = await requireSession({
    onUnauthenticated: () => redirectToSignIn("/settings"),
  });

  return (
    <>
      <UpdateAvatar defaultValue={user.avatar?.url} />
      <UpdateUsername defaultValue={user.username} />
      <UpdatePasswordForm />
    </>
  );
};

export default UserPage;
