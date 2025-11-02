import type { Connection } from "@/drizzle/db";
import {
  collections,
  collectionUserPermissions,
  fileReference,
  users,
} from "@/drizzle/schema";
import type { CollectionRepository } from "@/lib/application/abstractions/collection/collection-repository";
import type { Collection } from "@/lib/domain/collection/collection";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import type { Result } from "@/lib/domain/shared/result";
import type { Username } from "@/lib/domain/user/credentials";
import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm";

export class DrizzleCollectionRepository implements CollectionRepository {
  constructor(private readonly db: Connection) {}

  async create(
    params: Omit<Collection, "id" | "collaborators">,
  ): Promise<Result<Collection>> {
    try {
      const [result] = await this.db
        .insert(collections)
        .values({ ...params })
        .returning();

      if (!result) {
        return {
          ok: false,
          error: new Error("Failed to create collection."),
        };
      }

      return {
        ok: true,
        value: {
          ...params,
          id: result.id,
          collaborators: [],
        },
      };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to create collection.", { cause: e }),
      };
    }
  }

  async findById(id: number): Promise<Result<Collection>> {
    try {
      const [result] = await this.db
        .select()
        .from(collections)
        .where(eq(collections.id, id));

      return this.collectionFromRow(result);
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to find collection by ID.", { cause: e }),
      };
    }
  }

  async findByPublicId(publicId: string): Promise<Result<Collection>> {
    try {
      const [result] = await this.db
        .select()
        .from(collections)
        .where(eq(collections.publicId, publicId));

      return this.collectionFromRow(result);
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to find collection by public ID.", {
          cause: e,
        }),
      };
    }
  }

  async update(collection: Collection): Promise<Result<Collection>> {
    try {
      const dto: Omit<
        InferInsertModel<typeof collections>,
        "id" | "publicId" | "createdAt" | "itemCount" | "likes"
      > = {
        name: collection.name,
        slug: collection.slug,
        visibility: collection.visibility,
        updatedAt: new Date(),
      };

      const result = await this.db
        .update(collections)
        .set(dto)
        .where(eq(collections.id, collection.id));

      if (result.rowsAffected === 0) {
        return { ok: false, error: new Error("Collection not found") };
      }

      return { ok: true, value: collection };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to update collection.", { cause: e }),
      };
    }
  }

  async delete(collection: Collection): Promise<Result<void>> {
    try {
      const result = await this.db
        .delete(collections)
        .where(eq(collections.id, collection.id));

      if (result.rowsAffected === 0) {
        return { ok: false, error: new Error("Collection not found") };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to delete collection.", { cause: e }),
      };
    }
  }

  private async findCollaborators(
    collectionId: number,
  ): Promise<Collaborator[]> {
    const result = await this.db
      .select({
        role: collectionUserPermissions.role,
        user: users,
        userAvatar: fileReference,
      })
      .from(collectionUserPermissions)
      .innerJoin(users, eq(users.id, collectionUserPermissions.userId))
      .leftJoin(fileReference, eq(fileReference.id, users.avatarId))
      .where(eq(collectionUserPermissions.collectionId, collectionId));

    return result.map(({ role, user, userAvatar }) => ({
      role,
      user: {
        ...user,
        username: user.username as Username,
        avatar: userAvatar,
      },
    }));
  }

  private async collectionFromRow(
    row: InferSelectModel<typeof collections> | undefined,
  ): Promise<Result<Collection>> {
    if (!row) {
      return { ok: false, error: new Error("Collection not found") };
    }

    const collection: Collection = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      publicId: row.publicId,
      visibility: row.visibility,
      collaborators: await this.findCollaborators(row.id),
    };

    return { ok: true, value: collection };
  }
}
