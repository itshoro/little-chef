import { PreferencesRepository } from "./preferences-repository";
import type { RecipePreferences } from "./recipe-preferences";

export interface RecipePreferencesRepository
  extends PreferencesRepository<RecipePreferences> {}
