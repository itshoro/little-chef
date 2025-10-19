import type {
  RecipeListOptions,
  RecipeReadRepository,
} from "@/application/abstractions/recipe/recipe-read-repository";
import type { User } from "@/domain/user/user";

export function makeFindRecipes(recipeReadRepository: RecipeReadRepository) {
  return async function findRecipes(
    options: RecipeListOptions,
    user: User | null,
  ) {
    return recipeReadRepository.list(options, user?.id);
  };
}
