import { IUser } from "@/interfaces";
import React from "react";

function ProfileCard({ user }: { user: IUser }) {
  if (!user) return null;
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            user.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 font-medium">User Id</span>
          <span className="text-gray-700 capitalize">{user.id}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 font-medium">Email</span>
          <span className="text-gray-700">{user.email}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 font-medium">Phone</span>
          <span className="text-gray-700">{user.phone || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 font-medium">Role</span>
          <span className="text-gray-700 capitalize">{user.role}</span>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;