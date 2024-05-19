import {
  sqliteTable,
  // AnySQLiteColumn,
  integer,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
// import { sql, relations } from "drizzle-orm";

export const language = sqliteTable("language", {
  code: text("code", { length: 2 }).primaryKey(),
  name: text("name"),
});

export const translatables = sqliteTable("translatables", {
  id: integer("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  languageCode: text("languageCode", { length: 2 })
    .notNull()
    .references(() => language.code),
});

// MARK: recipes
export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  nameTranslatableId: integer("nameTranslatableId")
    .notNull()
    .references(() => translatables.id),
  slugTranslatableId: integer("slugTranslatableId")
    .notNull()
    .references(() => translatables.id),
  recommendedServingSize: integer("recommendedServingSize").notNull(),
  visibility: text("visibility", {
    enum: ["public", "unlisted", "private"],
  }).notNull(),
  translateableId: integer("translatableId")
    .notNull()
    .references(() => translatables.id),
});

export const recipeSubscribers = sqliteTable(
  "recipeSubscribers",
  {
    recipeId: integer("recipeId")
      .notNull()
      .references(() => recipes.id),
    userId: integer("userId")
      .notNull()
      .references(() => users.id),
  },
  (table) => {
    return {
      recipeSubscribersPkey: primaryKey({
        columns: [table.recipeId, table.userId],
        name: "recipeSubscribersPkey",
      }),
    };
  },
);

export const steps = sqliteTable("steps", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  recipeId: integer("id")
    .notNull()
    .references(() => recipes.id),
  order: integer("order").notNull(),
  translateableId: integer("translatableId")
    .notNull()
    .references(() => translatables.id),
});

// MARK: ingredients
export const ingredients = sqliteTable("ingredients", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  translateableId: integer("translatableId")
    .notNull()
    .references(() => translatables.id),
});

export const ingredientDetails = sqliteTable("ingredientDetails", {
  recipeId: integer("recipeId")
    .notNull()
    .references(() => recipes.id),
  ingredientId: integer("ingredientId")
    .notNull()
    .references(() => ingredients.id),

  measurementAmount: integer("measurementAmount"),
  measurementUnit: text("measurementUnit"),
});

// MARK: collections
export const collections = sqliteTable("collections", {
  id: integer("id").primaryKey(),
  publicId: text("publicId").notNull().unique(),
  nameTranslatableId: integer("nameTranslatableId")
    .notNull()
    .references(() => translatables.id),
  slugTranslatableId: integer("slugTranslatableId")
    .notNull()
    .references(() => translatables.id),
  isCustom: integer("isCustom", { mode: "boolean" }),
  visibility: text("visibility", {
    enum: ["public", "unlisted", "private"],
  }),
  itemCount: integer("itemCount").notNull().default(0),
});

export const collectionSubscribers = sqliteTable(
  "collectionSubscribers",
  {
    collectionId: integer("collectionId")
      .notNull()
      .references(() => collections.id),
    userId: integer("userId")
      .notNull()
      .references(() => users.id),
  },
  (table) => {
    return {
      recipeSubscribersPkey: primaryKey({
        columns: [table.collectionId, table.userId],
        name: "recipeSubscribersPkey",
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
  displayLanguageCode: text("displayLanguageCode")
    .notNull()
    .references(() => language.code),
  theme: text("theme", {
    enum: ["light", "dark", "system"],
  })
    .default("system")
    .notNull(),
});

export const collectionPreferences = sqliteTable("collectionPreferences", {
  id: integer("id").primaryKey(),
  defaultLanguageCode: text("defaultLanguageCode")
    .notNull()
    .references(() => language.code),
  defaultVisibility: text("defaultVisibility", {
    enum: ["public", "unlisted", "private"],
  })
    .default("public")
    .notNull(),
});

export const recipePreferences = sqliteTable("recipePreferences", {
  id: integer("id").primaryKey(),
  defaultLanguageCode: text("defaultLanguageCode")
    .notNull()
    .references(() => language.code),
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

// // MARK: relations

// export const userRelations = relations(users, ({ one }) => ({
//   appPreferences: one(appPreferences),
// }));

// export const recipeRelations = relations(recipes, ({ many }) => ({
//   collections: many(collections),
//   recipeSubscribers: many(recipeSubscribers),
//   steps: many(steps),
// }));

// export const stepRelations = relations(steps, ({ one }) => ({}));
