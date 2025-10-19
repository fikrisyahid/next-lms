/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/style/noNonNullAssertion: <> */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { supabase } from "../supabase";
import getCleanString from "../utils/clean-string";
import { uploadToBucket } from "./upload-to-bucket";

vi.mock("../supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn(),
    },
  },
}));

vi.mock("../utils/clean-string", () => ({
  default: vi.fn((str: string) => str.replace(/\s+/g, "_")),
}));

describe("uploadToBucket", () => {
  const mockUpload = vi.fn();
  const mockGetPublicUrl = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (supabase.storage.from as any).mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    });

    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "https://mock.public.url" },
    });
  });

  it("should return error if bucketName or files missing", async () => {
    const res1 = await uploadToBucket({ bucketName: "", files: new Blob() });
    expect(res1.status).toBe("error");

    const res2 = await uploadToBucket({
      bucketName: "test",
      files: undefined as any,
    });
    expect(res2.status).toBe("error");
  });

  it("should upload a single file successfully", async () => {
    mockUpload.mockResolvedValueOnce({ error: null });

    const file = new File(["data"], "test.txt");
    const result = await uploadToBucket({
      bucketName: "my-bucket",
      files: file,
      customPathFolder: "2025/october",
    });

    expect(result.status).toBe("success");
    expect(result.message).toBe("Files uploaded successfully");
    expect(result.results).toHaveLength(1);

    const uploaded = result.results![0];
    expect(uploaded.fileName).toMatch(/test.txt$/);
    expect(uploaded.publicUrl).toBe("https://mock.public.url");
    expect(uploaded.path).toContain("2025/october");
  });

  it("should upload multiple files successfully", async () => {
    mockUpload.mockResolvedValue({ error: null });

    const files = [new File(["a"], "a.txt"), new File(["b"], "b.txt")];

    const result = await uploadToBucket({
      bucketName: "multi",
      files,
    });

    expect(result.status).toBe("success");
    expect(result.results).toHaveLength(2);
    expect(mockUpload).toHaveBeenCalledTimes(2);
  });

  it("should throw if upload fails", async () => {
    mockUpload.mockResolvedValueOnce({ error: new Error("upload failed") });

    const file = new File(["data"], "fail.txt");
    const result = await uploadToBucket({
      bucketName: "bad-bucket",
      files: file,
    });

    expect(result.status).toBe("error");
    expect(result.message).toBe("upload failed");
  });

  it("should handle unknown error gracefully", async () => {
    // Mock supaya Promise.all lempar non-Error
    mockUpload.mockImplementationOnce(() => {
      throw "weird error"; // bukan instance of Error
    });

    const file = new File(["data"], "weird.txt");
    const result = await uploadToBucket({
      bucketName: "test",
      files: file,
    });

    expect(result.status).toBe("error");
    expect(result.message).toBe("An unknown error occurred during upload");
  });

  it("should clean path using getCleanString", async () => {
    mockUpload.mockResolvedValue({ error: null });
    const file = new File(["data"], "dirty name.txt");

    await uploadToBucket({
      bucketName: "test-bucket",
      files: file,
      customPathFolder: "folder test",
    });

    expect(getCleanString).toHaveBeenCalled();
  });
});
