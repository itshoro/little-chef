import { makeUpdateUsername } from "@/application/use-case/user/update-username";
import { db } from "@/drizzle/db";
import { DrizzleUserRepository } from "@/infrastructure/repositories/drizzle/user/user-repository";

export async function updateUsername(
  ...args: Parameters<ReturnType<typeof makeUpdateUsername>>
): ReturnType<ReturnType<typeof makeUpdateUsername>> {
  const userRepository = new DrizzleUserRepository(db);

  const updateUsername = makeUpdateUsername(userRepository);

  return await updateUsername(...args);
}
