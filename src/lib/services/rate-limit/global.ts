import "server-only";

import { headers } from "next/headers";
import { TokenBucket } from "./token-bucket";
import type { RequestType } from "./types";

const globalBucket = new TokenBucket<string>(25, 2);

const costMap: Record<RequestType, number> = {
  read: 1,
  write: 3,
};

export async function isRateLimitedGlobally(requestType: RequestType = "read") {
  const headerStore = await headers();

  const ip = headerStore.get("X-Forwarded-For");
  if (ip === null) return true;

  return !globalBucket.consume(ip, costMap[requestType]);
}
