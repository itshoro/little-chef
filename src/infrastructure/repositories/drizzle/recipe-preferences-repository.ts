import type { RecipePreferences } from "@/domain/user/recipe-preferences";
import { RecipePreferencesRepository } from "@/domain/user/recipe-preferences-repository";
import type { Connection } from "@/drizzle/db";
import { recipePreferences } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export class DrizzleRecipePreferencesRepository
  implements RecipePreferencesRepository
{
  constructor(private readonly connection: Connection) {}

  async findById(id: number): Promise<RecipePreferences | null> {
    const [preferences] = await this.connection
      .select()
      .from(recipePreferences)
      .where(eq(recipePreferences.id, id))
      .limit(1);

    if (!preferences) return null;
    return preferences satisfies RecipePreferences;
  }

  async create(dto: RecipePreferences): Promise<RecipePreferences> {
    const [preferences] = await this.connection
      .insert(recipePreferences)
      .values(dto)
      .returning();

    return preferences satisfies RecipePreferences;
  }
}
