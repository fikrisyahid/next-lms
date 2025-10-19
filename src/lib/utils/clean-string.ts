export default function getCleanString(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-zA-Z0-9.\-_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
