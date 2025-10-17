"use server";

import { supabase } from "../supabase";

/**
 * Upload single or multiple files to Supabase Storage
 * @param bucketName - Bucket name (e.g. "publisher-logos")
 * @param files - File or array of Files/Blobs
 * @param customPathFolder - Optional subfolder path inside the bucket (e.g. "2025/october")
 */
export async function uploadToBucket({
  bucketName,
  files,
  customPathFolder,
}: {
  bucketName: string;
  files: File | Blob | (File | Blob)[];
  customPathFolder?: string;
}) {
  if (!bucketName || !files) {
    return { status: "error", message: "Bucket name and files are required" };
  }

  try {
    const fileArray = Array.isArray(files) ? files : [files];

    const folderPath = customPathFolder
      ? customPathFolder.replace(/^\/+|\/+$/g, "")
      : "";

    const uploadResults = await Promise.all(
      fileArray.map(async (file) => {
        const fileName = `${Date.now()}-${
          file instanceof File ? file.name : "upload"
        }`;
        const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fullPath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fullPath);

        return {
          fileName,
          publicUrl: publicUrlData.publicUrl,
          path: fullPath,
        };
      })
    );

    return {
      status: "success",
      message: "Files uploaded successfully",
      results: uploadResults,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ Failed to upload to '${bucketName}':`, err.message);
      return {
        status: "error",
        message: err.message || "Upload failed",
      };
    }
    return {
      status: "error",
      message: "An unknown error occurred during upload",
    };
  }
}
