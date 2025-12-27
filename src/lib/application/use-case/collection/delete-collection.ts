import type { CollectionPermissionRepository } from "@/lib/application/abstractions/collection/collection-permission-repository";
import type { CollectionRepository } from "@/lib/application/abstractions/collection/collection-repository";
import type { Collection } from "@/lib/domain/collection/collection";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export function makeDeleteCollection(
  collectionRepository: CollectionRepository,
  collectionPermissionRepository: CollectionPermissionRepository,
) {
  return async function deleteCollection(
    identifier: { publicId: Collection["publicId"] } | { id: Collection["id"] },
    user: User,
  ): Promise<Result<void>> {
    const collectionRes =
      "id" in identifier
        ? await collectionRepository.findById(identifier.id)
        : await collectionRepository.findByPublicId(identifier.publicId);

    if (!collectionRes.ok) return collectionRes;
    const collection = collectionRes.value;

    const permissionRes =
      await collectionPermissionRepository.canUpdatePermissions(
        collection,
        user,
      );
    if (!permissionRes.ok) return permissionRes;

    return await collectionRepository.delete(collection);
  };
}
