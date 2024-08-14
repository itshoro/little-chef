import { RecipeCard } from "@/app/(search)/components/recipe-card";
import { BackLink } from "@/app/components/back-link";
import { NoRecipesStored } from "@/app/components/fallbacks/collections/no-recipe-stored";
import { Header } from "@/app/components/header/header";
import {
  getCollection,
  getCreatorsAndMaintainers,
  getRecipeIds,
  isCollectionLiked,
  removeRecipe,
} from "@/lib/dal/collections";
import { extractParts, generateSlugPathSegment } from "@/lib/slug";
import { notFound, redirect } from "next/navigation";
import type { ResolvedMetadata, Metadata } from "next";
import { AvatarStack } from "@/app/components/header/avatar-stack";
import { generateAttribution } from "@/lib/utils";
import { Section } from "@/app/recipes/[slug]/components/section";
import { validateRequest } from "@/lib/auth/lucia";
import { DeleteButton } from "./components/delete-button";
import { EditButton } from "./components/edit-button";
import { OptimisticLikeButton } from "./components/optimistic-like-button";
import {
  addCollectionLike,
  authorizeFromSession,
  removeCollectionLike,
} from "@/lib/dal/user";
import { revalidatePath } from "next/cache";
import { BaseButton } from "@/app/components/base-button";

type CollectionPageProps = { params: { slug: string } };

export async function generateMetadata(
  { params }: CollectionPageProps,
  parent: ResolvedMetadata,
): Promise<Metadata> {
  try {
    const { publicId } = extractParts(params.slug);
    const collection = await getCollection({ publicId }, null);

    return { title: collection.name };
  } catch {
    return parent as Metadata;
  }
}

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { slug, publicId } = extractParts(params.slug);
  const { user } = await validateRequest();

  try {
    const collection = await getCollection({ publicId }, user);
    if (slug !== collection.slug) {
      redirect(
        `/collections/${generateSlugPathSegment(collection.slug, publicId)}`,
      );
    }

    const maintainers = await getCreatorsAndMaintainers(collection.id);
    const attribution = generateAttribution(maintainers);

    const isMaintainer = maintainers
      .map((maintainer) => maintainer.publicId)
      .includes(user?.publicId);

    const isLiked = user
      ? await isCollectionLiked(user?.publicId, collection.id)
      : false;

    return (
      <>
        <Header>
          <div className="flex items-center gap-2">
            <BackLink />
          </div>
        </Header>

        <div className="p-4">
          <h1 className="font-medium">{collection.name}</h1>
          <div className="flex justify-between">
            <div className="flex items-center gap-3 text-sm">
              <span>By </span>
              <div className="flex items-center gap-1">
                <AvatarStack users={maintainers} />
                <span>{attribution}</span>
              </div>
            </div>
            <div>
              <OptimisticLikeButton
                action={async (type) => {
                  "use server";
                  if (!user) throw new Error("No session available");

                  if (type === "add") {
                    const count = await addCollectionLike(user, collection.id);
                    revalidatePath("/collections", "page");
                    return { count, isLiked: true };
                  } else {
                    const count = await removeCollectionLike(
                      user,
                      collection.id,
                    );
                    revalidatePath("/collections", "page");
                    return { count, isLiked: false };
                  }
                }}
                disabled={user === null}
                isLiked={isLiked}
                count={collection.likes}
              />
            </div>
          </div>
        </div>

        <div className="px-4">
          {isMaintainer && (
            <Section title="Maintainer Actions">
              <div className="flex items-center gap-4">
                <EditButton slug={params.slug} />
                <DeleteButton collectionId={collection.id} />
              </div>
            </Section>
          )}
          <Section title="Recipes">
            <RecipeList collection={collection} isMaintainer={isMaintainer} />
          </Section>
        </div>
      </>
    );
  } catch (e) {
    notFound();
  }
};

const RecipeList = async ({
  collection,
  isMaintainer,
}: {
  collection: { id: number; publicId: string };
  isMaintainer: boolean;
}) => {
  const { session } = await validateRequest();

  const recipeIds = await getRecipeIds(collection.id);

  if (recipeIds.length === 0)
    return (
      <div className="py-12">
        <NoRecipesStored />
      </div>
    );

  return (
    <ul className="space-y-2">
      {recipeIds.map((id) => (
        <li key={id.publicId}>
          <div className="rounded-xl border dark:border-none dark:bg-stone-950">
            <RecipeCard {...id} />
            {isMaintainer && (
              <div className="p-2">
                <form
                  action={removeRecipeFromCollection.bind(
                    null,
                    session?.id,
                    collection.publicId,
                    id.publicId,
                  )}
                >
                  <BaseButton type="submit">Remove</BaseButton>
                </form>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

async function removeRecipeFromCollection(
  sessionId: string | undefined,
  collectionPublicId: string,
  recipePublicId: string,
) {
  "use server";
  const user = await authorizeFromSession(sessionId);

  await removeRecipe(collectionPublicId, recipePublicId, user);
}

export default CollectionPage;
