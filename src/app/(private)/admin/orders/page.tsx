"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "@/components/ui/page-title";
import { getAllOrders, updateOrderStatus } from "@/server-actions/orders";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminOrdersFilter, { OrderFilters } from "./admin-orders-filter";

interface OrderWithDetails extends IOrder {
  pizza_order_items: IOrderItem[];
  customer?: {
    name: string;
    email: string;
  };
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilters>({
    status: "all",
    email: "",
    date: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      if (res.success && res.data) {
        setOrders(res.data as OrderWithDetails[]);
      } else {
        toast.error(res.message || "Failed to fetch orders");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(res.message);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(res.message || "Failed to update order status");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filters.status !== "all" && order.status !== filters.status) return false;
    if (filters.email && !order.customer?.email?.toLowerCase().includes(filters.email.toLowerCase())) return false;
    if (filters.date) {
      // Get local date string 'YYYY-MM-DD' from UTC timestamp or whatever the DB returns
      const orderDate = new Date(order.created_at);
      // Offset timezone to avoid date shifting issues (very simple approach)
      const localDate = new Date(orderDate.getTime() - (orderDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      if (localDate !== filters.date) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto w-full mt-5">
      <PageTitle title="All Orders" />

      <AdminOrdersFilter filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 animate-pulse">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border mt-6">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border mt-6 overflow-hidden">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-xs max-w-[100px] truncate" title={order.id}>{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customer?.name || "Unknown"}</span>
                      <span className="text-xs text-gray-500">{order.customer?.email}</span>
                      <span className="text-[10px] text-gray-400 mt-1 truncate max-w-[120px]" title={order.payment_id || "N/A"}>
                        PID: {order.payment_id || "N/A"}
                      </span>
                    </div>
                  </TableCell>
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
                    {order.pizza_order_items && order.pizza_order_items.length > 0 ? (
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
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(val) => handleStatusChange(order.id, val)}
                    >
                      <SelectTrigger className={`w-[130px] h-8 capitalize ${getStatusColor(order.status)}`}>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
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

export default AdminOrdersPage;
