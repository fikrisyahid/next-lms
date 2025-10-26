"use server";

import prisma from "@/lib/db";
import { deleteFromBucket } from "@/lib/storage/delete-from-bucket";
import { extractFilePathFromUrl } from "@/lib/storage/extract-path";

type Params = {
  id: string;
  name: string;
  logoUrl?: string;
};

async function updatePublisher({ id, name, logoUrl }: Params) {
  if (!id || !name) {
    return {
      status: "error",
      message: "ID dan nama penerbit wajib diisi",
    };
  }

  try {
    const existingPublisher = await prisma.publisher.findFirst({
      where: { name },
    });

    if (existingPublisher?.name === name && existingPublisher.id !== id) {
      return {
        status: "error",
        message: "Penerbit dengan nama tersebut sudah ada",
      };
    }

    const existingLogoUrl = existingPublisher?.logoUrl;
    if (logoUrl && existingLogoUrl) {
      const filePath = extractFilePathFromUrl({
        bucketName: "publisher-logos",
        url: existingLogoUrl,
      });

      const { status: logoDeletedStatus } = await deleteFromBucket({
        bucketName: "publisher-logos",
        filePaths: filePath || "",
      });

      if (logoDeletedStatus === "error") {
        return {
          status: "error",
          message: "Gagal menghapus logo penerbit dari penyimpanan",
        };
      }
    }

    const newPublisher = await prisma.publisher.update({
      where: { id },
      data: {
        name,
        ...(logoUrl && { logoUrl }),
      },
    });

    return {
      status: "success",
      publisher: newPublisher,
      message: "Sukses memperbarui penerbit",
    };
  } catch {
    return {
      status: "error",
      message: "Gagal memperbarui penerbit",
    };
  }
}

export { updatePublisher };
