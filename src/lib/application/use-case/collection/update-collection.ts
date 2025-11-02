import type { CollectionPermissionRepository } from "@/lib/application/abstractions/collection/collection-permission-repository";
import type { CollectionRepository } from "@/lib/application/abstractions/collection/collection-repository";
import type { Collection } from "@/lib/domain/collection/collection";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { generateSlug } from "@/lib/slug";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";

export type UpdateCollectionDTO = Omit<
  Collection,
  "id" | "publicId" | "slug" | "collaborators"
>;

export function makeUpdateCollection(
  collectionRepository: CollectionRepository,
  collectionPermissionRepository: CollectionPermissionRepository,
) {
  return async function updateCollection(
    collectionIdentifier:
      | { id: Collection["id"] }
      | { publicId: Collection["publicId"] },
    dto: UpdateCollectionDTO,
    user: User,
  ): Promise<Result<Collection>> {
    const collectionRes =
      "id" in collectionIdentifier
        ? await collectionRepository.findById(collectionIdentifier.id)
        : await collectionRepository.findByPublicId(
            collectionIdentifier.publicId,
          );
    if (!collectionRes.ok) return collectionRes;
    const collection = collectionRes.value;

    const permissionRes = await collectionPermissionRepository.canUpdate(
      collection,
      user,
    );
    if (!permissionRes.ok) return permissionRes;

    const updatedCollectionRes = await collectionRepository.update({
      ...dto,
      id: collection.id,
      publicId: collection.publicId,
      collaborators: collection.collaborators,
      slug: generateSlug(dto.name),
    });

    if (!updatedCollectionRes.ok) return updatedCollectionRes;
    taintObjectReference(
      "collection may not be passed over the network boundary, consider calling `toPublicCollection` first",
      updatedCollectionRes.value,
    );

    return updatedCollectionRes;
  };
}
