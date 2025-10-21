import type { Username } from "@/domain/user/credentials";
import type { User } from "@/domain/user/user";
import type { UserRepository } from "@/domain/user/user-repository";

export function makeUpdateUsername(userRepository: UserRepository) {
  return async function updateProfileImage(user: User, username: Username) {
    const result = await userRepository.update({ ...user, username });
    if (!result.ok) return result;

    return result;
  };
}
