import type {
  CollectionListOptions,
  CollectionReadRepository,
} from "@/lib/application/abstractions/collection/collection-read-repository";
import type { User } from "@/lib/domain/user/user";

export function makeFindCollections(
  collectionReadRepository: CollectionReadRepository,
) {
  return async function findCollections(
    options: CollectionListOptions,
    user: User | null,
  ) {
    return collectionReadRepository.list(options, user);
  };
}
