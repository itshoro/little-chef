import {
  PERMISSION_ROLES,
  SESSION_SCOPES,
  THEMES,
  USER_ROLES,
  VISIBILITIES,
} from "@/lib/constants";
import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

// MARK: recipes
export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  description: text("description"),
  recommendedServingSize: integer("recommendedServingSize").notNull(),
  cookingTime: integer("cookingTime").notNull().default(0),
  preparationTime: integer("preparationTime").notNull().default(0),
  visibility: text("visibility", {
    enum: VISIBILITIES,
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
      enum: PERMISSION_ROLES,
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
    enum: VISIBILITIES,
  }).notNull(),
  itemCount: integer("itemCount").notNull().default(0),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  likes: integer("likes").notNull().default(0),
});

export const collectionRecipes = sqliteTable("collection_recipes", {
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
      enum: PERMISSION_ROLES,
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

export const userRoles = sqliteTable(
  "user_roles",
  {
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text({ enum: USER_ROLES }).notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.role],
      name: "user_roles_pkey",
    }),
  ],
);

export const appPreferences = sqliteTable("app_preferences", {
  id: integer("id").primaryKey(),
  theme: text("theme", {
    enum: THEMES,
  })
    .default("system")
    .notNull(),
});

export const collectionPreferences = sqliteTable("collection_preferences", {
  id: integer("id").primaryKey(),
  defaultVisibility: text("defaultVisibility", {
    enum: VISIBILITIES,
  })
    .default("public")
    .notNull(),
});

export const recipePreferences = sqliteTable("recipe_preferences", {
  id: integer("id").primaryKey(),
  defaultVisibility: text("defaultVisibility", {
    enum: VISIBILITIES,
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
  "session_scopes",
  {
    sessionId: text()
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    scope: text({ enum: SESSION_SCOPES }).notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(current_timestamp)`),
    expiresAt: integer({ mode: "timestamp" }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.sessionId, table.scope],
      name: "session_scopes_pkey",
    }),
  ],
);

export const passwordResetRequests = sqliteTable("password_reset_requests", {
  id: integer().primaryKey(),
  token: text().notNull().unique(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(current_timestamp)`),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
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

export type DrizzleUserRole = InferSelectModel<typeof userRoles>;
export type DrizzleUserRoleInsert = InferInsertModel<typeof userRoles>;

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
