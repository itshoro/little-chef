import { parseHandle } from "@/lib/slug";
import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { getCollectionDetail } from "@/lib/utils/collection/get-collection-detail";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
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

  const params = await props.params;
  const { publicId } = parseHandle(params.handle);

  const { user } = await requireSession({
    onUnauthenticated: () =>
      redirectToSignIn(`/collections/${params.handle}/edit`),
  });

  const collectionResult = await getCollectionDetail({ publicId }, user);
  if (!collectionResult.ok) notFound();

  return (
    <CollectionForm
      defaultValue={collectionResult.value}
      action={editAction}
      buttonLabel="Save"
    />
  );
};

export default Page;
