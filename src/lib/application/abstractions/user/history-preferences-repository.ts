import type { HistoryPreferences } from "@/lib/domain/user/history-preferences";
import type { PreferencesRepository } from "./preferences-repository";
import type { Result } from "@/lib/domain/shared/result";

export interface HistoryPreferencesRepository extends PreferencesRepository<HistoryPreferences> {
  update(preferences: HistoryPreferences): Promise<Result<void>>;
}
