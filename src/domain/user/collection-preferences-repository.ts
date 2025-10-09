import type { CollectionPreferences } from "./collection-preferences";
import { PreferencesRepository } from "./preferences-repository";

export interface CollectionPreferencesRepository
  extends PreferencesRepository<CollectionPreferences> {}
