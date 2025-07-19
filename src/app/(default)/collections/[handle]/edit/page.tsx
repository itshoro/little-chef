import { getAuthenticatedUserOrRedirect } from "@/lib/services/auth";
import { getCollectionDetailByIdentifier } from "@/lib/services/collection";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { parseHandle } from "@/lib/slug";
import { notFound } from "next/navigation";
import { CollectionForm } from "../../_components/collection-form";
import { editAction } from "./action";

type PageProps = {
  params: Promise<{
    handle: string;
  }>;
};

const Page = async (props: PageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user } = await getAuthenticatedUserOrRedirect();

  const params = await props.params;
  const { publicId } = parseHandle(params.handle);

  try {
    const { collection } = await getCollectionDetailByIdentifier(
      { publicId },
      user,
    );

    return (
      <>
        <CollectionForm
          defaultValue={collection}
          action={editAction}
          buttonLabel="Save"
        />
      </>
    );
  } catch {
    notFound();
  }
};

export default Page;
