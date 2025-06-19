import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const sql = createClient({ url: `file:${process.env.DATABASE_URL}` });
const db = drizzle(sql, { schema });

export { db };
