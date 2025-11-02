import type { AppPreferences } from "../../../domain/user/app-preferences";
import { PreferencesRepository } from "./preferences-repository";

export interface AppPreferencesRepository
  extends PreferencesRepository<AppPreferences> {}
