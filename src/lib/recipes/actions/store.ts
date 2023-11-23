import { getConnection } from "@/lib/db";
import { AddRecipeValidator } from "../validators";

async function add(formData: FormData) {
  const dto = {
    name: formData.get("name"),
    servings: formData.get("servings"),
    totalDuration: formData.get("totalDuration"),
    steps: formData.getAll("step"),
  };

  try {
    const recipe = AddRecipeValidator.parse(dto);
    const connection = getConnection();

    await connection.transaction(async (transaction) => {
      const { insertId } = await connection.execute(
        "INSERT INTO recipes (`name`, `servings`) VALUES (:name, :servings)",
        { name: recipe.name, servings: recipe.servings }
      );
      await Promise.allSettled(
        recipe.steps.map((step, i) =>
          connection.execute(
            "INSERT INTO recipe_steps (`parent_id`, `description`, `order`) VALUES (:parentId, :description, :order)",
            { parentId: insertId, description: step, order: i }
          )
        )
      );
    });

    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export { add };
