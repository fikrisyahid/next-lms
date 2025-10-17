/**
 * Extracts the file path inside a Supabase bucket from a public URL.
 *
 * Example:
 *   Input:  https://xyz.supabase.co/storage/v1/object/public/publisher-logos/folder/abc.jpg
 *   Output: folder/abc.jpg
 */
export function extractFilePathFromUrl(
  { url, bucketName }: { url: string; bucketName: string }
) {
  if (!url || !bucketName) return null;

  try {
    const regex = new RegExp(`/storage/v1/object/public/${bucketName}/(.+)$`);
    const match = url.match(regex);

    return match ? match[1] : null;
  } catch (err) {
    console.error("❌ Failed to extract file path:", err);
    return null;
  }
}
