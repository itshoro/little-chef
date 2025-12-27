export type PublicFileReference = {
  publicId: string;
  mimeType: string;
  byteSize: number;
  url: string;
  createdAt: Date;
};

export interface FileReference extends PublicFileReference {
  id: number;
}

export interface TemporaryFileReference extends FileReference {
  expiresAt: Date;
}

export function toPublicFileReference(
  fileReference: FileReference,
): PublicFileReference {
  return {
    publicId: fileReference.publicId,
    mimeType: fileReference.mimeType,
    byteSize: fileReference.byteSize,
    url: fileReference.url,
    createdAt: fileReference.createdAt,
  };
}
