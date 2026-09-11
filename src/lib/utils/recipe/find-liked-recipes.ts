import "server-only";

import { db } from "@/drizzle/db";
import type { LikedListOptions } from "@/lib/application/abstractions/recipe/recipe-like-repository";
import type { User } from "@/lib/domain/user/user";
import { DrizzleRecipeLikeRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-like-repository";

export async function findLikedRecipes(
  user: User,
  options?: LikedListOptions,
) {
  const repo = new DrizzleRecipeLikeRepository(db);
  return repo.findByUser(user, options);
}
