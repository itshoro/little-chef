import type {
  RecipeListOptions,
  RecipeReadRepository,
} from "@/lib/application/abstractions/recipe/recipe-read-repository";
import type { User } from "@/lib/domain/user/user";

export function makeFindRecipes(recipeReadRepository: RecipeReadRepository) {
  return async function findRecipes(
    options: RecipeListOptions,
    user: User | null,
  ) {
    return recipeReadRepository.list(options, user);
  };
}
