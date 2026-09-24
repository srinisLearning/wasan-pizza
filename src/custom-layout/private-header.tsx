"use client";
import { useUserStore } from "@/store/users-store";
import React from "react";
import SidebarMenuItems from "./sidebar-menu-items";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const PrivateHeader = () => {
  const { user } = useUserStore();
  const cartItems = useCartStore((state) => state.cartItems);
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="p-5 bg-primary text-white rounded-lg flex justify-between items-center">
      <Link href="/customer/pizzas">
        <h2 className="text-2xl font-bold text-black hover:opacity-80 transition-opacity">Wasan Pizza</h2>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/customer/cart" className="relative flex items-center">
          <ShoppingCart className="text-black h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
        <h1 className="text-black font-medium">{user?.name}</h1>
        <SidebarMenuItems />
      </div>
    </div>
  );
};

export default PrivateHeader;
