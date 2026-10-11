// مهم جدا لازم مذاكرة

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import fs from "fs";
import bcrypt from "bcrypt";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toLowerCase() + modelName.slice(1);
  });

  // امسح بترتيب معكوس عشان الـ Foreign Keys ما توقفكش
  for (const modelName of modelNames.slice().reverse()) {
    const tableName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    try {
      // TRUNCATE ... RESTART IDENTITY بيمسح الداتا ويرجع الـ autoincrement id لـ 1
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
      );
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "team.json",
    "project.json",
    "user.json",
    "projectTeam.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  await deleteAllData(orderedFileNames);

  const password = await bcrypt.hash("123456", 10);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const prismaModel = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    const model: any = prisma[prismaModel as keyof typeof prisma];

    let successCount = 0;
    for (const data of jsonData) {
      try {
        const userData =
          modelName === "user"
            ? {
                ...data,
                password,
              }
            : data;
        await model.create({ data: userData });
        successCount++;
      } catch (error) {
        console.error(
          `Error seeding one record for ${modelName}:`,
          data,
          error,
        );
      }
    }
    console.log(
      `Seeded ${successCount}/${jsonData.length} records for ${modelName}`,
    );
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

// import { PrismaClient } from "../src/generated/prisma/client.js";
// import { PrismaPg } from "@prisma/adapter-pg";
// import dotenv from "dotenv";
// import fs from "fs";

// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config();

// const connectionString = `${process.env.DATABASE_URL}`;
// const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({ adapter });

// async function deleteAllData(orderedFileNames: string[]) {
//   const modelNames = orderedFileNames.map((fileName) => {
//     const modelName = path.basename(fileName, path.extname(fileName));
//     return modelName.charAt(0).toLowerCase() + modelName.slice(1);
//   });

//   for (const modelName of modelNames) {
//     const model: any = prisma[modelName as keyof typeof prisma];
//     try {
//       await model.deleteMany({});
//       console.log(`Cleared data from ${modelName}`);
//     } catch (error) {
//       console.error(`Error clearing data from ${modelName}:`, error);
//     }
//   }
// }

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// async function main() {
//   const dataDirectory = path.join(__dirname, "seedData");

//   const orderedFileNames = [
//     // "team.json",
//     // "project.json",
//     // "projectTeam.json",
//     // "user.json",
//     // "task.json",
//     // "attachment.json",
//     // "comment.json",
//     // "taskAssignment.json",

//     "team.json",
//     "roject.json",
//     "user.json",
//     "projectTeam.json",
//     "task.json",
//     "attachment.json",
//     "comment.json",
//     "taskAssignment.json",
//   ];

//   await deleteAllData(orderedFileNames);

//   for (const fileName of orderedFileNames) {
//     const filePath = path.join(dataDirectory, fileName);
//     const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//     const modelName = path.basename(fileName, path.extname(fileName));
//     const prismaModel = modelName.charAt(0).toLowerCase() + modelName.slice(1);
//     const model: any = prisma[prismaModel as keyof typeof prisma];

//     try {
//       for (const data of jsonData) {
//         await model.create({ data });
//       }
//       console.log(`Seeded ${modelName} with data from ${fileName}`);
//     } catch (error) {
//       console.error(`Error seeding data for ${modelName}:`, error);
//     }
//   }
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());
