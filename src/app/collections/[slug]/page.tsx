import { RecipeCard } from "@/app/(search)/components/recipe-card";
import { BackLink } from "@/app/components/BackLink";
import { Header } from "@/app/components/header/header";
import { validateRequest } from "@/lib/auth/lucia";
import { getAppPreferences } from "@/lib/dal/app";
import { getCollection, getRecipeIds } from "@/lib/dal/collections";
import { extractParts } from "@/lib/slug";
import { notFound, redirect } from "next/navigation";

const CollectionPage = async ({ params }: { params: { slug: string } }) => {
  const { slug, publicId } = extractParts(params.slug);

  const { user } = await validateRequest();
  const appPreferences = user ? await getAppPreferences(user.id) : undefined;
  const displayLanguageCode = appPreferences?.displayLanguageCode ?? "en";

  try {
    const collection = await getCollection({ publicId }, displayLanguageCode);

    if (slug !== collection.slug.value) {
      redirect(`/collections/${collection.slug.value}-${publicId}`);
    }

    const recipeIds = await getRecipeIds(collection.collections.id);

    return (
      <>
        <Header>
          <div className="flex items-center gap-2">
            <BackLink href="/collections" />
            <h1>{collection.name.value}</h1>
          </div>
        </Header>

        <RecipeList ids={recipeIds} displayLanguageCode={displayLanguageCode} />
      </>
    );
  } catch (e) {
    console.error(e);
    notFound();
  }
};

const RecipeList = async ({
  ids,
  displayLanguageCode,
}: {
  ids: { id: number; publicId: string }[];
  displayLanguageCode: string;
}) => {
  if (ids.length === 0) return <NoRecipes />;

  return (
    <ul>
      {ids.map((id) => (
        <li key={id.publicId}>
          <RecipeCard {...id} displayLanguage={displayLanguageCode} />
        </li>
      ))}
    </ul>
  );
};

const NoRecipes = () => {
  return (
    <div className="flex h-full select-none flex-col items-center justify-center gap-4 text-center font-medium">
      <div className="text-6xl">🍽️</div>
      <div className="text-lg">You haven't stored a recipe yet.</div>
    </div>
  );
};

export default CollectionPage;
