import { Title } from "@mantine/core";
import AddPublisherModal from "./components/add-publisher-modal";

export default function PublishersPage() {
  return (
    <div className="flex flex-col gap-4 items-stretch">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Title>Publishers page</Title>
        <AddPublisherModal />
      </div>
      <p>Publishers table</p>
    </div>
  );
}
