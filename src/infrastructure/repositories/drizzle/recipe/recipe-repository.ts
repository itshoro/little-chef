import type { Collaborator } from "@/application/abstractions/auth/resource-guard";
import { Recipe } from "@/domain/recipe/recipe";
import type {
  RecipeRepository,
  UpdateRecipeParams,
} from "@/application/abstractions/recipe/recipe-repository";
import type { Step } from "@/domain/recipe/step";
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
import { eq, type InferSelectModel } from "drizzle-orm";

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

    const [collaborators, steps, cover] = await Promise.all([
      this.findCollaborators(recipe.id),
      this.findSteps(recipe.id),
      recipe.coverId ? this.findCover(recipe.coverId) : Promise.resolve(null),
    ]);

    return this.fromParams(recipe, collaborators, steps, cover);
  }

  async findByPublicId(publicId: string): Promise<Recipe | null> {
    const [recipe] = await this.db
      .select()
      .from(recipes)
      .where(eq(recipes.publicId, publicId))
      .limit(1);

    if (!recipe) return null;

    const [collaborators, steps, cover] = await Promise.all([
      this.findCollaborators(recipe.id),
      this.findSteps(recipe.id),
      recipe.coverId ? this.findCover(recipe.coverId) : Promise.resolve(null),
    ]);

    return this.fromParams(recipe, collaborators, steps, cover);
  }

  async update(
    id: Recipe["id"],
    dto: UpdateRecipeParams,
  ): Promise<Result<Recipe, Error>> {
    const [recipe] = await this.db
      .update(recipes)
      .set({ ...dto, coverId: dto.cover?.id ?? null })
      .where(eq(recipes.id, id))
      .returning();

    if (!recipe) {
      return { ok: false, error: new Error("Couldn't update recipe") };
    }

    return { ok: true, value: { ...recipe, cover: dto.cover } };
  }

  async delete(id: Recipe["id"]): Promise<void> {
    await this.db.delete(recipes).where(eq(recipes.id, id));
  }

  // MARK: utils

  private fromParams(
    recipe: InferSelectModel<typeof recipes>,
    collaborators?: Collaborator[],
    steps?: Step[],
    cover?: FileReference | null,
  ): Recipe {
    return {
      ...recipe,
      collaborators: collaborators ?? [],
      steps: steps ?? [],
      cover: cover ?? null,
    } satisfies Recipe;
  }

  private async findCollaborators(id: number): Promise<Collaborator[]> {
    return (await this.db
      .select({ role: recipeUserPermissions.role, user: users })
      .from(recipeUserPermissions)
      .innerJoin(users, eq(users.id, recipeUserPermissions.userId))
      .where(eq(recipeUserPermissions.recipeId, id))) as Collaborator[];
  }

  private async findSteps(id: number): Promise<Step[]> {
    return await this.db
      .select()
      .from(recipeSteps)
      .where(eq(recipeSteps.recipeId, id));
  }

  private async findCover(id: number): Promise<FileReference | null> {
    const [reference] = await this.db
      .select()
      .from(fileReference)
      .where(eq(fileReference.id, id))
      .limit(1);

    return reference;
  }
}
