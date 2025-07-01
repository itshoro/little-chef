import * as Form from "@/components/forms/form";
import { SubmitWithPending } from "@/components/forms/form/submit-with-pending";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { getCollectionPreferences } from "@/lib/services/user";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Inputs } from "../../../(user)/settings/collection/collection-form/inputs";
import { createAction } from "./action";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";

export const metadata: Metadata = {
  title: "Add Collection",
};

const Page = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user, session } = await getAuthenticatedUserFromRequest();

  if (!user) redirect("/login");
  const preferences = await getCollectionPreferences(user);

  return (
    <>
      <Form.Root action={createAction}>
        <div className="grid gap-4">
          <input type="hidden" name="sessionId" value={session?.id} />
          <Inputs
            defaultValue={{ visibility: preferences.defaultVisibility }}
          />
          <Form.Alert />
          <div className="flex justify-end py-4">
            <SubmitWithPending className="pointer-events-auto cursor-pointer rounded-2xl bg-lime-300 px-4 py-3 font-medium text-black">
              <div className="inline-flex items-center gap-1 transition-transform group-active:translate-y-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="var(--color-lime-800)"
                  className="size-4"
                >
                  <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                </svg>
                <span>Add Collection</span>
              </div>
            </SubmitWithPending>
          </div>
        </div>
      </Form.Root>
    </>
  );
};

export default Page;
