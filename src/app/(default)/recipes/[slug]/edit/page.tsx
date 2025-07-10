import { getAuthenticatedUserOrRedirect } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { getRecipeDetailByIdentifier } from "@/lib/services/recipe";
import { parseHandle } from "@/lib/slug";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { RecipeForm } from "../../_components/recipe-form";
import { editAction } from "./action";

type EditRecipePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata: Metadata = {
  title: "Editing Recipe",
};

const EditRecipePage = async (props: EditRecipePageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const params = await props.params;
  const { publicId } = parseHandle(params.slug);
  const { user } = await getAuthenticatedUserOrRedirect();

  if (!user) redirect("/login");

  try {
    const recipe = await getRecipeDetailByIdentifier({ publicId }, user);

    return (
      <RecipeForm
        action={editAction}
        defaultValue={recipe}
        buttonLabel="Save"
      />
    );
  } catch (e) {
    if (e instanceof Error) {
      notFound();
    }
  }
};

export default EditRecipePage;
