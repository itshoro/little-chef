import { BackLink } from "@/app/components/back-link";
import { Header } from "@/app/components/header/header";
import { validateRequest } from "@/lib/auth/lucia";
import {
  collectionDtoFromFormData,
  getCollection,
  updateCollection,
} from "@/lib/dal/collections";
import { extractParts, generateSlugPathSegment } from "@/lib/slug";
import { notFound, redirect } from "next/navigation";
import * as Form from "../../components/collection-form";
import { FormContext } from "@/app/components/form/root";
import { authorizeFromSession } from "@/lib/dal/user";
import { UpdateCollectionValidator } from "@/lib/dal/validators";

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
        <Header>
          <div className="flex items-center gap-2">
            <BackLink />
          </div>
        </Header>
        <div className="p-4">
          <Form.Root action={update}>
            <input type="hidden" name="sessionId" value={session?.id} />
            <input type="hidden" name="publicId" value={collection.publicId} />
            <div className="grid gap-4">
              <Form.Inputs defaultValue={collection} />
              <Form.Submit>Update Collection</Form.Submit>
            </div>
          </Form.Root>
        </div>
      </>
    );
  } catch {
    notFound();
  }
};

async function update(_: FormContext, formData: FormData) {
  "use server";
  const sessionId = formData.get("sessionId");
  const user = await authorizeFromSession(sessionId);
  const dto = collectionDtoFromFormData(formData, UpdateCollectionValidator);

  if (!dto.success) {
    return {
      success: false,
      error: Object.entries(
        dto.error.flatten((issue) => issue.message).fieldErrors,
      ).flatMap((kvp) => [`${kvp[0]}: ${kvp[1]}`]),
    };
  }

  const collection = await updateCollection(dto.data, user);

  redirect(
    `/collections/${generateSlugPathSegment(collection.slug, collection.publicId)}`,
  );
}

export default Page;
