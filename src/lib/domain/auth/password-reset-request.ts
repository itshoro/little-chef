import type { User } from "../user/user";

export interface PasswordResetRequest {
  id: number;
  user: User;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}
