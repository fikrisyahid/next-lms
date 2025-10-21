"use server";

import prisma from "@/lib/db";

async function createSubject({ name }: { name: string }) {
  if (!name) {
    return {
      status: "error",
      message: "Nama mata pelajaran wajib diisi",
    };
  }

  try {
    const existingSubject = await prisma.subjects.findFirst({
      where: { name },
    });

    if (existingSubject) {
      return {
        status: "error",
        message: "Mata pelajaran dengan nama tersebut sudah ada",
      };
    }

    const newSubject = await prisma.subjects.create({
      data: { name },
    });

    return {
      status: "success",
      subject: newSubject,
      message: "Mata pelajaran berhasil dibuat",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal membuat mata pelajaran",
    };
  }
}

export { createSubject };
