import type { CollectionPermissionRepository } from "@/application/abstractions/collection/collection-permission-repository";
import type { CollectionRepository } from "@/application/abstractions/collection/collection-repository";
import type { Collection } from "@/domain/collection/collection";
import type { Result } from "@/domain/shared/result";
import type { User } from "@/domain/user/user";

export type CreateCollectionDTO = Omit<Collection, "id" | "slug" | "publicId">;

export function makeDeleteCollection(
  collectionRepository: CollectionRepository,
  collectionPermissionRepository: CollectionPermissionRepository,
) {
  return async function deleteCollection(
    identifier: { publicId: Collection["publicId"] } | { id: Collection["id"] },
    user: User,
  ): Promise<Result<void, Error>> {
    const collection =
      "id" in identifier
        ? await collectionRepository.findById(identifier.id)
        : await collectionRepository.findByPublicId(identifier.publicId);

    if (!collection) {
      return { ok: false, error: new Error("Collection not found") };
    }

    if (
      !(await collectionPermissionRepository.canUpdatePermissions(
        collection,
        user,
      ))
    ) {
      return {
        ok: false,
        error: new Error(
          "User does not have permission to delete this collection",
        ),
      };
    }

    return await collectionRepository.delete(collection);
  };
}
