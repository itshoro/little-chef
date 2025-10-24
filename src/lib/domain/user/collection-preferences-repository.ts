import type { Result } from "../shared/result";
import type { CollectionPreferences } from "./collection-preferences";
import { PreferencesRepository } from "./preferences-repository";

export interface CollectionPreferencesRepository
  extends PreferencesRepository<CollectionPreferences> {
  update(dto: CollectionPreferences): Promise<Result<void, Error>>;
}
