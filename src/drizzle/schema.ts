import "server-only";

import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

const subscriberRoles = ["creator", "maintainer", "subscriber"] as const;

// MARK: recipes
export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  description: text("description"),
  recommendedServingSize: integer("recommendedServingSize").notNull(),
  cookingTime: integer("cookingTime").notNull().default(0),
  preparationTime: integer("preparationTime").notNull().default(0),
  visibility: text("visibility", {
    enum: ["public", "unlisted", "private"],
  }).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  likes: integer("likes").notNull().default(0),
  coverSrc: text("coverSrc"),
});

export const recipeUserPermissions = sqliteTable(
  "recipe_user_permissions",
  {
    recipeId: integer()
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text({
      enum: ["owner", "maintainer", "editor", "viewer"],
    }).notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    primaryKey({
      columns: [table.recipeId, table.userId],
      name: "recipe_user_permissions_pkey",
    }),
  ],
);

export const recipeLikes = sqliteTable("recipe_likes", {
  recipeId: integer()
    .notNull()
    .references(() => recipes.id),
  userId: integer()
    .notNull()
    .references(() => users.id),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const recipeSteps = sqliteTable("steps", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  recipeId: integer("recipeId")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  description: text("description").notNull(),
});

// MARK: collections
export const collections = sqliteTable("collections", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  isCustom: integer("isCustom", { mode: "boolean" }),
  visibility: text("visibility", {
    enum: ["public", "unlisted", "private"],
  }).notNull(),
  itemCount: integer("itemCount").notNull().default(0),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  likes: integer("likes").notNull().default(0),
});

export const collectionRecipes = sqliteTable("collectionRecipes", {
  collectionId: integer("collectionId")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
  recipeId: integer("recipeId")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
});

export const collectionUserPermissions = sqliteTable(
  "collection_user_permissions",
  {
    collectionId: integer()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text({
      enum: ["owner", "maintainer", "editor", "viewer"],
    }).notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    primaryKey({
      columns: [table.collectionId, table.userId],
      name: "collection_user_permissions_pkey",
    }),
  ],
);

export const collectionLikes = sqliteTable("collection_likes", {
  collectionId: integer()
    .notNull()
    .references(() => collections.id),
  userId: integer()
    .notNull()
    .references(() => users.id),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(current_timestamp)`),
});
// MARK: users
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  hashedPassword: text("hashedPassword").notNull(),
  username: text("username").notNull(),
  avatar: text("avatar"),

  appPreferencesId: integer("appPreferencesId")
    .notNull()
    .references(() => appPreferences.id),
  collectionPreferencesId: integer("collectionPreferencesId")
    .notNull()
    .references(() => collectionPreferences.id),
  recipePreferencesId: integer("recipePreferencesId")
    .notNull()
    .references(() => recipePreferences.id),
});

export const userScopes = sqliteTable(
  "userScopes",
  {
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    scope: text("scope", { enum: ["admin"] }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.scope],
      name: "userScopesPkey",
    }),
  ],
);

export const appPreferences = sqliteTable("appPreferences", {
  id: integer("id").primaryKey(),
  theme: text("theme", {
    enum: ["light", "dark", "system"],
  })
    .default("system")
    .notNull(),
});

export const collectionPreferences = sqliteTable("collectionPreferences", {
  id: integer("id").primaryKey(),
  defaultVisibility: text("defaultVisibility", {
    enum: ["public", "unlisted", "private"],
  })
    .default("public")
    .notNull(),
});

export const recipePreferences = sqliteTable("recipePreferences", {
  id: integer("id").primaryKey(),
  defaultVisibility: text("defaultVisibility", {
    enum: ["public", "unlisted", "private"],
  })
    .default("public")
    .notNull(),
  defaultServingSize: integer("defaultServingSize").default(0).notNull(),
});

// MARK: sessions
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
});

export const sessionScopes = sqliteTable(
  "sessionScopes",
  {
    sessionId: text("sessionId")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    scope: text("scope", { enum: ["sudo"] }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(current_timestamp)`),
    expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.sessionId, table.scope],
      name: "sessionScopesPkey",
    }),
  ],
);

export const passwordResetRequests = sqliteTable("passwordResetRequests", {
  id: integer("id").primaryKey(),
  token: text("token").notNull().unique(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(current_timestamp)`),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
});

// MARK: type helpers
export type IdentifiedByIdOrPublicId<
  T extends { id: T["id"]; publicId: T["publicId"] },
> = { id: T["id"] } | { publicId: T["publicId"] };
export type IdentifiedById<T extends { id: T["id"] }> = { id: T["id"] };
export type IdentifiedByPublicId<T extends { publicId: T["publicId"] }> = {
  publicId: T["publicId"];
};
// MARK: types
export type DrizzleUser = InferSelectModel<typeof users>;
export type DrizzleUserInsert = InferInsertModel<typeof users>;
export type UserIdentifier = IdentifiedByIdOrPublicId<DrizzleUser>;

export type DrizzleSession = InferSelectModel<typeof sessions>;
export type DrizzleSessionInsert = InferInsertModel<typeof sessions>;
export type SessionIdentifier = IdentifiedById<DrizzleSession>;

export type DrizzleUserScope = InferSelectModel<typeof userScopes>;
export type DrizzleUserScopeInsert = InferInsertModel<typeof userScopes>;

export type DrizzleSessionScope = InferSelectModel<typeof sessionScopes>;
export type DrizzleSessionScopeInsert = InferInsertModel<typeof sessionScopes>;

export type DrizzleRecipePreferences = InferSelectModel<
  typeof recipePreferences
>;
export type DrizzleRecipePreferencesInsert = InferInsertModel<
  typeof recipePreferences
>;
export type RecipePreferencesIdentifier =
  IdentifiedById<DrizzleRecipePreferences>;

export type DrizzleCollectionPreferences = InferSelectModel<
  typeof collectionPreferences
>;
export type DrizzleCollectionPreferencesInsert = InferInsertModel<
  typeof collectionPreferences
>;
export type CollectionPreferencesIdentifier =
  IdentifiedById<DrizzleCollectionPreferences>;

export type DrizzleAppPreferences = InferSelectModel<typeof appPreferences>;
export type DrizzleAppPreferencesInsert = InferInsertModel<
  typeof appPreferences
>;
export type AppPreferencesIdentifier = IdentifiedById<DrizzleAppPreferences>;

export type DrizzleRecipe = InferSelectModel<typeof recipes>;
export type DrizzleRecipeInsert = InferInsertModel<typeof recipes>;
export type RecipeIdentifier = IdentifiedByIdOrPublicId<DrizzleRecipe>;

export type DrizzleRecipeStep = InferSelectModel<typeof recipeSteps>;
export type DrizzleRecipeStepsInsert = InferInsertModel<typeof recipeSteps>;
export type RecipeStepsIdentifier = IdentifiedByIdOrPublicId<DrizzleRecipeStep>;

export type DrizzleCollection = InferSelectModel<typeof collections>;
export type DrizzleCollectionInsert = InferInsertModel<typeof collections>;
export type CollectionIdentifier = IdentifiedByIdOrPublicId<DrizzleCollection>;

export type SubscriptionRole = (typeof subscriberRoles)[number];

export type DrizzleRecipeUserPermission = InferSelectModel<
  typeof recipeUserPermissions
>;
export type DrizzleRecipeUserPermissionInsert = InferInsertModel<
  typeof recipeUserPermissions
>;

export type DrizzleCollectionUserPermission = InferSelectModel<
  typeof collectionUserPermissions
>;
export type DrizzleCollectionUserPermissionInsert = InferInsertModel<
  typeof collectionUserPermissions
>;
