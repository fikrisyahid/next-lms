'use server';

import prisma from "@/lib/db";

async function getUser(id: string) {
  if (!id)
    return {
      status: "error",
      message: "User ID is required",
    };

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return {
      status: "success",
      user,
      message: "User fetched successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to fetch user",
    };
  }
}

interface IGetAllUsersOptions {
  ebooks_count?: boolean;
}

async function getAllUsers(options?: IGetAllUsersOptions) {
  try {
    const additionalSelect = options?.ebooks_count
      ? {
          _count: {
            select: { ebooks: true },
          },
        }
      : {};

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        ...additionalSelect,
      },
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      ebooks_count: user._count?.ebooks || 0,
    }));

    return {
      status: "success",
      users: formattedUsers,
      message: "Users fetched successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to fetch users",
    };
  }
}

export { getUser, getAllUsers };
