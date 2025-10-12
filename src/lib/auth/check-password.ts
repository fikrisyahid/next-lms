"use server";

import prisma from "../db";
import bcrypt from "bcrypt";

async function checkPassword({
  userId,
  password,
}: {
  userId: string;
  password: string;
}) {
  if (!userId || !password) {
    return {
      status: "error",
      message: "User ID and password are required",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        status: "error",
        message: "User not found",
      };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return {
        status: "error",
        message: "Invalid password",
      };
    }

    return {
      status: "success",
      message: "Password is valid",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to check password",
    };
  }
}

export { checkPassword };
