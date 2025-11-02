import type { Result } from "@/lib/domain/shared/result";
import type { Visibility } from "@/lib/domain/shared/visibility";
import type { CollectionPreferencesRepository } from "@/lib/application/abstractions/user/collection-preferences-repository";
import type { User } from "@/lib/domain/user/user";

export function makeUpdateDefaultVisibility(
  collectionPreferencesRepository: CollectionPreferencesRepository,
) {
  return async function updateDefaultVisibility(
    user: User,
    visibility: Visibility,
  ): Promise<Result<void>> {
    const preferencesRes = await collectionPreferencesRepository.findById(
      user.collectionPreferencesId,
    );
    if (!preferencesRes.ok) {
      return {
        ok: false,
        error: new Error("Collection preferences not found"),
      };
    }

    preferencesRes.value.defaultVisibility = visibility;
    const result = collectionPreferencesRepository.update(preferencesRes.value);

    return result;
  };
}
