import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import type { Result } from "@/lib/domain/shared/result";
import type { Role } from "@/lib/domain/shared/role";
import type { Username } from "@/lib/domain/user/credentials";
import type { User } from "@/lib/domain/user/user";
import type { Connection } from "@/drizzle/db";
import { fileReference, recipeUserPermissions, users } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";

export class DrizzleRecipePermissionRepository
  implements RecipePermissionRepository
{
  constructor(private readonly db: Connection) {}

  async findCollaborators(recipe: Recipe): Promise<Collaborator[]> {
    const permissions = await this.db
      .select()
      .from(recipeUserPermissions)
      .innerJoin(users, eq(users.id, recipeUserPermissions.userId))
      .leftJoin(fileReference, eq(fileReference.id, users.avatarId))
      .where(eq(recipeUserPermissions.recipeId, recipe.id));

    return permissions.map((permission) => ({
      role: permission.recipe_user_permissions.role,
      user: {
        ...permission.users,
        avatar: permission.file_references,
        username: permission.users.username as Username,
      },
    }));
  }

  async addPermission(
    recipe: Recipe,
    user: User,
    role: Role,
  ): Promise<Result<Recipe, Error>> {
    await this.db.insert(recipeUserPermissions).values({
      recipeId: recipe.id,
      userId: user.id,
      role,
    });

    const newRecipe = {
      ...recipe,
      collaborators: [...recipe.collaborators, { user, role }],
    };

    return { ok: true, value: newRecipe };
  }

  async removePermission(recipe: Recipe, user: User): Promise<boolean> {
    const result = await this.db
      .delete(recipeUserPermissions)
      .where(
        and(
          eq(recipeUserPermissions.recipeId, recipe.id),
          eq(recipeUserPermissions.userId, user.id),
        ),
      );

    return result.rowsAffected === 1;
  }

  async canView(resource: Recipe, user: User): Promise<boolean> {
    if (
      resource.visibility === "public" ||
      resource.visibility === "unlisted"
    ) {
      return true;
    }

    const [permission] = await this.db
      .select()
      .from(recipeUserPermissions)
      .where(
        and(
          eq(recipeUserPermissions.recipeId, resource.id),
          eq(recipeUserPermissions.userId, user.id),
        ),
      );

    return Boolean(permission);
  }

  async canUpdate(recipe: Recipe, user: User): Promise<boolean> {
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

    return Boolean(permission);
  }

  async canUpdatePermissions(recipe: Recipe, user: User): Promise<boolean> {
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

    return Boolean(permission);
  }
}
