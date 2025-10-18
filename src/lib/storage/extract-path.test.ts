import { describe, it, expect } from "vitest";
import { extractFilePathFromUrl } from "./extract-path";

describe("extractFilePathFromUrl", () => {
  it("should extract the full path after the bucket name", () => {
    const url =
      "https://abc.supabase.co/storage/v1/object/public/publisher-logos/folder/abc.jpg";

    const result = extractFilePathFromUrl({
      url,
      bucketName: "publisher-logos",
    });

    expect(result).toBe("folder/abc.jpg");
  });

  it("should return null if url or bucketName is empty", () => {
    expect(extractFilePathFromUrl({ url: "", bucketName: "x" })).toBeNull();
    expect(extractFilePathFromUrl({ url: "a", bucketName: "" })).toBeNull();
  });

  it("should return null if the url does not match the expected pattern", () => {
    const result = extractFilePathFromUrl({
      url: "https://random-site.com/image.jpg",
      bucketName: "publisher-logos",
    });

    expect(result).toBeNull();
  });
});
