import { Title } from "@mantine/core";
import AddPublisherModal from "./components/add-publisher-modal";
import PublisherList from "./components/publishers-list";
import { getAllPublishers } from "@/app/api/publishers";

export default async function PublishersPage() {
  const publishers = await getAllPublishers();

  if (publishers.status === "error") {
    return <div>Error: {publishers.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4 items-stretch">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Title>Publishers page</Title>
        <AddPublisherModal />
      </div>
      <PublisherList publishers={publishers.data || []} />
    </div>
  );
}
