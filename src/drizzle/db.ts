import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export type Transaction = Parameters<
  Parameters<(typeof db)["transaction"]>[0]
>[0];

export type Connection = typeof db | Transaction;

const sql = createClient({ url: `file:${process.env.DATABASE_URL}` });
const db = drizzle(sql, { schema });

export { db };
