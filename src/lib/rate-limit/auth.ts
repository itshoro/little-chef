import { headers } from "next/headers";
import { TokenBucketRateLimit } from "./token-bucket";

const loginBucket = new TokenBucketRateLimit<string>(5, 15);
const signUpBucket = new TokenBucketRateLimit<string>(3, 60);

async function isRateLimited(
  bucket: TokenBucketRateLimit<string>,
  cost: number,
) {
  const headerStore = await headers();
  const ip = headerStore.get("X-Forwarded-For");
  if (ip === null) return true;

  return !bucket.consume(ip, cost);
}

async function isRateLimitedLogin() {
  return isRateLimited(loginBucket, 1);
}

async function isRateLimitedSignUp() {
  return isRateLimited(signUpBucket, 1);
}

export { isRateLimitedLogin, isRateLimitedSignUp };
