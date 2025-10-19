import type { Collaborator } from "@/application/abstractions/auth/resource-guard";
import type { Recipe } from "@/domain/recipe/recipe";
import type { RecipePermissionRepository } from "@/application/abstractions/recipe/recipe-permission-repository";
import type { Result } from "@/domain/shared/result";
import type { Role } from "@/domain/shared/role";
import type { User } from "@/domain/user/user";
import type { Connection } from "@/drizzle/db";
import { recipeUserPermissions, users } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";

export class DrizzleRecipePermissionRepository
  implements RecipePermissionRepository
{
  constructor(private readonly db: Connection) {}

  async findCollaborators(id: Recipe["id"]): Promise<Collaborator[]> {
    const permissions = await this.db
      .select({ role: recipeUserPermissions.role, user: users })
      .from(recipeUserPermissions)
      .innerJoin(users, eq(users.id, recipeUserPermissions.userId))
      .where(eq(recipeUserPermissions.recipeId, id));

    return permissions as Collaborator[];
  }

  async addPermission(
    id: Recipe["id"],
    user: User,
    role: Role,
  ): Promise<Result<void, Error>> {
    await this.db.insert(recipeUserPermissions).values({
      recipeId: id,
      userId: user.id,
      role,
    });

    return { ok: true, value: undefined };
  }

  async removePermission(id: Recipe["id"], user: User): Promise<boolean> {
    const result = await this.db
      .delete(recipeUserPermissions)
      .where(
        and(
          eq(recipeUserPermissions.recipeId, id),
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

  async canUpdate(id: Recipe["id"], user: User): Promise<boolean> {
    const [permission] = await this.db
      .select()
      .from(recipeUserPermissions)
      .where(
        and(
          eq(recipeUserPermissions.recipeId, id),
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

  async canUpdatePermissions(id: Recipe["id"], user: User): Promise<boolean> {
    const [permission] = await this.db
      .select()
      .from(recipeUserPermissions)
      .where(
        and(
          eq(recipeUserPermissions.recipeId, id),
          eq(recipeUserPermissions.userId, user.id),
          inArray(recipeUserPermissions.role, ["owner", "maintainer"]),
        ),
      );

    return Boolean(permission);
  }
}
