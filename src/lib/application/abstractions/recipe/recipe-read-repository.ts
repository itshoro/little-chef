import type { Recipe, RecipeDetail } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

type PaginationOptions = {
  page: number;
  pageSize: number;
};

type InternalSearchOptions = {
  query: string;
};

export interface RecipeListOptions {
  pagination?: PaginationOptions;
  search?: InternalSearchOptions;
}

export interface RecipeReadRepository {
  list(
    options: RecipeListOptions,
    user?: User | null,
  ): Promise<Result<Recipe[]>>;

  findDetailByIdentifier(
    identifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
    user?: User | null,
  ): Promise<Result<RecipeDetail>>;
}
