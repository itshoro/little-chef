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
import { eq, type InferInsertModel } from "drizzle-orm";

export class DrizzleCollectionRepository implements CollectionRepository {
  constructor(private readonly db: Connection) {}

  async create(
    params: Omit<Collection, "id" | "collaborators">,
  ): Promise<Result<Collection, Error>> {
    const [result] = await this.db
      .insert(collections)
      .values({ ...params })
      .returning();

    return {
      ok: true,
      value: {
        ...params,
        id: result.id,
        collaborators: [],
      },
    };
  }

  async findById(id: number): Promise<Collection | null> {
    const [result] = await this.db
      .select()
      .from(collections)
      .where(eq(collections.id, id));

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      slug: result.slug,
      publicId: result.publicId,
      visibility: result.visibility,
      collaborators: await this.findCollaborators(result.id),
    };
  }

  async findByPublicId(publicId: string): Promise<Collection | null> {
    const [result] = await this.db
      .select()
      .from(collections)
      .where(eq(collections.publicId, publicId));

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      slug: result.slug,
      publicId: result.publicId,
      visibility: result.visibility,
      collaborators: await this.findCollaborators(result.id),
    };
  }

  async update(collection: Collection): Promise<Result<Collection, Error>> {
    const dto: InferInsertModel<typeof collections> = {
      ...collection,
    };

    const result = await this.db
      .update(collections)
      .set(dto)
      .where(eq(collections.id, collection.id));

    if (result.rowsAffected === 0)
      return { ok: false, error: new Error("Collection not found") };

    return { ok: true, value: collection };
  }

  async delete(collection: Collection): Promise<Result<void, Error>> {
    const result = await this.db
      .delete(collections)
      .where(eq(collections.id, collection.id));

    if (result.rowsAffected === 0) {
      return { ok: false, error: new Error("Collection not found") };
    }

    return { ok: true, value: undefined };
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
}
