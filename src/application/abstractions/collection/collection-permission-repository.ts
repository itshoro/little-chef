import type { ResourceGuard } from "../auth/resource-guard";
import type { Collection } from "@/domain/collection/collection";

export interface CollectionPermissionRepository
  extends ResourceGuard<Collection> {}
