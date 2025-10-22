import type {
  CollectionListOptions,
  CollectionReadRepository,
} from "@/application/abstractions/collection/collection-read-repository";
import type { User } from "@/domain/user/user";

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
