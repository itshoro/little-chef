export interface PreferencesRepository<TPreferences> {
  findById(id: number): Promise<TPreferences | null>;
  create(dto: Omit<TPreferences, "id">): Promise<TPreferences>;
}
