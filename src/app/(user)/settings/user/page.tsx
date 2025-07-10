import { getAuthenticatedUserOrRedirect } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import type { Metadata } from "next";
import { UpdateAvatar } from "./_components/update-avatar-form";
import { UpdatePasswordForm } from "./_components/update-password-form";
import { UpdateUsername } from "./_components/update-username-form";

export const metadata: Metadata = {
  title: "User Preferences",
};

const UserPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await getAuthenticatedUserOrRedirect();

  return (
    <>
      <UpdateAvatar defaultValue={user?.avatar ?? undefined} />
      <UpdateUsername defaultValue={user.username} />
      <UpdatePasswordForm />
    </>
  );
};

export default UserPage;
