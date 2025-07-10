import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { getCollectionPreferences } from "@/lib/services/user";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CollectionForm } from "../_components/collection-form";
import { createAction } from "./action";

export const metadata: Metadata = {
  title: "Add Collection",
};

const Page = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user } = await getAuthenticatedUserFromRequest();

  if (!user) redirect("/login");
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
