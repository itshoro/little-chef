import type { Recipe, RecipeDetail } from "@/domain/recipe/recipe";
import type { User } from "@/domain/user/user";
import type { Result } from "../../../domain/shared/result";

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
  list(options: RecipeListOptions, user?: User | null): Promise<Recipe[]>;

  findByIdentifier(
    identifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
    user?: User | null,
  ): Promise<RecipeDetail | null>;
}
