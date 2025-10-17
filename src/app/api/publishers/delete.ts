"use server";

import prisma from "@/lib/db";
import { deleteFromBucket } from "@/lib/storage/delete-from-bucket";
import { extractFilePathFromUrl } from "@/lib/storage/extract-path";

async function deletePublisher(id: string) {
  if (!id) {
    return {
      status: "error",
      message: "Publisher ID is required",
    };
  }

  try {
    const goingToBeDeletedPublisher = await prisma.publisher.findUnique({
      where: { id },
    });

    const logoUrl = goingToBeDeletedPublisher?.logoUrl;
    if (logoUrl) {
      const filePath = extractFilePathFromUrl({
        bucketName: "publisher-logos",
        url: logoUrl,
      });

      const { status: logoDeletedStatus } = await deleteFromBucket({
        bucketName: "publisher-logos",
        filePaths: filePath || "",
      });

      if (logoDeletedStatus === "error") {
        return {
          status: "error",
          message: "Failed to delete publisher logo from storage",
        };
      }
    }

    await prisma.publisher.delete({
      where: { id },
    });

    return {
      status: "success",
      message: "Publisher has been deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete publisher",
    };
  }
}

export { deletePublisher };
