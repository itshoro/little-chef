import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import { getHistoryPreferences } from "@/lib/utils/user/get-preferences";
import type { Metadata } from "next";
import { UpdateRecipeHistoryEnabledForm } from "./_components/update-recipe-history-enabled-form";

export const metadata: Metadata = {
  title: "History Preferences",
};

const CollectionSettingsPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await requireSession({
    onUnauthenticated: () => redirectToSignIn("/settings/history"),
  });
  const preferencesRes = await getHistoryPreferences(user);
  if (!preferencesRes.ok) throw preferencesRes.error;

  return (
    <>
      <UpdateRecipeHistoryEnabledForm preferences={preferencesRes.value} />
    </>
  );
};

export default CollectionSettingsPage;
