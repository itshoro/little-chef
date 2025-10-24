import type { AppPreferences } from "./app-preferences";
import { PreferencesRepository } from "./preferences-repository";

export interface AppPreferencesRepository
  extends PreferencesRepository<AppPreferences> {}
