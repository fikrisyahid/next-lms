import prisma from "@/lib/db";

async function createPublisher({name}: {name: string}) {
  if (!name) {
    return {
      status: "error",
      message: "Publisher name is required",
    };
  }

  try {
    const existingPublisher = await prisma.publisher.findFirst({
      where: { name },
    });

    if (existingPublisher) {
      return {
        status: "error",
        message: "Publisher already exists",
      };
    }

    const newPublisher = await prisma.publisher.create({
      data: { name },
    });

    return {
      status: "success",
      publisher: newPublisher,
      message: "Publisher created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create publisher",
    };
  }
}

export { createPublisher };