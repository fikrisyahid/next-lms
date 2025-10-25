"use server";

import prisma from "@/lib/db";

type Params = {
  name: string;
  logoUrl?: string;
};

async function createPublisher({ name, logoUrl }: Params) {
  if (!name) {
    return {
      status: "error",
      message: "Nama penerbit wajib diisi",
    };
  }

  try {
    const existingPublisher = await prisma.publisher.findFirst({
      where: { name },
    });

    if (existingPublisher) {
      return {
        status: "error",
        message: "Penerbit dengan nama tersebut sudah ada",
      };
    }

    const newPublisher = await prisma.publisher.create({
      data: { name, logoUrl },
    });

    return {
      status: "success",
      publisher: newPublisher,
      message: "Sukses menambahkan penerbit baru",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal menambahkan penerbit baru",
    };
  }
}

export { createPublisher };
