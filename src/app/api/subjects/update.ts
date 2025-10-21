"use server";

import prisma from "@/lib/db";

async function updateSubject({ id, name }: { id: string; name: string }) {
  if (!id || !name) {
    return {
      status: "error",
      message: "ID dan nama mata pelajaran wajib diisi",
    };
  }

  try {
    const existingSubject = await prisma.subjects.findFirst({
      where: { name },
    });

    if (existingSubject && existingSubject.id !== id) {
      return {
        status: "error",
        message: "Mata pelajaran dengan nama tersebut sudah ada",
      };
    }

    const updatedSubject = await prisma.subjects.update({
      where: { id },
      data: { name },
    });

    return {
      status: "success",
      subject: updatedSubject,
      message: "Sukses memperbarui mata pelajaran",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal memperbarui mata pelajaran",
    };
  }
}

export { updateSubject };
