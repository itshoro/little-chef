import * as Form from "@/app/components/form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import { validateRequest } from "@/lib/auth";
import { getCollection } from "@/lib/dal/collections";
import { extractParts } from "@/lib/slug";
import { notFound, redirect } from "next/navigation";
import { Inputs } from "../../components/collection-form/inputs";
import { editAction } from "./action";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const Page = async (props: PageProps) => {
  const params = await props.params;
  const { publicId } = extractParts(params.slug);
  const { user, session } = await validateRequest();

  if (!user) redirect("/login");

  try {
    const collection = await getCollection({ publicId }, user);

    return (
      <>
        <Form.Root action={editAction}>
          <input type="hidden" name="sessionId" value={session?.id} />
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
