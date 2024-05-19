import sqlite from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sql = sqlite(process.env.DATABASE_URL);
const db = drizzle(sql);

export { db };
