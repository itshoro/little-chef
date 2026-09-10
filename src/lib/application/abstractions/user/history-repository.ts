import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export interface ResourceHistoryRepository<T extends Recipe> {
  upsertRecord(resource: T, user: User): Promise<Result<void>>;
  findByUser(user: User): Promise<Result<Recipe[]>>;
}
