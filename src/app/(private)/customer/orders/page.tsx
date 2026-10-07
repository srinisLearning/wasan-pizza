"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "@/components/ui/page-title";
import { getOrdersByCustomerId } from "@/server-actions/orders";
import { useUserStore } from "@/store/users-store";
import { IOrder, IOrderItem } from "@/interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface OrderWithItems extends IOrder {
  pizza_order_items: IOrderItem[];
}

const CustomerOrdersPage = () => {
  const { user } = useUserStore();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrdersByCustomerId(user!.id.toString());
      if (res.success && res.data) {
        setOrders(res.data as OrderWithItems[]);
      } else {
        toast.error(res.message || "Failed to fetch orders");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full mt-5">
      <PageTitle title="My Orders" />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 animate-pulse">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border mt-6">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-primary mt-6 overflow-hidden">
          <Table>
            <TableHeader className="bg-primary/5 [&_tr]:border-primary">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr]:border-primary/20">
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}{" "}
                    <span className="text-gray-400 text-sm ml-1">
                      {new Date(order.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    {order.pizza_order_items &&
                    order.pizza_order_items.length > 0 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            View {order.pizza_order_items.length} item
                            {order.pizza_order_items.length !== 1 ? "s" : ""}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-[400px] p-3"
                        >
                          <table className="w-full text-sm">
                            <thead className="bg-primary/5">
                              <tr className="border-b text-left text-muted-foreground">
                                <th className="pb-2 font-medium">Item</th>
                                <th className="pb-2 font-medium text-center">
                                  Qty
                                </th>
                                <th className="pb-2 font-medium text-right">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.pizza_order_items.map((item, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b last:border-0 pointer-events-none"
                                >
                                  <td className="py-2 font-medium">
                                    {item.name}
                                  </td>
                                  <td className="py-2 text-center text-muted-foreground">
                                    {item.quantity}
                                  </td>
                                  <td className="py-2 text-center text-muted-foreground">
                                    ₹{item.total_price}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-gray-400">No items</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    ₹{order.total}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 max-w-[150px] truncate">
                    {order.payment_id || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status || "Unknown"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersPage;
