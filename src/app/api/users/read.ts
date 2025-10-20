"use server";

import prisma from "@/lib/db";

async function getUser(id: string) {
  if (!id)
    return {
      status: "error",
      message: "ID pengguna wajib diisi",
    };

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return {
      status: "success",
      user,
    };
  } catch {
    return {
      status: "error",
      message: "Gagal mengambil data pengguna",
    };
  }
}

type GetAllUsersOptions = {
  ebooks_count?: boolean;
};

async function getAllUsers(options?: GetAllUsersOptions) {
  try {
    const additionalSelect = options?.ebooks_count
      ? { _count: { select: { ebooks: true } } }
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
      message: "Sukses mengambil daftar pengguna",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal mengambil daftar pengguna",
    };
  }
}

export { getUser, getAllUsers };
