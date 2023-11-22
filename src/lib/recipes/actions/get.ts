import { getConnection } from "@/lib/db";
import { ExecutedQuery } from "@planetscale/database";

type RecipeOverview = { name: string; id: string };

function toRecipe<Row = ExecutedQuery["rows"][number]>(row: Row) {
  return { id: row["id"], name: row["name"] } satisfies RecipeOverview;
}

async function getOverview() {
  const connection = getConnection();
  const result = await connection.execute("SELECT `id`, `name` FROM recipes");

  return result.rows.map((row) => toRecipe(row));
}

export { getOverview };
