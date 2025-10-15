import prisma from "@/lib/db";

async function getAllPublishers() {
  try {
    const publishers = await prisma.publisher.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {
      status: "success",
      data: publishers,
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
