import type { RecipeRepository } from "@/application/abstractions/recipe/recipe-repository";
import { Recipe, type RecipeDetail } from "@/domain/recipe/recipe";
import type { Step } from "@/domain/recipe/step";
import type { Collaborator } from "@/domain/shared/collaborator";
import type { FileReference } from "@/domain/shared/file-reference";
import type { Result } from "@/domain/shared/result";
import type { Connection } from "@/drizzle/db";
import {
  fileReference,
  recipes,
  recipeSteps,
  recipeUserPermissions,
  users,
} from "@/drizzle/schema";
import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm";

export class DrizzleRecipeRepository implements RecipeRepository {
  constructor(private readonly db: Connection) {}

  async create(dto: Omit<Recipe, "id">): Promise<Result<Recipe, Error>> {
    const result = await this.db
      .insert(recipes)
      .values({ ...dto, coverId: dto.cover?.id ?? null });

    if (!result.lastInsertRowid) {
      return { ok: false, error: new Error("Couldn't add recipe to database") };
    }

    return {
      ok: true,
      value: { ...dto, id: Number(result.lastInsertRowid) },
    };
  }

  async findById(id: number): Promise<Recipe | null> {
    const [recipe] = await this.db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1);

    if (!recipe) return null;

    const [collaborators, cover] = await Promise.all([
      this.findCollaborators(recipe.id),
      this.findCover(recipe.coverId),
    ]);

    return this.recipeFromParams(recipe, collaborators, cover);
  }

  async findByPublicId(publicId: string): Promise<Recipe | null> {
    const [recipe] = await this.db
      .select()
      .from(recipes)
      .where(eq(recipes.publicId, publicId))
      .limit(1);

    if (!recipe) return null;

    const [collaborators, cover] = await Promise.all([
      this.findCollaborators(recipe.id),
      this.findCover(recipe.coverId),
    ]);

    return this.recipeFromParams(recipe, collaborators, cover);
  }

  async update(recipe: Recipe): Promise<Result<Recipe, Error>> {
    const dto: Required<InferInsertModel<typeof recipes>> = {
      ...recipe,
      coverId: recipe.cover?.id ?? null,
    };

    const result = await this.db
      .update(recipes)
      .set(dto)
      .where(eq(recipes.id, recipe.id));

    if (result.rowsAffected === 0)
      return {
        ok: false,
        error: new Error("Failed to find recipe to update."),
      };

    return { ok: true, value: recipe };
  }

  async delete(recipe: Recipe): Promise<Result<void, Error>> {
    const result = await this.db
      .delete(recipes)
      .where(eq(recipes.id, recipe.id));

    if (result.rowsAffected === 0)
      return {
        ok: false,
        error: new Error("Failed to find recipe to delete."),
      };

    return { ok: true, value: undefined };
  }

  // MARK: utils

  private recipeFromParams(
    recipe: InferSelectModel<typeof recipes>,
    collaborators: Collaborator[],
    cover: FileReference | null,
  ): Recipe {
    return {
      ...recipe,
      collaborators,
      cover,
    } satisfies Recipe;
  }

  private async findCollaborators(id: number): Promise<Collaborator[]> {
    return (await this.db
      .select({ role: recipeUserPermissions.role, user: users })
      .from(recipeUserPermissions)
      .innerJoin(users, eq(users.id, recipeUserPermissions.userId))
      .where(eq(recipeUserPermissions.recipeId, id))) as Collaborator[];
  }

  private async findCover(id: number | null): Promise<FileReference | null> {
    if (id === null) return null;

    const [reference] = await this.db
      .select()
      .from(fileReference)
      .where(eq(fileReference.id, id))
      .limit(1);

    return reference ?? null;
  }
}
