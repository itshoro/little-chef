import type { CollectionPermissionRepository } from "@/lib/application/abstractions/collection/collection-permission-repository";
import type { CollectionRepository } from "@/lib/application/abstractions/collection/collection-repository";
import type { Collection } from "@/lib/domain/collection/collection";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { nanoid } from "@/lib/nanoid";
import { generateSlug } from "@/lib/slug";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";

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
  ): Promise<Result<Collection>> {
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

    taintObjectReference(
      "collections may not be passed over the network boundary, consider calling `toPublicCollection` first.",
      createResult.value,
    );

    return createResult;
  };
}
