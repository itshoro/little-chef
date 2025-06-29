import type { DrizzleUser } from "@/drizzle/schema";
import type { UserOutputPublicDTO } from "./types";

export function toUserOutputPublicDTO(user: DrizzleUser): UserOutputPublicDTO {
  return {
    publicId: user.publicId,
    username: user.username,
    avatar: user.avatar,
  };
}
