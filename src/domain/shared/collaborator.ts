import type { User } from "../user/user";
import type { Role } from "./role";

export interface Collaborator {
  role: Role;
  user: User;
}
