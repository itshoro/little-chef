import "server-only";

import { PrismaClient } from "@prisma/client";

let client: PrismaClient | null = null;
function getPrismaClient() {
  if (client === null) {
    client = new PrismaClient();
  }
  return client;
}

export { getPrismaClient };
