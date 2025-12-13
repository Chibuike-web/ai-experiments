import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
import * as schema from "./schemas";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(pool, { schema });
