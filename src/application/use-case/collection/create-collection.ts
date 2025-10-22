import type { CollectionPermissionRepository } from "@/application/abstractions/collection/collection-permission-repository";
import type { CollectionRepository } from "@/application/abstractions/collection/collection-repository";
import type {
  Collection,
  CollectionDetail,
} from "@/domain/collection/collection";
import type { Result } from "@/domain/shared/result";
import type { User } from "@/domain/user/user";
import { nanoid } from "@/lib/nanoid";
import { generateSlug } from "@/lib/slug";

export type CreateCollectionDTO = Omit<
  Collection,
  "id" | "slug" | "publicId" | "collaborators"
>;

export function makeCreateCollection(
  collectionRepository: CollectionRepository,
  collectionPermissionRepository: CollectionPermissionRepository,
) {
  return async function createCollection(
    dto: CreateCollectionDTO,
    user: User,
  ): Promise<Result<CollectionDetail, Error>> {
    const createResult = await collectionRepository.create({
      ...dto,
      publicId: nanoid(),
      slug: generateSlug(dto.name),
    });
    if (!createResult.ok) return createResult;

    const permissionResult = await collectionPermissionRepository.addPermission(
      createResult.value,
      user,
      "owner",
    );
    if (!permissionResult.ok) return permissionResult;

    return { ok: true, value: { ...permissionResult.value, recipes: [] } };
  };
}
