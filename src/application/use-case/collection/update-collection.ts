import type { CollectionPermissionRepository } from "@/application/abstractions/collection/collection-permission-repository";
import type { CollectionRepository } from "@/application/abstractions/collection/collection-repository";
import type { Collection } from "@/domain/collection/collection";
import type { Result } from "@/domain/shared/result";
import type { User } from "@/domain/user/user";
import { generateSlug } from "@/lib/slug";

export type UpdateCollectionDTO = Omit<
  Collection,
  "id" | "slug" | "collaborators"
>;

export function makeUpdateCollection(
  collectionRepository: CollectionRepository,
  collectionPermissionRepository: CollectionPermissionRepository,
) {
  return async function updateCollection(
    dto: UpdateCollectionDTO,
    user: User,
  ): Promise<Result<Collection, Error>> {
    const collection = await collectionRepository.findByPublicId(dto.publicId);

    if (!collection) {
      return {
        ok: false,
        error: new Error("Collection not found."),
      };
    }

    if (!(await collectionPermissionRepository.canUpdate(collection, user))) {
      return {
        ok: false,
        error: new Error(
          "User does not have permission to update this collection.",
        ),
      };
    }

    return await collectionRepository.update({
      ...dto,
      id: collection.id,
      collaborators: collection.collaborators,
      slug: generateSlug(dto.name),
    });
  };
}
