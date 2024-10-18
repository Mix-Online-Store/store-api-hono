/* eslint-disable ts/no-require-imports */
/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
// import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
  try {
    const result = await database.role.createMany({
      data: [
        { name: "admin", description: "Admin user role." },
        { name: "customer", description: "Customer user role." },
      ],
    });

    console.log("Success", result);
  }
  catch (error) {
    console.error("Error seeding the database categories", error);
  }
  finally {
    await database.$disconnect();
  }
}

main();
