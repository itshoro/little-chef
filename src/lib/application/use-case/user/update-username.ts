import type { Username } from "@/lib/domain/user/credentials";
import type { User } from "@/lib/domain/user/user";
import type { UserRepository } from "@/lib/application/abstractions/user/user-repository";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";

export function makeUpdateUsername(userRepository: UserRepository) {
  return async function updateProfileImage(user: User, username: Username) {
    const result = await userRepository.update({ ...user, username });
    if (!result.ok) return result;

    taintObjectReference(
      "users may not be passed over the network boundary, consider calling `toPublicUser` first",
      result.value,
    );

    return result;
  };
}
