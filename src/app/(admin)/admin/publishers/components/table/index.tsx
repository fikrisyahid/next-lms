import { getAllPublishers } from "@/app/api/publishers";
import { PublisherTableClient } from "./client";

export default async function PublisherTable() {
  const publishersAPIResponse = await getAllPublishers({ ebooks_count: true });

  const publishers =
    publishersAPIResponse.status === "success"
      ? publishersAPIResponse.data || []
      : [];

  return (
    <div className="flex flex-col gap-4 items-center">
      <PublisherTableClient publishers={publishers} />
    </div>
  );
}
