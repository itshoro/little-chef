"use server";

import { getConnection } from "@/lib/db";
import { ExecutedQuery } from "@planetscale/database";
import { Recipe } from "../validators";
import { cache } from "react";

type RecipeOverview = { name: string; id: string };

function toRecipeOverview<Row = ExecutedQuery["rows"][number]>(row: Row) {
  return { id: row["id"], name: row["name"] } satisfies RecipeOverview;
}

function toRecipe<Row = ExecutedQuery["rows"][number]>(
  recipeRow: Row,
  stepRows: Row[]
): Recipe {
  return {
    id: recipeRow["id"],
    name: recipeRow["name"],
    servings: recipeRow["servings"],
    totalDuration: recipeRow["totalDuration"],
    steps: stepRows.map((row) => row["description"]),
  } satisfies Recipe;
}

async function getOverview() {
  const connection = getConnection();
  const result = await connection.execute("SELECT `id`, `name` FROM recipes");

  return result.rows.map((row) => toRecipeOverview(row));
}

async function get(id: string) {
  const connection = getConnection();

  const [recipeResult, stepResults] = await Promise.all([
    connection.execute("SELECT * FROM recipes WHERE id = :id", { id }),
    connection.execute("SELECT * FROM recipe_steps WHERE parent_id = :id", {
      id,
    }),
  ]);

  if (recipeResult.size === 0) {
    throw new Error("Recipe not found.");
  }

  return toRecipe(recipeResult.rows[0], stepResults.rows);
}

const cachedGet = cache(get);

export { cachedGet as get, getOverview };
