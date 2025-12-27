import type { Recipe } from "../../../domain/recipe/recipe";
import type { ResourceGuard } from "../auth/resource-guard";

export interface RecipePermissionRepository extends ResourceGuard<Recipe> {}
