import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { getCollectionPreferences } from "@/lib/utils/user/get-preferences";
import type { Metadata } from "next";
import { CollectionForm } from "../_components/collection-form";
import { createAction } from "./action";

export const metadata: Metadata = {
  title: "Add Collection",
};

const Page = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user } = await requireSession({
    onUnauthenticated: () => redirectToSignIn("/collections/add"),
  });
  const preferences = await getCollectionPreferences(user);

  return (
    <>
      <CollectionForm
        action={createAction}
        defaultValue={{ visibility: preferences.defaultVisibility }}
        buttonLabel="Create Collection"
      />
    </>
  );
};

export default Page;
