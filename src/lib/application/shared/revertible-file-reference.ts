import type { FileStorage } from "@/lib/application/shared/file-storage";
import type { TemporaryFileReference } from "@/lib/domain/shared/file-reference";

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
