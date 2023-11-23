"use server";

import { getConnection } from "@/lib/db";
import { AddRecipeValidator, UpdateRecipeValidator } from "../validators";

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
      const { insertId } = await transaction.execute(
        "INSERT INTO recipes (`name`, `servings`) VALUES (:name, :servings)",
        recipe
      );
      await Promise.allSettled(
        recipe.steps.map((step, i) =>
          transaction.execute(
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

async function update(formData: FormData) {
  const dto = {
    id: formData.get("id"),
    name: formData.get("name"),
    servings: formData.get("servings"),
    totalDuration: formData.get("totalDuration"),
    steps: formData.getAll("step"),
  };

  try {
    const recipe = UpdateRecipeValidator.parse(dto);
    const connection = getConnection();

    await connection.transaction(async (transaction) => {
      await transaction.execute(
        "UPDATE recipes SET `name` = :name, `servings` = :servings WHERE id = :id",
        recipe
      );
      // todo: transmit step id as a key so we can update steps instead of deleting and inserting them again.
      await transaction.execute(
        "DELETE FROM recipe_steps WHERE parent_id = :id",
        recipe
      );

      await Promise.allSettled(
        recipe.steps.map((step, i) =>
          transaction.execute(
            "INSERT INTO recipe_steps (`parent_id`, `description`, `order`) VALUES (:parentId, :description, :order)",
            { parentId: recipe.id, description: step, order: i }
          )
        )
      );
    });

    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export { add, update };
