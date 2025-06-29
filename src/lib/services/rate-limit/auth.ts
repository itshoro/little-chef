import "server-only";

import { headers } from "next/headers";
import { TokenBucket } from "./token-bucket";

const loginBucket = new TokenBucket<string>(5, 15);
const signUpBucket = new TokenBucket<string>(3, 60);

async function isRateLimited(bucket: TokenBucket<string>, cost: number) {
  const headerStore = await headers();
  const ip = headerStore.get("X-Forwarded-For");
  if (ip === null) return true;

  return !bucket.consume(ip, cost);
}

export async function isRateLimitedLogin() {
  return isRateLimited(loginBucket, 1);
}

export async function isRateLimitedSignUp() {
  return isRateLimited(signUpBucket, 1);
}
