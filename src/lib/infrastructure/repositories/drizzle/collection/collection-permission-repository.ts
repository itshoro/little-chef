import type { CollectionPermissionRepository } from "@/lib/application/abstractions/collection/collection-permission-repository";
import type { Collection } from "@/lib/domain/collection/collection";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import type { Result } from "@/lib/domain/shared/result";
import type { Role } from "@/lib/domain/shared/role";
import type { User } from "@/lib/domain/user/user";
import type { Connection } from "@/drizzle/db";
import { collections, collectionUserPermissions } from "@/drizzle/schema";
import { and, eq, inArray, or } from "drizzle-orm";

export class DrizzleCollectionPermissionRepository
  implements CollectionPermissionRepository
{
  constructor(private readonly db: Connection) {}

  async canView(collection: Collection, user: User | null): Promise<boolean> {
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

    return result.length > 0;
  }

  async canUpdate(collection: Collection, user: User): Promise<boolean> {
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

    return result.length > 0;
  }

  async canUpdatePermissions(
    collection: Collection,
    user: User,
  ): Promise<boolean> {
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

    return result.length > 0;
  }

  async addPermission(
    collection: Collection,
    user: User,
    role: Role,
  ): Promise<Result<Collection, Error>> {
    await this.db.insert(collectionUserPermissions).values({
      collectionId: collection.id,
      userId: user.id,
      role,
    });

    const newCollection = {
      ...collection,
      collaborators: [...collection.collaborators, { user, role }],
    };

    return { ok: true, value: newCollection };
  }

  async removePermission(collection: Collection, user: User): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async findCollaborators(collection: Collection): Promise<Collaborator[]> {
    throw new Error("Method not implemented.");
  }
}
