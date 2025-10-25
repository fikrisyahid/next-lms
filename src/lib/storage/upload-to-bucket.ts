import { supabase } from "../supabase";
import getCleanString from "../utils/clean-string";

type UploadResult = {
  fileName: string;
  publicUrl: string;
  path: string;
};

type UploadEachFileParams = {
  file: File | Blob;
  bucketName: string;
  folderPath: string;
};

async function uploadWithRetry(
  bucketName: string,
  path: string,
  file: File | Blob,
  retries = 3,
  delay = 1000
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(path, file);
    if (error) throw error;
  } catch (err: unknown) {
    const message = (err as Error)?.message?.toLowerCase?.() || "";

    if (
      retries > 0 &&
      (message.includes("fetch") || message.includes("network"))
    ) {
      console.warn(
        `⚠️ Upload failed ("${message}"), retrying... (${3 - retries + 1}/3)`
      );
      await new Promise((res) => setTimeout(res, delay));
      return uploadWithRetry(bucketName, path, file, retries - 1, delay * 2);
    }

    throw err;
  }
}

async function uploadEachFile({
  file,
  bucketName,
  folderPath,
}: UploadEachFileParams) {
  const fileName = `${Date.now()}-${
    file instanceof File ? file.name : "upload"
  }`;
  const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;
  const cleanFullPath = getCleanString(fullPath);

  await uploadWithRetry(bucketName, cleanFullPath, file);

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(cleanFullPath);

  return {
    fileName,
    publicUrl: publicUrlData.publicUrl,
    path: cleanFullPath,
  };
}

type UploadToBucketParams = {
  bucketName: string;
  files: File | Blob | (File | Blob)[];
  customPathFolder?: string;
};

type UploadToBucketResponse = Promise<{
  status: "success" | "error";
  message: string;
  results?: UploadResult[];
}>;

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
}: UploadToBucketParams): UploadToBucketResponse {
  if (!bucketName || !files) {
    return { status: "error", message: "Bucket name and files are required" };
  }

  try {
    const fileArray = Array.isArray(files) ? files : [files];

    const folderPath = customPathFolder
      ? customPathFolder.replace(/^\/+|\/+$/g, "")
      : "";

    const uploadResults = await Promise.all(
      fileArray.map((file) => uploadEachFile({ file, bucketName, folderPath }))
    );

    return {
      status: "success",
      message: "Files uploaded successfully",
      results: uploadResults,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
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
