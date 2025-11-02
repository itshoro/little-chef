import type { Result } from "../../../domain/shared/result";
import { PreferencesRepository } from "./preferences-repository";
import type { RecipePreferences } from "../../../domain/user/recipe-preferences";

export interface RecipePreferencesRepository
  extends PreferencesRepository<RecipePreferences> {
  update(preferences: RecipePreferences): Promise<Result<void>>;
}
