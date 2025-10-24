import type { Result } from "@/lib/domain/shared/result";
import type { Visibility } from "@/lib/domain/shared/visibility";
import type { CollectionPreferencesRepository } from "@/lib/domain/user/collection-preferences-repository";
import type { User } from "@/lib/domain/user/user";

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
