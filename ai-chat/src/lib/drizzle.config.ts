import { config } from "dotenv";

config({ path: ".env.local" });

export default {
	schema: "./src/db/schemas/**",
	out: "./src/db/drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
};
