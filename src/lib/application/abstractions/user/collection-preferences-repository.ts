import type { Result } from "../../../domain/shared/result";
import type { CollectionPreferences } from "../../../domain/user/collection-preferences";
import { PreferencesRepository } from "./preferences-repository";

export interface CollectionPreferencesRepository
  extends PreferencesRepository<CollectionPreferences> {
  update(dto: CollectionPreferences): Promise<Result<void>>;
}
