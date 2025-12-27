import type {
  FileReference,
  TemporaryFileReference,
} from "@/lib/domain/shared/file-reference";
import type { Result } from "@/lib/domain/shared/result";

export interface FileStorage {
  storeTemporary(
    publicId: string,
    File: File,
  ): Promise<Result<TemporaryFileReference>>;
  persistReference(reference: TemporaryFileReference): Promise<Result<void>>;

  delete(reference: FileReference): Promise<Result<void>>;
}
