import "server-only";

import { PrismaClient } from "@prisma/client";

let client: PrismaClient | null = null;
function getPrismaClient() {
  if (client === null) {
    client = new PrismaClient();
  }
  return client;
}

// The symbols for dispose and asyncDispose might not exist yet.
(Symbol as any).dispose ??= Symbol("Symbol.dispose");
(Symbol as any).asyncDispose ??= Symbol("Symbol.asyncDispose");

function getPrisma() {
  const prisma = new PrismaClient();

  return {
    prisma,
    async [Symbol.asyncDispose]() {
      await prisma.$disconnect();
    },
  };
}

export { getPrismaClient, getPrisma };
