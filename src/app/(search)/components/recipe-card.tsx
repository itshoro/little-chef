import { getCreatorsAndMaintainers, getRecipe } from "@/lib/dal/recipe";
import * as Card from "./link-card";
import { AvatarStack } from "@/app/components/header/avatar-stack";

type RecipeCardProps = {
  id: number;
  publicId: string;
  role?: string;
};

const RecipeCard = async ({ id, publicId }: RecipeCardProps) => {
  const [recipeResult, collaboratorsResult] = await Promise.allSettled([
    getRecipe(id),
    getCreatorsAndMaintainers(id),
  ]);

  if (recipeResult.status === "rejected") return null;

  const recipe = recipeResult.value;
  const collaborators =
    collaboratorsResult.status === "fulfilled" ? collaboratorsResult.value : [];

  return (
    <Card.Root>
      <Card.Link href={`/recipes/${recipe.slug}-${publicId}/overview`}>
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
