import type { Collection } from "@/lib/domain/collection/collection";
import type { ResourceGuard } from "../auth/resource-guard";

export interface CollectionPermissionRepository
  extends ResourceGuard<Collection> {}
