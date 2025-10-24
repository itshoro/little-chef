import type { ResourceGuard } from "../auth/resource-guard";
import type { Recipe } from "../../../domain/recipe/recipe";

export interface RecipePermissionRepository extends ResourceGuard<Recipe> {}
