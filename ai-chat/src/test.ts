import { db } from "./db";

const run = async () => {
	const result = await db.execute("select 1");
	console.log(result);
	process.exit(0);
};

run();
