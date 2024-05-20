import sqlite from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sql = sqlite(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

export { db };
