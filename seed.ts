/* eslint-disable no-console */
import { drizzle } from "drizzle-orm/connect";

import { users } from "@/db/schema";
import env from "@/env";

async function main() {
  const db = await drizzle("neon-http", env.DATABASE_URL!);

  const user: typeof users.$inferInsert = {
    name: "John",
    email: "john@example.com",
    password: "zattwine",
  };

  await db.insert(users).values(user);
  console.log("New user created!");

  const usersResult = await db.select().from(users);
  console.log("Getting all users from the database: ", usersResult);
}

main();
