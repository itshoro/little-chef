import type { Connection } from "@/drizzle/db";
import { fileReference, recipeUserPermissions } from "@/drizzle/schema";
import type { FileStorage } from "@/lib/application/shared/file-storage";
import type {
  FileReference,
  TemporaryFileReference,
} from "@/lib/domain/shared/file-reference";
import type { Result } from "@/lib/domain/shared/result";
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
  ): Promise<Result<TemporaryFileReference>> {
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

    if (!result) {
      return {
        ok: false,
        error: new Error("Failed to create file reference in database."),
      };
    }

    const ref: TemporaryFileReference = {
      id: result.id,
      publicId: result.publicId,
      mimeType: result.mimeType,
      byteSize: result.byteSize,
      url: result.url,
      createdAt: result.createdAt,
      expiresAt: result.expiresAt!,
    };

    return { ok: true, value: ref };
  }

  async persistReference(
    reference: TemporaryFileReference,
  ): Promise<Result<void>> {
    try {
      const result = await this.db
        .update(fileReference)
        .set({ expiresAt: null })
        .where(eq(fileReference.id, reference.id));

      if (result.rowsAffected === 0) {
        return {
          ok: false,
          error: new Error("Failed to persist file reference."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to persist file reference.", { cause: e }),
      };
    }
  }

  async delete(reference: FileReference): Promise<Result<void>> {
    try {
      const key = reference.url.split("/").at(-1)!;
      await this.utapi.deleteFiles(key);

      const result = await this.db
        .delete(fileReference)
        .where(eq(fileReference.id, reference.id));

      if (result.rowsAffected === 0) {
        return {
          ok: false,
          error: new Error("Failed to delete file reference."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to delete file reference.", { cause: e }),
      };
    }
  }
}
