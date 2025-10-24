import type { Username } from "@/lib/domain/user/credentials";
import type { User } from "@/lib/domain/user/user";
import type { UserRepository } from "@/lib/domain/user/user-repository";

export function makeUpdateUsername(userRepository: UserRepository) {
  return async function updateProfileImage(user: User, username: Username) {
    const result = await userRepository.update({ ...user, username });
    if (!result.ok) return result;

    return result;
  };
}
