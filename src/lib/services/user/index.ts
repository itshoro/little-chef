import "server-only";

import { db } from "@/drizzle/db";
import type {
  DrizzleUserInsert,
  DrizzleUserRole,
  UserIdentifier,
} from "@/drizzle/schema";
import { ConflictError } from "@/lib/errors/conflict/error";
import { UserNotFoundError } from "@/lib/errors/resource-not-found/user";
import { nanoid } from "@/lib/nanoid";
import { invariant as userInvariant } from "@/lib/validators/user/invariant";
import { hash } from "@node-rs/argon2";
import {
  unsafeCreateAppPreferences,
  unsafeCreateCollectionPreferences,
  unsafeCreateRecipePreferences,
  unsafeCreateUser,
  unsafeDeleteUser,
  unsafeGetCollectionPreferences,
  unsafeGetRecipePreferences,
  unsafeGetUserByIdentifier,
  unsafeGetUserByUsername,
  unsafeGetUserRoles,
  unsafeUpdateCollectionPreferences,
  unsafeUpdateRecipePreferences,
  unsafeUpdateUser,
} from "../../dal/user";
import type { AuthenticatedUser } from "../auth/types";
import type {
  CollectionPreferencesUpdateDTO,
  RecipePreferencesUpdateDTO,
  UserInsertDTO,
  UserUpdateDTO,
} from "./types";

// MARK: CRUD

export async function createUser(dto: UserInsertDTO) {
  const existingUser = await unsafeGetUserByUsername(dto.username);
  if (existingUser) throw new ConflictError("The username is already taken.");

  const user = await db.transaction(async (tx) => {
    const userDto: DrizzleUserInsert = {
      publicId: nanoid(),
      username: dto.username,
      avatar: dto.avatar,
      hashedPassword: await hash(dto.password),
      appPreferencesId: await unsafeCreateAppPreferences(tx, {}),
      recipePreferencesId: await unsafeCreateRecipePreferences(tx, {}),
      collectionPreferencesId: await unsafeCreateCollectionPreferences(tx, {}),
    };
    const user = await unsafeCreateUser(tx, userDto);

    return user;
  });

  return user;
}

export async function getUser(identifier: UserIdentifier) {
  const user = await unsafeGetUserByIdentifier(identifier);
  if (!user) {
    throw new UserNotFoundError(identifier);
  }

  return user;
}

export async function updateUser(dto: UserUpdateDTO, user: AuthenticatedUser) {
  const userDto: Partial<DrizzleUserInsert> = {
    avatar: dto.avatar,
    username: dto.username,
    hashedPassword: dto.password ? await hash(dto.password) : undefined,
  };
  await unsafeUpdateUser(db, user, userDto);
}

export async function deleteUser(user: AuthenticatedUser) {
  await db.transaction(async (tx) => {
    const { rowsAffected } = await unsafeDeleteUser(tx, user);
    userInvariant(
      rowsAffected === 1,
      "Deleted an unexpected amount of users.",
      {
        cause: {
          identifier: { user: { id: user.id, publicId: user.publicId } },
          rowsAffected,
        },
      },
    );
  });
}

// MARK: User Preferences

export async function getCollectionPreferences(user: AuthenticatedUser) {
  const preferences = await unsafeGetCollectionPreferences({
    id: user.collectionPreferencesId,
  });
  userInvariant(preferences, "A user must have collection preferences.", {
    cause: {
      identifier: {
        user: { id: user.id, publicId: user.publicId },
        collectionPreferences: { id: user.collectionPreferencesId },
      },
    },
  });

  return preferences;
}

export async function updateCollectionPreferences(
  dto: CollectionPreferencesUpdateDTO,
  user: AuthenticatedUser,
) {
  const { rowsAffected } = await unsafeUpdateCollectionPreferences(
    db,
    { id: user.collectionPreferencesId },
    dto,
  );
  userInvariant(
    rowsAffected === 1,
    "Updated an unexpected amount of collection preferences.",
    {
      cause: {
        identifier: {
          user: { id: user.id, publicId: user.publicId },
          collectionPreferences: { id: user.collectionPreferencesId },
        },
        rowsAffected,
      },
    },
  );
}

export async function getRecipePreferences(user: AuthenticatedUser) {
  const preferences = await unsafeGetRecipePreferences({
    id: user.recipePreferencesId,
  });
  userInvariant(preferences, "A user must have recipe preferences.", {
    cause: {
      identifier: {
        user: { id: user.id, publicId: user.publicId },
        recipePreferences: { id: user.recipePreferencesId },
      },
    },
  });

  return preferences;
}

export async function updateRecipePreferences(
  dto: RecipePreferencesUpdateDTO,
  user: AuthenticatedUser,
) {
  const { rowsAffected } = await unsafeUpdateRecipePreferences(
    db,
    { id: user.recipePreferencesId },
    dto,
  );
  userInvariant(
    rowsAffected === 1,
    "Updated an unexpected amount of recipe preferences.",
    {
      cause: {
        identifier: {
          user: { id: user.id, publicId: user.publicId },
          recipePreferences: { id: user.recipePreferencesId },
        },
        rowsAffected,
      },
    },
  );
}

// MARK: Roles

export async function hasUserRoles(
  user: AuthenticatedUser,
  requiredRoles: DrizzleUserRole["role"][],
) {
  const userRoles = await unsafeGetUserRoles(user);
  return requiredRoles.every((role) =>
    userRoles.some((permission) => permission.role === role),
  );
}
