import { RecipeCard } from "@/app/(search)/components/recipe-card";
import { BackLink } from "@/app/components/back-link";
import { NoRecipesStored } from "@/app/components/fallbacks/collections/no-recipe-stored";
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
            <BackLink />
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
  if (ids.length === 0) return <NoRecipesStored />;

  return (
    <ul className="space-y-2 p-4">
      {ids.map((id) => (
        <li key={id.publicId}>
          <RecipeCard {...id} />
        </li>
      ))}
    </ul>
  );
};

export default CollectionPage;
