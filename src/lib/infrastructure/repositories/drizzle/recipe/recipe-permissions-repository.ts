import type { Connection } from "@/drizzle/db";
import { recipeUserPermissions } from "@/drizzle/schema";
import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { Role } from "@/lib/domain/shared/role";
import type { User } from "@/lib/domain/user/user";
import { and, eq, inArray } from "drizzle-orm";

export class DrizzleRecipePermissionRepository
  implements RecipePermissionRepository
{
  constructor(private readonly db: Connection) {}

  async addPermission(
    recipe: Recipe,
    user: User,
    role: Role,
  ): Promise<Result<void>> {
    try {
      const result = await this.db.insert(recipeUserPermissions).values({
        recipeId: recipe.id,
        userId: user.id,
        role,
      });

      if (result.rowsAffected === 0) {
        return {
          ok: false,
          error: new Error("Failed to add permission."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to add permission.", { cause: e }),
      };
    }
  }

  async removePermission(recipe: Recipe, user: User): Promise<Result<void>> {
    try {
      const result = await this.db
        .delete(recipeUserPermissions)
        .where(
          and(
            eq(recipeUserPermissions.recipeId, recipe.id),
            eq(recipeUserPermissions.userId, user.id),
          ),
        );

      if (result.rowsAffected === 0) {
        return {
          ok: false,
          error: new Error("Failed to remove permission."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to remove permission.", { cause: e }),
      };
    }
  }

  async canView(resource: Recipe, user: User): Promise<Result<void>> {
    if (
      resource.visibility === "public" ||
      resource.visibility === "unlisted"
    ) {
      return { ok: true, value: undefined };
    }

    try {
      const [permission] = await this.db
        .select()
        .from(recipeUserPermissions)
        .where(
          and(
            eq(recipeUserPermissions.recipeId, resource.id),
            eq(recipeUserPermissions.userId, user.id),
          ),
        );

      if (!permission) {
        return {
          ok: false,
          error: new Error("User does not have permission to view recipe."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("User does not have permission to view recipe.", {
          cause: e,
        }),
      };
    }
  }

  async canUpdate(recipe: Recipe, user: User): Promise<Result<void>> {
    try {
      const [permission] = await this.db
        .select()
        .from(recipeUserPermissions)
        .where(
          and(
            eq(recipeUserPermissions.recipeId, recipe.id),
            eq(recipeUserPermissions.userId, user.id),
            inArray(recipeUserPermissions.role, [
              "owner",
              "maintainer",
              "editor",
            ]),
          ),
        );

      if (!permission) {
        return {
          ok: false,
          error: new Error("User does not have permission to update recipe."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("User does not have permission to update recipe.", {
          cause: e,
        }),
      };
    }
  }

  async canUpdatePermissions(
    recipe: Recipe,
    user: User,
  ): Promise<Result<void>> {
    try {
      const [permission] = await this.db
        .select()
        .from(recipeUserPermissions)
        .where(
          and(
            eq(recipeUserPermissions.recipeId, recipe.id),
            eq(recipeUserPermissions.userId, user.id),
            inArray(recipeUserPermissions.role, ["owner", "maintainer"]),
          ),
        );

      if (!permission) {
        return {
          ok: false,
          error: new Error(
            "User does not have permission to update recipe permissions.",
          ),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error(
          "User does not have permission to update recipe permissions.",
          { cause: e },
        ),
      };
    }
  }
}
