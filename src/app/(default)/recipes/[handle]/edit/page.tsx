import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { parseHandle } from "@/lib/slug";
import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { getRecipeDetail } from "@/lib/utils/recipe/get-recipe-detail";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipeForm } from "../../_components/recipe-form";
import { editAction } from "./action";

type EditRecipePageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export const metadata: Metadata = {
  title: "Editing Recipe",
};

const EditRecipePage = async (props: EditRecipePageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const params = await props.params;
  const { publicId } = parseHandle(params.handle);

  const { user } = await requireSession({
    onUnauthenticated: () => redirectToSignIn(`/recipes/${params.handle}/edit`),
  });

  // todo: new use case that checks if user can edit while fetching recipe detail
  const recipeResult = await getRecipeDetail({ publicId }, user);
  if (!recipeResult.ok) throw recipeResult.error;

  const recipe = recipeResult.value;
  if (!recipe) notFound();

  return (
    <RecipeForm action={editAction} defaultValue={recipe} buttonLabel="Save" />
  );
};

export default EditRecipePage;
