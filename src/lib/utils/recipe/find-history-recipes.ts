import "server-only";

import { db } from "@/drizzle/db";
import type { HistoryListOptions } from "@/lib/application/abstractions/user/history-repository";
import type { User } from "@/lib/domain/user/user";
import { DrizzleRecipeHistoryRepository } from "@/lib/infrastructure/repositories/drizzle/user/recipe-history-repository";

export async function findHistoryRecipes(
  user: User,
  options?: HistoryListOptions,
) {
  const repo = new DrizzleRecipeHistoryRepository(db);
  return repo.findByUser(user, options);
}
