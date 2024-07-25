import {
  sqliteTable,
  integer,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";

// MARK: recipes
export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  recommendedServingSize: integer("recommendedServingSize").notNull(),
  cookingTime: integer("cookingTime").notNull().default(0),
  preparationTime: integer("preparationTime").notNull().default(0),
  visibility: text("visibility", {
    enum: ["public", "unlisted", "private"],
  }).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

export const recipeSubscriptions = sqliteTable(
  "recipeSubscriptions",
  {
    recipeId: integer("recipeId")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id),
    role: text("role", {
      enum: ["creator", "maintainer", "subscriber"],
    }).notNull(),
  },
  (table) => {
    return {
      recipeSubscriptionsPkey: primaryKey({
        columns: [table.recipeId, table.userId],
        name: "recipeSubscriptionsPkey",
      }),
    };
  },
);

export const steps = sqliteTable("steps", {
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
  }),
  itemCount: integer("itemCount").notNull().default(0),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

export const collectionRecipes = sqliteTable("collectionRecipes", {
  collectionId: integer("collectionId")
    .notNull()
    .references(() => collections.id),
  recipeId: integer("recipeId")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
});

export const collectionSubscriptions = sqliteTable(
  "collectionSubscriptions",
  {
    collectionId: integer("collectionId")
      .notNull()
      .references(() => collections.id),
    userId: integer("userId")
      .notNull()
      .references(() => users.id),
    role: text("role", {
      enum: ["creator", "maintainer", "subscriber"],
    }).notNull(),
  },
  (table) => {
    return {
      collectionSubscriptionsPkey: primaryKey({
        columns: [table.collectionId, table.userId],
        name: "collectionSubscriptionsPkey",
      }),
    };
  },
);

// MARK: users
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  hashedPassword: text("hashedPassword").notNull(),
  username: text("username").notNull(),

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
  expiresAt: integer("expiresAt").notNull(),
});
