import type { Collaborator } from "../../../domain/shared/collaborator";
import type { Result } from "../../../domain/shared/result";
import type { User } from "../../../domain/user/user";

export interface ResourceGuard<TResource> {
  canView(resource: TResource, user: User | null): Promise<boolean>;
  canUpdate(resource: TResource, user: User): Promise<boolean>;
  canUpdatePermissions(resource: TResource, user: User): Promise<boolean>;

  addPermission(
    id: TResource,
    user: User,
    role: string,
  ): Promise<Result<TResource, Error>>;
  removePermission(resource: TResource, user: User): Promise<boolean>;
  findCollaborators(resource: TResource): Promise<Collaborator[]>;
}
