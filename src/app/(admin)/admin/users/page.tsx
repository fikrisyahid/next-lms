import { Skeleton, Title } from "@mantine/core";
import UserTable from "./components/table";
import { Suspense } from "react";
import AddUserModal from "./components/add-user-modal";

export default async function UsersPage() {
  return (
    <div className="flex flex-col gap-4 items-stretch">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Title>Users page</Title>
        <AddUserModal />
      </div>
      <Suspense fallback={<Skeleton height={80} radius="md" />}>
        <UserTable />
      </Suspense>
    </div>
  );
}
