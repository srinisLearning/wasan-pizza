"use client";
import { useUserStore } from "@/store/users-store";
import React from "react";
import SidebarMenuItems from "./sidebar-menu-items";

const PrivateHeader = () => {
  const { user } = useUserStore();
  
  return (
    <div className="p-5 bg-primary text-white rounded-lg flex justify-between">
      <h2 className="text-2xl font-bold text-black">Wasan Pizza</h2>
      <div className="flex items-center gap-2 justify-around">
        <h1 className="text-black">{user?.name}</h1>
        <SidebarMenuItems />
      </div>
    </div>
  );
};

export default PrivateHeader;
