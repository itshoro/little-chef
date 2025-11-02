import type { Connection } from "@/drizzle/db";
import { collections, collectionUserPermissions } from "@/drizzle/schema";
import type { CollectionPermissionRepository } from "@/lib/application/abstractions/collection/collection-permission-repository";
import type { Collection } from "@/lib/domain/collection/collection";
import type { Result } from "@/lib/domain/shared/result";
import type { Role } from "@/lib/domain/shared/role";
import type { User } from "@/lib/domain/user/user";
import { and, eq, inArray, or } from "drizzle-orm";

export class DrizzleCollectionPermissionRepository
  implements CollectionPermissionRepository
{
  constructor(private readonly db: Connection) {}

  async canView(
    collection: Collection,
    user: User | null,
  ): Promise<Result<void>> {
    try {
      if (
        collection.visibility === "public" ||
        collection.visibility === "unlisted"
      ) {
        return { ok: true, value: undefined };
      }

      const result = await this.db
        .select()
        .from(collectionUserPermissions)
        .innerJoin(
          collections,
          eq(collections.id, collectionUserPermissions.collectionId),
        )
        .where(
          or(
            inArray(collections.visibility, ["public", "unlisted"]),
            and(
              user ? eq(collectionUserPermissions.userId, user.id) : undefined,
              eq(collectionUserPermissions.collectionId, collection.id),
              inArray(collectionUserPermissions.role, [
                "owner",
                "maintainer",
                "editor",
                "viewer",
              ]),
            ),
          ),
        );

      if (result.length === 0) {
        return {
          ok: false,
          error: new Error("User does not have permission to view collection."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("User does not have permission to view collection.", {
          cause: e,
        }),
      };
    }
  }

  async canUpdate(collection: Collection, user: User): Promise<Result<void>> {
    try {
      const result = await this.db
        .select()
        .from(collectionUserPermissions)
        .where(
          and(
            eq(collectionUserPermissions.userId, user.id),
            eq(collectionUserPermissions.collectionId, collection.id),
            inArray(collectionUserPermissions.role, [
              "owner",
              "maintainer",
              "editor",
            ]),
          ),
        );

      if (result.length === 0) {
        return {
          ok: false,
          error: new Error("User does not have permission to view collection."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("User does not have permission to view collection.", {
          cause: e,
        }),
      };
    }
  }

  async canUpdatePermissions(
    collection: Collection,
    user: User,
  ): Promise<Result<void>> {
    try {
      const result = await this.db
        .select()
        .from(collectionUserPermissions)
        .where(
          and(
            eq(collectionUserPermissions.userId, user.id),
            eq(collectionUserPermissions.collectionId, collection.id),
            inArray(collectionUserPermissions.role, ["owner", "maintainer"]),
          ),
        );

      if (result.length === 0) {
        return {
          ok: false,
          error: new Error("User does not have permission to view collection."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("User does not have permission to view collection.", {
          cause: e,
        }),
      };
    }
  }

  async addPermission(
    collection: Collection,
    user: User,
    role: Role,
  ): Promise<Result<void>> {
    try {
      const result = await this.db.insert(collectionUserPermissions).values({
        collectionId: collection.id,
        userId: user.id,
        role,
      });

      if (result.rowsAffected === 0) {
        return {
          ok: false,
          error: new Error("Failed to add permission to collection."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to add permission to collection.", {
          cause: e,
        }),
      };
    }
  }

  async removePermission(
    collection: Collection,
    user: User,
  ): Promise<Result<void>> {
    throw new Error("Method not implemented.");
  }
}
