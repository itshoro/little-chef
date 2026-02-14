import { NoRecipesStored } from "@/components/collections/fallbacks/no-recipe-stored";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { Button } from "@/components/ui/buttons/button";

import { ShareCurrentPageButton } from "@/components/recipes/details/buttons/share-button";
import { LinkButton } from "@/components/ui/buttons/link-button";
import { Avatar } from "@/components/users/avatar";
import {
  toPublicCollection,
  type Collection,
} from "@/lib/domain/collection/collection";
import { toPublicRecipe, type Recipe } from "@/lib/domain/recipe/recipe";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import { generateHandle, parseHandle } from "@/lib/slug";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { getCollectionDetail } from "@/lib/utils/collection/get-collection-detail";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteCollectionButton } from "./_components/delete-button";
import { removeRecipeFromCollectionAction } from "./remove-recipe-action";

type CollectionPageProps = { params: Promise<{ handle: string }> };

export async function generateMetadata(
  props: CollectionPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const { publicId } = parseHandle(params.handle);
  const collection = await getCollectionDetail({ publicId }, null);
  if (!collection.ok) throw new Error("Collection not found");

  return { title: collection.value.name };
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
  const isMaintainer =
    collaboratorUsers.find((c) => c.id === user?.id) !== undefined;

  // todo: likes

  return (
    <article>
      <header className="border-b border-white/5 pb-6">
        <section
          className="isolate my-1 grid grid-cols-[auto_minmax(min-content,1fr)_auto] overflow-x-auto py-1"
          style={{
            scrollbarColor: "var(--color-stone-500) var(--color-stone-900)",
          }}
        >
          <div className="pointer-events-none sticky left-0 z-10 h-full w-4 bg-linear-to-l to-white dark:to-stone-900" />
          <div className="flex items-center gap-4">
            <Attributions maintainers={collection.collaborators} />
          </div>
          <div className="pointer-events-none sticky right-0 z-10 flex">
            <div className="h-full w-8 bg-linear-to-r to-white dark:to-stone-900" />
            <div className="pointer-events-auto relative flex">
              <section className="relative z-10 ml-auto flex gap-2 pr-4">
                <ShareCurrentPageButton />
                {/* <LikeButton
                  user={user}
                  recipe={recipe}
                  initialLikes={recipe.likes}
                /> */}
              </section>
              <div className="absolute top-0 h-full w-full bg-white dark:bg-stone-900" />
            </div>
          </div>
        </section>
        <div className="mt-4 px-4">
          <div className="mb-12">
            <h1 className="mb-3 text-2xl leading-snug font-medium text-balance">
              {collection.name}
            </h1>
            {/* <p className="leading-relaxed text-pretty text-stone-400">
              {collection.description}
            </p> */}
          </div>

          {isMaintainer && (
            <div className="my-12">
              <section className="-mx-4 whitespace-nowrap">
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
                    <span>Edit</span>
                  </LinkButton>
                  <DeleteCollectionButton
                    collectionIdentifier={{ publicId: collection.publicId }}
                  />
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="mt-4 px-4"></div>
      </header>
      <div className="my-12">
        <section className="my-12 px-4">
          <div className="mb-6">
            <div className="flex w-full flex-wrap items-baseline justify-between gap-6">
              <h2 className="shrink text-xl font-medium">Recipes</h2>
            </div>
          </div>
          <RecipeList
            recipes={collection.recipes}
            collection={collection}
            isMaintainer={isMaintainer}
          />
        </section>
      </div>
    </article>
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
                    toPublicCollection(collection),
                    toPublicRecipe(recipe),
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

const Attributions = ({ maintainers }: { maintainers: Collaborator[] }) => {
  return (
    <>
      {maintainers.map((maintainer) => (
        <article
          key={maintainer.user.publicId}
          className="inline-flex w-max shrink-0 items-center gap-2"
        >
          <Avatar src={maintainer.user.avatar?.url} alt="" size="size-8" />

          <span className="text-sm text-stone-400 capitalize">
            {maintainer.user.username}
          </span>
        </article>
      ))}
    </>
  );
};

export default CollectionPage;
