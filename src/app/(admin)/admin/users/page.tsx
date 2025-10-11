import { Title } from "@mantine/core";
import AddUserForm from "./components/add-user-form";
import UserTable from "./components/table";

export default async function UsersPage() {
  return (
    <div className="flex flex-col gap-4 items-stretch">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Title>Users page</Title>
        <AddUserForm />
      </div>
      <UserTable />
    </div>
  );
}
