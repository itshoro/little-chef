import { AvatarStack } from "@/components/users/avatar-stack";
import type { RecipePreviewDTO } from "@/lib/services/recipe/types";
import { generateHandle } from "@/lib/slug";
import * as Card from "../ui/link-card";

const RecipeCard = async ({ recipe, maintainers }: RecipePreviewDTO) => {
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
          <AvatarStack users={maintainers} />
        </div>
      </div>
    </Card.Root>
  );
};

export { RecipeCard };
