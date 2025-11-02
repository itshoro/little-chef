import type { CollectionPermissionRepository } from "@/lib/application/abstractions/collection/collection-permission-repository";
import type { CollectionRecipeRepository } from "@/lib/application/abstractions/collection/collection-recipe-repository";
import type { CollectionRepository } from "@/lib/application/abstractions/collection/collection-repository";
import type {
  Collection,
  CollectionDetail,
} from "@/lib/domain/collection/collection";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";

export function makeGetCollectionDetail(
  collectionRepository: CollectionRepository,
  collectionPermissionRepository: CollectionPermissionRepository,
  collectionRecipeRepository: CollectionRecipeRepository,
) {
  return async function getCollectionDetail(
    identifier: { id: Collection["id"] } | { publicId: Collection["publicId"] },
    user: User | null,
  ): Promise<Result<CollectionDetail>> {
    const collectionRes =
      "id" in identifier
        ? await collectionRepository.findById(identifier.id)
        : await collectionRepository.findByPublicId(identifier.publicId);
    if (!collectionRes.ok) return collectionRes;
    const collection = collectionRes.value;

    const permissionResult = await collectionPermissionRepository.canView(
      collection,
      user,
    );
    if (!permissionResult.ok) return permissionResult;

    const recipesResult =
      await collectionRecipeRepository.findRecipesForCollection(collection);
    if (!recipesResult.ok) return recipesResult;
    const recipes = recipesResult.value;

    const collectionDetail: CollectionDetail = {
      ...collection,
      recipes,
    };
    taintObjectReference(
      "collection details may not be passed over the network boundary, consider calling `toPublicCollectionDetail` first",
      collectionDetail,
    );

    return {
      ok: true,
      value: collectionDetail,
    };
  };
}
