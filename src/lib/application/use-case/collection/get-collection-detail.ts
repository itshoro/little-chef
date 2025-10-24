import type { CollectionPermissionRepository } from "@/lib/application/abstractions/collection/collection-permission-repository";
import type { CollectionRecipeRepository } from "@/lib/application/abstractions/collection/collection-recipe-repository";
import type { CollectionRepository } from "@/lib/application/abstractions/collection/collection-repository";
import type {
  Collection,
  CollectionDetail,
} from "@/lib/domain/collection/collection";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export function makeGetCollectionDetail(
  collectionRepository: CollectionRepository,
  collectionPermissionRepository: CollectionPermissionRepository,
  collectionRecipeRepository: CollectionRecipeRepository,
) {
  return async function getCollectionDetail(
    identifier: { id: Collection["id"] } | { publicId: Collection["publicId"] },
    user: User | null,
  ): Promise<Result<CollectionDetail, Error>> {
    const collection =
      "id" in identifier
        ? await collectionRepository.findById(identifier.id)
        : await collectionRepository.findByPublicId(identifier.publicId);

    if (!collection) {
      return { ok: false, error: new Error("Collection not found.") };
    }

    if (!(await collectionPermissionRepository.canView(collection, user))) {
      return { ok: false, error: new Error("Access denied.") };
    }

    const recipesResult =
      await collectionRecipeRepository.findRecipesForCollection(collection);
    if (!recipesResult.ok) return recipesResult;

    return {
      ok: true,
      value: { ...collection, recipes: recipesResult.value },
    };
  };
}
