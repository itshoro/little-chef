import { RecipeCard } from "@/app/(search)/components/recipe-card";
import { BackLink } from "@/app/components/back-link";
import { NoRecipesStored } from "@/app/components/fallbacks/collections/no-recipe-stored";
import { Header } from "@/app/components/header/header";
import {
  getCollection,
  getCreatorsAndMaintainers,
  getRecipeIds,
} from "@/lib/dal/collections";
import { extractParts, generateSlugPathSegment } from "@/lib/slug";
import { notFound, redirect } from "next/navigation";
import type { ResolvedMetadata, Metadata } from "next";
import { AvatarStack } from "@/app/components/header/avatar-stack";
import { generateAttribution } from "@/lib/utils";
import { Section } from "@/app/recipes/[slug]/components/section";
import { validateRequest } from "@/lib/auth/lucia";

type CollectionPageProps = { params: { slug: string } };

export async function generateMetadata(
  { params }: CollectionPageProps,
  parent: ResolvedMetadata,
): Promise<Metadata> {
  try {
    const { publicId } = extractParts(params.slug);
    const collection = await getCollection({ publicId });

    return { title: collection.name };
  } catch {
    return parent as Metadata;
  }
}

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { slug, publicId } = extractParts(params.slug);
  const { user } = await validateRequest();

  try {
    const collection = await getCollection({ publicId }, user?.publicId);
    if (slug !== collection.slug) {
      redirect(
        `/collections/${generateSlugPathSegment(collection.slug, publicId)}`,
      );
    }

    const maintainers = await getCreatorsAndMaintainers(collection.id);
    const recipeIds = await getRecipeIds(collection.id);

    const attribution = generateAttribution(maintainers);

    const isMaintainer = maintainers
      .map((maintainer) => maintainer.publicId)
      .includes(user?.publicId);

    return (
      <>
        <Header>
          <div className="flex items-center gap-2">
            <BackLink />
          </div>
        </Header>

        <div className="p-4">
          <h1 className="font-medium">{collection.name}</h1>
          <div className="flex items-center gap-3 text-sm">
            <span>By </span>
            <div className="flex items-center gap-1">
              <AvatarStack users={maintainers} />
              <span>{attribution}</span>
            </div>
          </div>
        </div>

        <div className="px-4">
          {isMaintainer && <Section title="Maintainer Actions"></Section>}
          <Section title="Recipes">
            <RecipeList ids={recipeIds} />
          </Section>
        </div>
      </>
    );
  } catch (e) {
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
    <ul className="space-y-2">
      {ids.map((id) => (
        <li key={id.publicId}>
          <RecipeCard {...id} />
        </li>
      ))}
    </ul>
  );
};

export default CollectionPage;
