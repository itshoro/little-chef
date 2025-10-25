import { PERMISSION_ROLES as COLLECTION_PERMISSION_ROLES } from "@/lib/domain/collection/collection";
import { PERMISSION_ROLES as RECIPE_PERMISSION_ROLES } from "@/lib/domain/recipe/recipe";
import { VISIBILITIES } from "@/lib/domain/shared/visibility";
import { THEMES } from "@/lib/domain/user/app-preferences";
import { USER_ROLES } from "@/lib/domain/user/user";
import { sql } from "drizzle-orm";
import {
  blob,
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
  coverId: integer("coverId").references(() => fileReference.id, {
    onDelete: "set null",
  }),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
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
      enum: RECIPE_PERMISSION_ROLES,
    }).notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    primaryKey({
      columns: [table.recipeId, table.userId],
      name: "recipe_user_permissions_pkey",
    }),
  ],
);

export const recipeLikes = sqliteTable(
  "recipe_likes",
  {
    recipeId: integer()
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    userId: integer()
      .notNull()
      .references(() => users.id),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    primaryKey({
      columns: [table.recipeId, table.userId],
      name: "recipe_likes_pkey",
    }),
  ],
);

export const recipeSteps = sqliteTable(
  "steps",
  {
    recipeId: integer("recipeId")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    description: text("description").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.recipeId, table.order],
      name: "steps_pkey",
    }),
  ],
);

// MARK: collections
export const collections = sqliteTable("collections", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  visibility: text("visibility", {
    enum: VISIBILITIES,
  }).notNull(),
  itemCount: integer("itemCount").notNull().default(0),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const collectionRecipes = sqliteTable(
  "collection_recipes",
  {
    collectionId: integer("collectionId")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    recipeId: integer("recipeId")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.collectionId, table.recipeId],
      name: "collection_recipes_pkey",
    }),
  ],
);

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
      enum: COLLECTION_PERMISSION_ROLES,
    }).notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    primaryKey({
      columns: [table.collectionId, table.userId],
      name: "collection_user_permissions_pkey",
    }),
  ],
);

export const collectionLikes = sqliteTable(
  "collection_likes",
  {
    collectionId: integer()
      .notNull()
      .references(() => collections.id),
    userId: integer()
      .notNull()
      .references(() => users.id),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    primaryKey({
      columns: [table.collectionId, table.userId],
      name: "collection_likes_pkey",
    }),
  ],
);

// MARK: users
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  hashedPassword: text("hashedPassword").notNull(),
  username: text("username").notNull(),

  avatarId: integer("avatarId").references(() => fileReference.id),
  role: text({ enum: USER_ROLES }).notNull().default("user"),
  appPreferencesId: integer("appPreferencesId")
    .notNull()
    .references(() => appPreferences.id),
  collectionPreferencesId: integer("collectionPreferencesId")
    .notNull()
    .references(() => collectionPreferences.id),
  recipePreferencesId: integer("recipePreferencesId")
    .notNull()
    .references(() => recipePreferences.id),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
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
      .default(sql`(unixepoch())`),
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
    .references(() => users.id, { onDelete: "cascade" }),
  secretHash: blob("secretHash").notNull(),
  lastVerifiedAt: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer({ mode: "timestamp" }).notNull(),
});

export const userSessions = sqliteTable(
  "user_sessions",
  {
    sessionId: text()
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.sessionId, table.userId],
      name: "user_sessions_pkey",
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
    .default(sql`(unixepoch())`),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
});

export const fileReference = sqliteTable("file_references", {
  id: integer().primaryKey(),
  publicId: text().notNull().unique(),
  url: text().notNull().unique(),
  mimeType: text().notNull(),
  byteSize: integer().notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  expiresAt: integer({ mode: "timestamp" }),
});
