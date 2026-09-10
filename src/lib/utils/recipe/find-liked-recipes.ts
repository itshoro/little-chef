import "server-only";

import { db } from "@/drizzle/db";
import type { User } from "@/lib/domain/user/user";
import { DrizzleRecipeLikeRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-like-repository";

export async function findLikedRecipes(user: User) {
  const repo = new DrizzleRecipeLikeRepository(db);
  return repo.findByUser(user);
}
