import type {
  TemporaryFileReference,
  FileReference,
} from "@/domain/shared/file-reference";
import type { FileStorage } from "@/application/shared/file-storage";
import type { Connection } from "@/drizzle/db";
import { fileReference } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import type { UTApi } from "uploadthing/server";

export class UploadthingFileStorage implements FileStorage {
  constructor(
    private readonly utapi: UTApi,
    private readonly db: Connection,
  ) {}

  async storeTemporary(
    publicId: string,
    file: File,
  ): Promise<TemporaryFileReference> {
    const fileUpload = await this.utapi.uploadFiles(file);

    if (fileUpload.error) {
      throw new Error(`Failed to upload file: ${fileUpload.error.message}`);
    }

    const [result] = await this.db
      .insert(fileReference)
      .values({
        publicId,
        byteSize: fileUpload.data.size,
        mimeType: file.type, // unsafe, as this is based on the file extension
        url: fileUpload.data.ufsUrl,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      })
      .returning();

    const ref: TemporaryFileReference = {
      id: result.id,
      publicId: result.publicId,
      mimeType: result.mimeType,
      byteSize: result.byteSize,
      url: result.url,
      createdAt: result.createdAt,
      expiresAt: result.expiresAt!,
    };

    return ref;
  }

  async persistReference(reference: TemporaryFileReference): Promise<void> {
    this.db
      .update(fileReference)
      .set({ expiresAt: null })
      .where(eq(fileReference.id, reference.id));
  }

  async delete(reference: FileReference): Promise<void> {
    const key = reference.url.split("/").at(-1)!;
    await this.utapi.deleteFiles(key);

    await this.db
      .delete(fileReference)
      .where(eq(fileReference.id, reference.id));
  }
}
