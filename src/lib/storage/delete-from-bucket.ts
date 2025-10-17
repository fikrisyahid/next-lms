"use server";

import { supabase } from "../supabase";

/**
 * Delete file(s) from Supabase Storage dynamically
 * @param bucketName - Bucket name (example: "publisher-logos")
 * @param filePaths - File path (example: "images/logo.png" or array of path)
 */
export async function deleteFromBucket({
  bucketName,
  filePaths,
}: {
  bucketName: string;
  filePaths: string | string[];
}) {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];

  if (!bucketName || paths.length === 0) {
    return {
      status: "error",
      message: "Bucket name and file path are required",
    };
  }

  const { error } = await supabase.storage.from(bucketName).remove(paths);

  if (error) {
    console.error(
      `❌ Failed to delete from bucket '${bucketName}':`,
      error.message
    );
    return { status: "error", message: error.message };
  }

  console.log(`✅ Deleted ${paths.length} file(s) from '${bucketName}'`);
  return { status: "success", message: "File(s) deleted successfully" };
}
