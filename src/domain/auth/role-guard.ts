interface RoleGuard<TRoles extends string[]> {
  assertHasRole(role: TRoles[number]): Promise<void>;
}
