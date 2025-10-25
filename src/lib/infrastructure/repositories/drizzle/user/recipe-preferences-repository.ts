import type { Connection } from "@/drizzle/db";
import { recipePreferences } from "@/drizzle/schema";
import type { Result } from "@/lib/domain/shared/result";
import type { RecipePreferences } from "@/lib/domain/user/recipe-preferences";
import { RecipePreferencesRepository } from "@/lib/domain/user/recipe-preferences-repository";
import { eq, type InferInsertModel } from "drizzle-orm";

export class DrizzleRecipePreferencesRepository
  implements RecipePreferencesRepository
{
  constructor(private readonly connection: Connection) {}

  async findById(id: number): Promise<RecipePreferences> {
    const [preferences] = await this.connection
      .select()
      .from(recipePreferences)
      .where(eq(recipePreferences.id, id))
      .limit(1);

    return preferences satisfies RecipePreferences;
  }

  async create(dto: RecipePreferences): Promise<RecipePreferences> {
    const [preferences] = await this.connection
      .insert(recipePreferences)
      .values(dto)
      .returning();

    return preferences satisfies RecipePreferences;
  }

  async update(preferences: RecipePreferences): Promise<Result<void, Error>> {
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
