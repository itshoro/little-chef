import type { Collection } from "@/lib/domain/collection/collection";
import type { Result } from "@/lib/domain/shared/result";

export interface CollectionRepository {
  create(
    params: Omit<Collection, "id" | "collaborators">,
  ): Promise<Result<Collection>>;
  findById(id: number): Promise<Result<Collection>>;
  findByPublicId(publicId: string): Promise<Result<Collection>>;
  update(collection: Collection): Promise<Result<Collection>>;
  delete(collection: Collection): Promise<Result<void>>;
}
