"use server";
import supabaseConfig from "@/config/supabase-config";

export const getDashboardData = async () => {
  try {
    // Total Customers
    const { count: customersCount, error: customersError } = await supabaseConfig
      .from("pizza_users")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer");

    if (customersError) {
      throw customersError;
    }

    // Orders Data
    const { data: orders, error: ordersError } = await supabaseConfig
      .from("pizza_orders")
      .select("id, total, status, created_at, customer:pizza_users!customer_id(name)")
      .order("created_at", { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    const totalOrdersPlaced = orders.length;
    const totalOrdersCancelled = orders.filter(order => order.status === "cancelled").length;
    const totalRevenue = orders
      .filter(order => order.status !== "cancelled")
      .reduce((sum, order) => sum + (order.total || 0), 0);

    const lastSixOrders = orders.slice(0, 6).map(order => ({
      id: order.id,
      customerName: Array.isArray(order.customer) ? order.customer[0]?.name : (order.customer as any)?.name || 'Unknown',
      total: order.total,
      status: order.status,
      date: order.created_at,
    }));

    return {
      success: true,
      data: {
        totalCustomers: customersCount || 0,
        totalOrdersPlaced,
        totalOrdersCancelled,
        totalRevenue,
        lastSixOrders,
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch dashboard data",
    };
  }
};
