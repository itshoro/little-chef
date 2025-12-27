import type { Connection } from "@/drizzle/db";
import {
  fileReference,
  recipes,
  recipeUserPermissions,
  users,
} from "@/drizzle/schema";
import type { RecipeRepository } from "@/lib/application/abstractions/recipe/recipe-repository";
import { Recipe } from "@/lib/domain/recipe/recipe";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import type { FileReference } from "@/lib/domain/shared/file-reference";
import type { Result } from "@/lib/domain/shared/result";
import type { Username } from "@/lib/domain/user/credentials";
import type { User } from "@/lib/domain/user/user";
import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm";

export class DrizzleRecipeRepository implements RecipeRepository {
  constructor(private readonly db: Connection) {}

  async create(
    dto: Omit<Recipe, "id" | "collaborators">,
  ): Promise<Result<Recipe>> {
    try {
      const result = await this.db
        .insert(recipes)
        .values({ ...dto, coverId: dto.cover?.id ?? null });

      if (!result.lastInsertRowid) {
        return {
          ok: false,
          error: new Error("Couldn't add recipe to database"),
        };
      }

      return {
        ok: true,
        value: {
          ...dto,
          collaborators: [],
          id: Number(result.lastInsertRowid),
        },
      };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to create recipe.", { cause: e }),
      };
    }
  }

  async findById(id: number): Promise<Result<Recipe>> {
    try {
      const [recipe] = await this.db
        .select()
        .from(recipes)
        .where(eq(recipes.id, id))
        .limit(1);

      return this.recipeFromRow(recipe);
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to find recipe by ID.", { cause: e }),
      };
    }
  }

  async findByPublicId(publicId: string): Promise<Result<Recipe>> {
    try {
      const [recipe] = await this.db
        .select()
        .from(recipes)
        .where(eq(recipes.publicId, publicId))
        .limit(1);

      return this.recipeFromRow(recipe);
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to find recipe by public ID.", { cause: e }),
      };
    }
  }

  async update(recipe: Recipe): Promise<Result<Recipe>> {
    try {
      const dto: Omit<
        Required<InferInsertModel<typeof recipes>>,
        "createdAt"
      > = {
        ...recipe,
        coverId: recipe.cover?.id ?? null,
        updatedAt: new Date(),
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
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to update recipe.", { cause: e }),
      };
    }
  }

  async delete(recipe: Recipe): Promise<Result<void>> {
    try {
      const result = await this.db
        .delete(recipes)
        .where(eq(recipes.id, recipe.id));

      if (result.rowsAffected === 0)
        return {
          ok: false,
          error: new Error("Failed to find recipe to delete."),
        };

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to delete recipe.", { cause: e }),
      };
    }
  }

  // MARK: utils

  private async recipeFromRow(
    recipe?: InferSelectModel<typeof recipes>,
  ): Promise<Result<Recipe>> {
    if (!recipe) {
      return { ok: false, error: new Error("Recipe not found") };
    }

    const [collaborators, cover] = await Promise.all([
      this.findCollaborators(recipe.id),
      this.findCover(recipe.coverId),
    ]);

    return {
      ok: true,
      value: {
        ...recipe,
        collaborators,
        cover,
      },
    };
  }

  private async findCollaborators(id: number): Promise<Collaborator[]> {
    const result = await this.db
      .select()
      .from(recipeUserPermissions)
      .innerJoin(users, eq(users.id, recipeUserPermissions.userId))
      .leftJoin(fileReference, eq(fileReference.id, users.avatarId))
      .where(eq(recipeUserPermissions.recipeId, id));

    return result.map((item) => ({
      role: item.recipe_user_permissions.role,
      user: {
        ...item.users,
        username: item.users.username as Username,
        avatar: item.file_references,
      } satisfies User,
    }));
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
