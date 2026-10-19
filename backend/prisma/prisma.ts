import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../src/config/env.js";

const connectionString = `${env.DATABASE_URL}`;

try {
  const host = new URL(connectionString).hostname;
  console.log("Database host:", host);
} catch {
  console.error("DATABASE_URL is not a valid URL");
}
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
