import type { Collaborator } from "../../../domain/shared/collaborator";
import type { Result } from "../../../domain/shared/result";
import type { Visibility } from "../../../domain/shared/visibility";
import type { User } from "../../../domain/user/user";

export interface ResourceGuard<
  TResource extends { id: unknown; visibility: Visibility },
> {
  canView(resource: TResource, user: User | null): Promise<boolean>;
  canUpdate(id: TResource["id"], user: User): Promise<boolean>;
  canUpdatePermissions(id: TResource["id"], user: User): Promise<boolean>;

  addPermission(
    id: TResource["id"],
    user: User,
    role: string,
  ): Promise<Result<void, Error>>;
  removePermission(id: TResource["id"], user: User): Promise<boolean>;
  findCollaborators(id: TResource["id"]): Promise<Collaborator[]>;
}
