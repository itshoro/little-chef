import type { Result } from "@/domain/shared/result";
import type { Visibility } from "@/domain/shared/visibility";
import type { CollectionPreferencesRepository } from "@/domain/user/collection-preferences-repository";
import type { User } from "@/domain/user/user";

export function makeUpdateDefaultVisibility(
  collectionPreferencesRepository: CollectionPreferencesRepository,
) {
  return async function updateDefaultVisibility(
    user: User,
    visibility: Visibility,
  ): Promise<Result<void, Error>> {
    const preferences = await collectionPreferencesRepository.findById(
      user.collectionPreferencesId,
    );
    if (!preferences) {
      return {
        ok: false,
        error: new Error("Collection preferences not found"),
      };
    }

    preferences.defaultVisibility = visibility;
    const result = collectionPreferencesRepository.update(preferences);

    return result;
  };
}
