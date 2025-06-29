import "server-only";

import { UTApi } from "uploadthing/server";

async function createRevertibleUpload(
  file: File | null,
  utapi: UTApi = new UTApi(),
) {
  if (!file) return null;
  const result = await utapi.uploadFiles(file);

  if (result.error || !result.data) {
    throw new Error("Failed to upload file.", { cause: result });
  }

  const url = result.data.ufsUrl;
  const key: string | null = result.data.key;

  return {
    url,
    key,
    keep() {
      this.key = null as any;
    },
    async [Symbol.asyncDispose]() {
      if (this.key) await utapi.deleteFiles(this.key);
    },
  };
}

export { createRevertibleUpload };
