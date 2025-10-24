import { NoRecipesStored } from "@/components/collections/fallbacks/no-recipe-stored";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { Button } from "@/components/ui/buttons/button";
import { AvatarStack } from "@/components/users/avatar-stack";

import { LinkButton } from "@/components/ui/buttons/link-button";
import { Section } from "@/components/ui/section";
import type { Collection } from "@/domain/collection/collection";
import type { Recipe } from "@/domain/recipe/recipe";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import { generateHandle, parseHandle } from "@/lib/slug";
import { generateAttribution } from "@/lib/utils/attribution";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { getCollectionDetail } from "@/lib/utils/collection/get-collection-detail";
import type { Metadata, ResolvedMetadata } from "next";
import { notFound } from "next/navigation";
import { DeleteCollectionButton } from "./_components/delete-button";
import { removeRecipeFromCollectionAction } from "./remove-recipe-action";

type CollectionPageProps = { params: Promise<{ handle: string }> };

export async function generateMetadata(
  props: CollectionPageProps,
  parent: ResolvedMetadata,
): Promise<Metadata> {
  const params = await props.params;
  try {
    const { publicId } = parseHandle(params.handle);
    const collection = await getCollectionDetail({ publicId }, null);
    if (!collection.ok) throw new Error("Collection not found");

    return { title: collection.value.name };
  } catch {
    return parent as Metadata;
  }
}

const CollectionPage = async (props: CollectionPageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const params = await props.params;
  const { publicId } = parseHandle(params.handle);
  const { user } = await validateSession();

  const collectionResult = await getCollectionDetail({ publicId }, user);
  if (!collectionResult.ok) notFound();

  const collection = collectionResult.value;
  const collaboratorUsers = collection.collaborators.map((c) => c.user);
  const attribution = generateAttribution(collaboratorUsers);
  const isMaintainer =
    collaboratorUsers.find((c) => c.id === user?.id) !== undefined;

  // todo: likes

  return (
    <>
      <h1 className="font-medium">{collection.name}</h1>
      <div className="flex justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span>By </span>
          <div className="flex items-center gap-1">
            <AvatarStack users={collaboratorUsers} />
            <span>{attribution}</span>
          </div>
        </div>
        <div>
          {/* <OptimisticLikeButton
              action={async (type) => {
                "use server";
                if (!user) throw new Error("No session available");

                if (type === "add") {
                  const count = await addCollectionLike(user, collection.id);
                  revalidatePath("/collections", "page");
                  return { count, isLiked: true };
                } else {
                  const count = await removeCollectionLike(user, collection.id);
                  revalidatePath("/collections", "page");
                  return { count, isLiked: false };
                }
              }}
              disabled={user === null}
              isLiked={isLiked}
              count={collection.likes}
            /> */}
        </div>
      </div>
      {isMaintainer && (
        <div className="my-12">
          <Section title="Maintainer Actions">
            <div className="flex items-center gap-4">
              <LinkButton
                href={`/collections/${generateHandle(collection.slug, collection.publicId)}/edit`}
                variant="outline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4 text-stone-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white">Edit</span>
              </LinkButton>
              <DeleteCollectionButton collectionIdentifier={collection} />
            </div>
          </Section>
        </div>
      )}
      <div className="my-12">
        <Section title="Recipes">
          <RecipeList
            recipes={collection.recipes}
            collection={collection}
            isMaintainer={isMaintainer}
          />
        </Section>
      </div>
    </>
  );
};

const RecipeList = async ({
  collection,
  recipes,
  isMaintainer,
}: {
  collection: Collection;
  recipes: Recipe[];
  isMaintainer: boolean;
}) => {
  if (recipes.length === 0)
    return (
      <div className="py-12">
        <NoRecipesStored />
      </div>
    );

  return (
    <ul className="space-y-2">
      {recipes.map((recipe) => (
        <li key={recipe.publicId}>
          <div className="rounded-xl border dark:border-none dark:bg-stone-950">
            <RecipeCard recipe={recipe} />
            {isMaintainer && (
              <div className="p-2">
                <form
                  action={removeRecipeFromCollectionAction.bind(
                    null,
                    collection,
                    recipe,
                  )}
                >
                  <Button type="submit">Remove</Button>
                </form>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CollectionPage;
