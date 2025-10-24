import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import { getCollectionPreferences } from "@/lib/utils/user/get-preferences";
import type { Metadata } from "next";
import { UpdateDefaultVisibilityForm } from "./_components/update-default-visibility-form";

export const metadata: Metadata = {
  title: "Collection Preferences",
};

const CollectionSettingsPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await requireSession({
    onUnauthenticated: () => redirectToSignIn("/settings/collection"),
  });
  const preferences = await getCollectionPreferences(user);

  return (
    <>
      <UpdateDefaultVisibilityForm preferences={preferences} />
    </>
  );
};

export default CollectionSettingsPage;
