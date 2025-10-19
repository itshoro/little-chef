import type { TemporaryFileReference } from "@/domain/shared/file-reference";
import type { FileStorage } from "@/application/shared/file-storage";

export function makeRevertibleFileReference<
  TRef extends TemporaryFileReference | null,
>(ref: TRef, fileStorage: FileStorage) {
  return {
    ref,
    _kept: false,
    async commit() {
      if (this.ref) await fileStorage.persistReference(this.ref);
      this._kept = true;
    },
    async [Symbol.asyncDispose]() {
      if (!this.ref || this._kept) return;
      await fileStorage.delete(this.ref);
    },
  };
}
