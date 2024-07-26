import { RecipeCard } from "@/app/(search)/components/recipe-card";
import { BackLink } from "@/app/components/BackLink";
import { Header } from "@/app/components/header/header";
import { getCollection, getRecipeIds } from "@/lib/dal/collections";
import { extractParts, generateSlugPathSegment } from "@/lib/slug";
import { notFound, redirect } from "next/navigation";

const CollectionPage = async ({ params }: { params: { slug: string } }) => {
  const { slug, publicId } = extractParts(params.slug);

  try {
    const collection = await getCollection({ publicId });

    if (slug !== collection.slug) {
      redirect(
        `/collections/${generateSlugPathSegment(collection.slug, publicId)}`,
      );
    }

    const recipeIds = await getRecipeIds(collection.id);

    return (
      <>
        <Header>
          <div className="flex items-center gap-2">
            <BackLink href="/collections" />
            <h1>{collection.name}</h1>
          </div>
        </Header>

        <RecipeList ids={recipeIds} />
      </>
    );
  } catch (e) {
    console.error(e);
    notFound();
  }
};

const RecipeList = async ({
  ids,
}: {
  ids: { id: number; publicId: string }[];
}) => {
  if (ids.length === 0) return <NoRecipes />;

  return (
    <ul>
      {ids.map((id) => (
        <li key={id.publicId}>
          <RecipeCard {...id} />
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
