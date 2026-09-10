import "server-only";

import { db } from "@/drizzle/db";
import type { User } from "@/lib/domain/user/user";
import { DrizzleRecipeHistoryRepository } from "@/lib/infrastructure/repositories/drizzle/user/recipe-history-repository";

export async function findHistoryRecipes(user: User) {
  const repo = new DrizzleRecipeHistoryRepository(db);
  return repo.findByUser(user);
}
