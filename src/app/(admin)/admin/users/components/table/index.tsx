import { getAllUsers } from "@/app/api/users";
import { UserTableClient } from "./client";

export default async function UserTable() {
  const usersAPIResponse = await getAllUsers();

  const users =
    usersAPIResponse.status === "success" ? usersAPIResponse.users || [] : [];

  return (
    <div className="flex flex-col gap-4 items-center">
      <UserTableClient users={users} />
    </div>
  );
}
