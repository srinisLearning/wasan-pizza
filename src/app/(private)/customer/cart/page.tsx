"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { getAddressByCustomerId } from "@/server-actions/addresses";
import { useUserStore } from "@/store/users-store";
import { IAddress } from "@/interfaces";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();
  const { user } = useUserStore();
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  useEffect(() => {
    if (user?.id) {
      getAddressByCustomerId(user.id).then((res) => {
        if (res.success && res.data) {
          setAddresses(res.data as IAddress[]);
          if (res.data.length > 0) {
            setSelectedAddress((res.data[0] as IAddress).id);
          }
        }
      });
    }
  }, [user]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any pizzas yet.</p>
        <Link href="/customer/pizzas">
          <Button>Browse Pizzas</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/50 [&_tr]:border-primary border-primary">
            <TableRow>
              <TableHead>Pizza</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={`${item.pizzaId}-${item.variantId}`}>
                <TableCell className="font-medium flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                  </div>
                  {item.name}
                </TableCell>
                <TableCell>{item.variantType}</TableCell>
                <TableCell className="text-right">${item.price}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${item.price * item.quantity}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeFromCart(item.variantId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-8 mt-8">
        <div className="w-full md:w-1/2">
           <div className="bg-white p-6 rounded-lg shadow-sm border mb-4">
              <h3 className="text-lg font-bold mb-4">Delivery Address</h3>
              {addresses.length > 0 ? (
                <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                  <SelectTrigger className="w-full border-primary">
                    <SelectValue placeholder="Select delivery address" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.name} - {address.address_line_1}, {address.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-gray-500">
                  <p className="mb-2">You don't have any saved addresses.</p>
                  <Link href="/customer/addresses">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                      Add Address
                    </Button>
                  </Link>
                </div>
              )}
           </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-end gap-4">
          <div className="text-xl font-semibold">
            Subtotal: <span className="text-primary">${subtotal}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
            <Link href="/customer/pizzas" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full border-primary text-primary hover:bg-primary/5">
                Continue Shopping
              </Button>
            </Link>
            <Button size="lg" className="w-full sm:w-auto" disabled={!selectedAddress}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
