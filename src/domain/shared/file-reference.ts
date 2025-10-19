export interface FileReference {
  id: number;
  publicId: string;
  mimeType: string;
  byteSize: number;
  url: string;
  createdAt: Date;
}

export interface TemporaryFileReference extends FileReference {
  expiresAt: Date;
}
