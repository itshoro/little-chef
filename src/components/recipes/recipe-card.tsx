import { AvatarStack } from "@/components/users/avatar-stack";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import { generateHandle } from "@/lib/slug";
import * as Card from "../ui/link-card";

const RecipeCard = async ({ recipe }: { recipe: Recipe }) => {
  return (
    <Card.Root>
      <Card.Link
        href={`/recipes/${generateHandle(recipe.slug, recipe.publicId)}`}
      >
        Overview of {recipe.name}
      </Card.Link>
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="font-medium">
            <span>{recipe.name}</span>
          </div>
          <AvatarStack users={recipe.collaborators.map((c) => c.user)} />
        </div>
      </div>
    </Card.Root>
  );
};

export { RecipeCard };
