import type { Connection } from "@/drizzle/db";
import { recipePreferences } from "@/drizzle/schema";
import { RecipePreferencesRepository } from "@/lib/application/abstractions/user/recipe-preferences-repository";
import type { Result } from "@/lib/domain/shared/result";
import type { RecipePreferences } from "@/lib/domain/user/recipe-preferences";
import { eq, type InferInsertModel } from "drizzle-orm";

export class DrizzleRecipePreferencesRepository
  implements RecipePreferencesRepository
{
  constructor(private readonly connection: Connection) {}

  async findById(id: number): Promise<Result<RecipePreferences>> {
    const [preferences] = await this.connection
      .select()
      .from(recipePreferences)
      .where(eq(recipePreferences.id, id))
      .limit(1);

    if (!preferences) {
      return { ok: false, error: new Error("Recipe preferences not found") };
    }

    return { ok: true, value: preferences };
  }

  async create(dto: RecipePreferences): Promise<Result<RecipePreferences>> {
    const [preferences] = await this.connection
      .insert(recipePreferences)
      .values(dto)
      .returning();

    if (!preferences) {
      return {
        ok: false,
        error: new Error("Failed to create recipe preferences"),
      };
    }

    return { ok: true, value: preferences };
  }

  async update(preferences: RecipePreferences): Promise<Result<void>> {
    const dto: Omit<
      Required<InferInsertModel<typeof recipePreferences>>,
      "id"
    > = {
      defaultServingSize: preferences.defaultServingSize,
      defaultVisibility: preferences.defaultVisibility,
    };

    await this.connection
      .update(recipePreferences)
      .set(dto)
      .where(eq(recipePreferences.id, preferences.id));

    return { ok: true, value: undefined };
  }
}
