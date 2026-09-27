'use client'
import React, { useEffect, useState } from "react";
import { getDashboardData } from "@/server-actions/dashboard";
import { Users, ShoppingBag, XCircle, IndianRupee } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { formatCurrency } from "@/lib/utils"; // Assuming there might be a formatter, if not I'll just use a standard one.
import PageTitle from "@/components/ui/page-title";

interface DashboardData {
  totalCustomers: number;
  totalOrdersPlaced: number;
  totalOrdersCancelled: number;
  totalRevenue: number;
  lastSixOrders: {
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }[];
}

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        if (response.success && response.data) {
          setData(response.data as DashboardData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-6 text-red-500">Failed to load data.</div>;
  }

  const statCards = [
    {
      title: "Total Customers",
      value: data.totalCustomers.toString(),
      icon: <Users size={24} className="text-gray-600" />,
    },
    {
      title: "Orders Placed",
      value: data.totalOrdersPlaced.toString(),
      icon: <ShoppingBag size={24} className="text-gray-600" />,
    },
    {
      title: "Orders Cancelled",
      value: data.totalOrdersCancelled.toString(),
      icon: <XCircle size={24} className="text-gray-600" />,
    },
    {
      title: "Total Revenue",
      value: formatMoney(data.totalRevenue),
      icon: <IndianRupee size={24} className="text-gray-600" />,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageTitle title="Dashboard" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="flex items-center p-6 bg-white border border-primary rounded-lg shadow-sm gap-4"
          >
            <div className="p-3 bg-primary/25 rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Last 6 Orders Table */}
      <div className="bg-white border border-primary rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-primary">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
        </div>
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="border-primary">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.lastSixOrders.map((order) => (
              <TableRow key={order.id} className="border-none">
                <TableCell className="font-medium text-gray-600 text-xs">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{dayjs(order.date).format("MMM DD, YYYY hh:mm A")}</TableCell>
                <TableCell>
                  <span className="capitalize text-sm font-medium">
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatMoney(order.total)}
                </TableCell>
              </TableRow>
            ))}
            {data.lastSixOrders.length === 0 && (
              <TableRow className="border-none">
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No recent orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}