import type { Recipe } from "./recipe";

export class RecipeNotFoundError extends Error {
  constructor(
    identifier: { id?: Recipe["id"]; publicId?: Recipe["publicId"] },
    options?: ErrorOptions,
  ) {
    super(
      `Recipe ${identifier.id || "-"} / ${identifier.publicId || "-"} not found.`,
      options,
    );
    this.name = "RecipeNotFoundError";
  }
}
