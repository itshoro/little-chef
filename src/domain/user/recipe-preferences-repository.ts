import type { Result } from "../shared/result";
import { PreferencesRepository } from "./preferences-repository";
import type { RecipePreferences } from "./recipe-preferences";

export interface RecipePreferencesRepository
  extends PreferencesRepository<RecipePreferences> {
  update(preferences: RecipePreferences): Promise<Result<void, Error>>;
}
