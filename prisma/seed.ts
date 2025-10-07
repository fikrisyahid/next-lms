import { type Prisma, PrismaClient } from "./client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    username: "admin",
    password: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    role: "ADMIN",
    fullname: "Admin User",
  },
  {
    username: "student",
    password: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    role: "STUDENT",
    fullname: "Regular Student",
  },
  {
    username: "teacher",
    password: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    role: "TEACHER",
    fullname: "Course Teacher",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
