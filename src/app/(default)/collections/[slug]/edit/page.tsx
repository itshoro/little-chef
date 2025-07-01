import * as Form from "@/components/forms/form";
import { SubmitWithPending } from "@/components/forms/form/submit-with-pending";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { parseHandle } from "@/lib/slug";
import { notFound, redirect } from "next/navigation";
import { Inputs } from "../../../../(user)/settings/collection/collection-form/inputs";
import { editAction } from "./action";
import { getAuthenticatedUserOrRedirect } from "@/lib/services/auth";
import { getCollectionDetailByIdentifier } from "@/lib/services/collection";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const Page = async (props: PageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const params = await props.params;
  const { publicId } = parseHandle(params.slug);
  console.error({ publicId });
  const { user } = await getAuthenticatedUserOrRedirect();

  try {
    const { collection } = await getCollectionDetailByIdentifier(
      { publicId },
      user,
    );

    return (
      <>
        <Form.Root action={editAction}>
          <input type="hidden" name="publicId" value={collection.publicId} />
          <div className="grid gap-4">
            <Inputs defaultValue={collection} />
            <Form.Alert />
            <SubmitWithPending>Update Collection</SubmitWithPending>
          </div>
        </Form.Root>
      </>
    );
  } catch {
    notFound();
  }
};

export default Page;
