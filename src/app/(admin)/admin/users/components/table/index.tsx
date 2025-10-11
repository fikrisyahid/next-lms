import { getAllUsers } from "@/app/api/users";
import { UserTableClient } from "./client";
import { TextInput } from "@mantine/core";

export default async function UserTable() {
  const usersAPIResponse = await getAllUsers();

  const users =
    usersAPIResponse.status === "success" ? usersAPIResponse.users || [] : [];

  return (
    <div className="flex flex-col gap-4 items-center">
      <TextInput className="w-full" placeholder="Search user data" />
      <UserTableClient users={users} />
    </div>
  );
}
