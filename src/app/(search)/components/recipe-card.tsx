import { getCreatorsAndMaintainers, getRecipe } from "@/lib/dal/recipe";
import * as Card from "./link-card";
import { AvatarStack } from "@/app/components/header/avatar-stack";
import { generateSlugPathSegment } from "@/lib/slug";
import { validateRequest } from "@/lib/auth/lucia";

type RecipeCardProps = {
  id: number;
  publicId: string;
  role?: string;
};

const RecipeCard = async ({ id, publicId }: RecipeCardProps) => {
  const { session } = await validateRequest();
  const [recipeResult, collaboratorsResult] = await Promise.allSettled([
    getRecipe({ id }, session?.id),
    getCreatorsAndMaintainers(id),
  ]);

  if (recipeResult.status === "rejected") {
    return null;
  }

  const recipe = recipeResult.value;
  const collaborators =
    collaboratorsResult.status === "fulfilled" ? collaboratorsResult.value : [];

  return (
    <Card.Root>
      <Card.Link
        href={`/recipes/${generateSlugPathSegment(recipe.slug, publicId)}`}
      >
        Overview of {recipe.name}
      </Card.Link>
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="font-medium">
            <span>{recipe.name}</span>
          </div>
          <AvatarStack users={collaborators} />
        </div>
      </div>
    </Card.Root>
  );
};

export { RecipeCard };
