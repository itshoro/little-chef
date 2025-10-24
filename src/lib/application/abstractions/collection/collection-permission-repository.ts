import type { ResourceGuard } from "../auth/resource-guard";
import type { Collection } from "@/lib/domain/collection/collection";

export interface CollectionPermissionRepository
  extends ResourceGuard<Collection> {}
