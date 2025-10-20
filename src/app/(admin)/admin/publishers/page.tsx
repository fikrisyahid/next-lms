import { Skeleton, Title } from "@mantine/core";
import AddPublisherModal from "./components/add-publisher-modal";
import PublisherTable from "./components/table";
import { Suspense } from "react";

export default async function PublishersPage() {
  return (
    <div className="flex flex-col gap-4 items-stretch">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Title>Daftar Penerbit</Title>
        <AddPublisherModal />
      </div>
      <Suspense fallback={<Skeleton height={80} radius="md" />}>
        <PublisherTable />
      </Suspense>
    </div>
  );
}
