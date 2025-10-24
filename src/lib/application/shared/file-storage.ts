import type {
  FileReference,
  TemporaryFileReference,
} from "@/lib/domain/shared/file-reference";

export interface FileStorage {
  storeTemporary(publicId: string, File: File): Promise<TemporaryFileReference>;
  persistReference(reference: TemporaryFileReference): Promise<void>;

  delete(reference: FileReference): Promise<void>;
}
