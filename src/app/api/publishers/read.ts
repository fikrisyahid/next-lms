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
      message: "Publishers fetched successfully",
    };
  } catch {
    return {
      status: "error",
      data: null,
      message: "Failed to fetch publishers",
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
        message: "Publisher not found",
      };
    }

    return {
      status: "success",
      data: publisher,
      message: "Publisher fetched successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to fetch publisher",
    };
  }
}

export { getAllPublishers, getPublisher };
