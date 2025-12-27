import type {
  Collection,
  CollectionDetail,
} from "@/lib/domain/collection/collection";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

type PaginationOptions = {
  page: number;
  pageSize: number;
};

type InternalSearchOptions = {
  query: string;
};

export interface CollectionListOptions {
  pagination?: PaginationOptions;
  search?: InternalSearchOptions;
}

export interface CollectionReadRepository {
  list(
    options: CollectionListOptions,
    user?: User | null,
  ): Promise<Result<Collection[]>>;

  findDetailByIdentifier(
    identifier: { id: Collection["id"] } | { publicId: Collection["publicId"] },
    user?: User | null,
  ): Promise<Result<CollectionDetail>>;
}
