"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/users-store";
import { Menu, LayoutDashboard, Pizza, ListOrdered, Users, UserCircle, User, MapPin, HelpCircle, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { logoutUser } from "@/server-actions/users";

const SidebarMenuItems = () => {
  const { user } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const adminMenus = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Pizza', path: '/admin/pizzas', icon: Pizza },
    { name: 'Order', path: '/admin/order', icon: ListOrdered },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Customers', path: '/admin/customers', icon: UserCircle },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  const customerMenus = [
    { name: 'Pizza', path: '/customer/pizzas', icon: Pizza },
    { name: 'Orders', path: '/customer/orders', icon: ListOrdered },
    { name: 'Addresses', path: '/customer/addresses', icon: MapPin },
    { name: 'Profile', path: '/customer/profile', icon: User },
    { name: 'Help', path: '/customer/help', icon: HelpCircle },
  ];

  const menus = user?.role === "admin" ? adminMenus : customerMenus;

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Menu className="text-black cursor-pointer" size={24} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
          <SheetDescription className="sr-only">Navigation Menu</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8 h-[calc(100vh-120px)] overflow-y-auto">
          {menus.map((menu, index) => {
            const isActive = pathname.includes(menu.path);
            const Icon = menu.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100 text-black"
                }`}
                onClick={() => {
                  router.push(menu.path);
                  setOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{menu.name}</span>
              </div>
            );
          })}
          
          <hr className="my-2 border-gray-200" />
          
          <div
            className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-red-100 text-red-500 transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarMenuItems;
