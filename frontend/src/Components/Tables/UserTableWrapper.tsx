"use client";
import { User } from "@/interfaces/User";
import { useState } from "react";
import { UsersTable01 } from "./UsersTable01";

const UserTableWithSearch = ({ users }: { users: User[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterField, setFilterField] = useState("firstName");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (field: string) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterField(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    return user[filterField as keyof User]
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const sortedUsers = filteredUsers.sort((a, b) => {
    const aField = a[sortField as keyof User]?.toString() || "";
    const bField = b[sortField as keyof User]?.toString() || "";
    return sortOrder === "asc"
      ? aField.localeCompare(bField)
      : bField.localeCompare(aField);
  });

  return (
    <div className="w-full  bg-slate-900 rounded-lg p-4 border border-slate-600">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={`Search by ${filterField}`}
          className="p-2 border rounded bg-slate-800 text-white w-1/3
          border-gray-600 "
        />
        <select
          value={filterField}
          onChange={handleFieldChange}
          className="p-2 border border-gray-600 cursor-pointer rounded-lg bg-slate-800 text-white"
        >
          <option value="firstName">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
          <option value="status">Status</option>
        </select>
      </div>

      <UsersTable01 usersList={sortedUsers} onSort={handleSort} />
    </div>
  );
};

export default UserTableWithSearch;
