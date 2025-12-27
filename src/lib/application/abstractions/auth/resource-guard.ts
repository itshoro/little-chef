import type { Result } from "../../../domain/shared/result";
import type { User } from "../../../domain/user/user";

export interface ResourceGuard<TResource> {
  canView(resource: TResource, user: User | null): Promise<Result<void>>;
  canUpdate(resource: TResource, user: User): Promise<Result<void>>;
  canUpdatePermissions(resource: TResource, user: User): Promise<Result<void>>;

  addPermission(id: TResource, user: User, role: string): Promise<Result<void>>;
  removePermission(resource: TResource, user: User): Promise<Result<void>>;
}
