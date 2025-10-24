import type { Collection } from "@/lib/domain/collection/collection";
import type { Result } from "@/lib/domain/shared/result";

export interface CollectionRepository {
  create(
    params: Omit<Collection, "id" | "collaborators">,
  ): Promise<Result<Collection, Error>>;
  findById(id: number): Promise<Collection | null>;
  findByPublicId(publicId: string): Promise<Collection | null>;
  update(collection: Collection): Promise<Result<Collection, Error>>;
  delete(collection: Collection): Promise<Result<void, Error>>;
}
