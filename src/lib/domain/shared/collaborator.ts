import { toPublicUser, type PublicUser, type User } from "../user/user";
import type { Role } from "./role";

export interface Collaborator {
  role: Role;
  user: User;
}

export interface PublicCollaborator {
  role: Role;
  user: PublicUser;
}

export function toPublicCollaborator(
  collaborator: Collaborator,
): PublicCollaborator {
  return {
    role: collaborator.role,
    user: toPublicUser(collaborator.user),
  };
}
