"use server";

import prisma from "@/lib/db";

type GetAllPublishersOptions = {
  ebooks_count?: boolean;
};

async function getAllPublishers(options?: GetAllPublishersOptions) {
  try {
    const additionalSelect = options?.ebooks_count
      ? { _count: { select: { ebooks: true } } }
      : {};

    const publishers = await prisma.publisher.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        ...additionalSelect,
      },
    });

    const formattedPublishers = publishers.map((publisher) => ({
      ...publisher,
      ebooks_count: publisher._count?.ebooks || 0,
    }));

    return {
      status: "success",
      data: formattedPublishers,
      message: "Sukses mengambil daftar penerbit",
    };
  } catch {
    return {
      status: "error",
      data: null,
      message: "Gagal mengambil daftar penerbit",
    };
  }
}

async function getPublisher({ id }: { id: string }) {
  try {
    const publisher = await prisma.publisher.findUnique({
      where: { id },
    });

    if (!publisher) {
      return {
        status: "error",
        message: "Penerbit tidak ditemukan",
      };
    }

    return {
      status: "success",
      data: publisher,
      message: "Sukses mengambil data penerbit",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal mengambil data penerbit",
    };
  }
}

export { getAllPublishers, getPublisher };
