import "server-only";

import { db, type Connection } from "@/drizzle/db";
import {
  appPreferences,
  collectionPreferences,
  recipePreferences,
  userRoles,
  users,
  type AppPreferencesIdentifier,
  type CollectionPreferencesIdentifier,
  type DrizzleAppPreferencesInsert,
  type DrizzleCollectionPreferencesInsert,
  type DrizzleRecipePreferencesInsert,
  type DrizzleUser,
  type DrizzleUserInsert,
  type IdentifiedById,
  type RecipePreferencesIdentifier,
  type UserIdentifier,
} from "@/drizzle/schema";
import { UserNotFoundError } from "@/lib/errors/resource-not-found/user";
import type { AuthenticatedUser } from "@/lib/services/auth/types";
import type { Password, Username } from "@/lib/validators/user";
import { hash } from "@node-rs/argon2";
import { eq } from "drizzle-orm";

export async function unsafeGetAppPreferences(
  identifier: AppPreferencesIdentifier,
) {
  const [preferences] = await db
    .select()
    .from(appPreferences)
    .where(eq(appPreferences.id, identifier.id))
    .limit(1);

  return preferences;
}

export async function unsafeCreateAppPreferences(
  connection: Connection,
  dto: DrizzleAppPreferencesInsert,
) {
  const [{ id }] = await connection
    .insert(appPreferences)
    .values(dto)
    .returning({ id: appPreferences.id });

  return id;
}

export async function unsafeUpdateAppPreferences(
  connection: Connection,
  identifier: AppPreferencesIdentifier,
  dto: DrizzleAppPreferencesInsert,
) {
  return await connection
    .update(appPreferences)
    .set(dto)
    .where(eq(appPreferences.id, identifier.id));
}

export async function unsafeGetRecipePreferences(
  identifier: RecipePreferencesIdentifier,
) {
  const [preferences] = await db
    .select()
    .from(recipePreferences)
    .where(eq(recipePreferences.id, identifier.id))
    .limit(1);

  return preferences;
}

export async function unsafeCreateRecipePreferences(
  connection: Connection,
  dto: DrizzleRecipePreferencesInsert,
) {
  const [{ id }] = await connection
    .insert(recipePreferences)
    .values(dto)
    .returning({ id: recipePreferences.id });

  return id;
}

export async function unsafeUpdateRecipePreferences(
  connection: Connection,
  identifier: RecipePreferencesIdentifier,
  dto: DrizzleRecipePreferencesInsert,
) {
  return await connection
    .update(recipePreferences)
    .set(dto)
    .where(eq(recipePreferences.id, identifier.id));
}

export async function unsafeGetCollectionPreferences(
  identifier: CollectionPreferencesIdentifier,
) {
  const [preferences] = await db
    .select()
    .from(collectionPreferences)
    .where(eq(collectionPreferences.id, identifier.id))
    .limit(1);

  return preferences;
}

export async function unsafeCreateCollectionPreferences(
  connection: Connection,
  dto: DrizzleCollectionPreferencesInsert,
) {
  const [{ id }] = await connection
    .insert(collectionPreferences)
    .values(dto)
    .returning({ id: collectionPreferences.id });

  return id;
}

export async function unsafeUpdateCollectionPreferences(
  connection: Connection,
  identifier: CollectionPreferencesIdentifier,
  dto: DrizzleCollectionPreferencesInsert,
) {
  return await connection
    .update(collectionPreferences)
    .set(dto)
    .where(eq(collectionPreferences.id, identifier.id));
}

export async function unsafeCreateUser(
  connection: Connection,
  dto: DrizzleUserInsert,
) {
  const [user] = await connection.insert(users).values(dto).returning();
  return user;
}

export async function unsafeGetUserByIdentifier(
  identifier: UserIdentifier | null,
) {
  if (!identifier) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(
      "publicId" in identifier
        ? eq(users.publicId, identifier.publicId)
        : eq(users.id, identifier.id),
    )
    .limit(1);

  return user ?? null;
}

export async function unsafeUpdateUser(
  connection: Connection,
  identifier: AuthenticatedUser,
  dto: Partial<DrizzleUserInsert>,
) {
  const [user] = await connection
    .update(users)
    .set(dto)
    .where(eq(users.id, identifier.id))
    .returning();
  return user ?? null;
}

export async function unsafeDeleteUser(
  connection: Connection,
  identifier: AuthenticatedUser,
) {
  return await connection.delete(users).where(eq(users.id, identifier.id));
}

export async function unsafeGetUserByUsername(username: Username) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return user ?? null;
}

export async function unsafeGetUserRoles(
  identifier: IdentifiedById<DrizzleUser>,
) {
  return await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, identifier.id));
}

export async function unsafeUpdatePassword(
  connection: Connection,
  identifier: IdentifiedById<DrizzleUser>,
  newPassword: Password,
) {
  await connection
    .update(users)
    .set({ hashedPassword: await hash(newPassword) })
    .where(eq(users.id, identifier.id));
}

export async function unsafeResolveUserId(
  identifier: UserIdentifier,
): Promise<DrizzleUser["id"]> {
  if ("id" in identifier) return identifier.id;

  const [result] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.publicId, identifier.publicId));

  if (!result) throw new UserNotFoundError(identifier);
  return result.id;
}
