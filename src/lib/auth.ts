import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { getPrismaClient } from "./prisma";

const client = getPrismaClient();
const adapter = new PrismaAdapter(client.session, client.user);

const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    };
  },
});

type DatabaseUserAttributes = {
  username: string;
};

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export { lucia };
