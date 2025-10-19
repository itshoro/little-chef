export async function signUp(params: SignUpUserParams) {
  const user = await createUser(
    { ...rest, hashedPassword },
    userRepository,
    appPreferencesRepository,
    recipePreferencesRepository,
    collectionPreferencesRepository,
  );

  const session = await createSession(now, user.id, sessionProvider);
}
