export interface PreferencesRepository<TPreferences> {
  findById(id: number): Promise<TPreferences>;
  create(dto: Omit<TPreferences, "id">): Promise<TPreferences>;
}
