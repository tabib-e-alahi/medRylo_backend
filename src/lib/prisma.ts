import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import envConfig from "../config/route.config";
import { PrismaClient } from "../../generated/prisma/client";


const connectionString = `${envConfig.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };