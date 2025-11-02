import type { Result } from "../../../domain/shared/result";

export interface PreferencesRepository<TPreferences> {
  findById(id: number): Promise<Result<TPreferences>>;
  create(dto: Omit<TPreferences, "id">): Promise<Result<TPreferences>>;
}
