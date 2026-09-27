"use server";
import supabaseConfig from "@/config/supabase-config";

export const saveOrder = async (payload: {
  customer_id: string;
  subtotal: number;
  tax?: number;
  total: number;
  address_id: string;
  payment_id: string;
  items: {
    name: string;
    image: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}) => {
  try {
    // 1. Insert the main order
    const orderToInsert = {
      customer_id: payload.customer_id,
      subtotal: payload.subtotal,
      tax: payload.tax || 0,
      total: payload.total,
      address_id: payload.address_id,
      payment_id: payload.payment_id,
      status: "pending",
    };

    const { data: orderData, error: orderError } = await supabaseConfig
      .from("pizza_orders")
      .insert([orderToInsert])
      .select()
      .single();

    if (orderError) {
      console.error("Error saving order:", orderError);
      return { success: false, message: orderError.message };
    }

    // 2. Assign the created order's ID to each item
    const formattedItems = payload.items.map((item) => ({
      ...item,
      order_id: orderData.id,
    }));

    // 3. Save the order items
    const { error: itemsError } = await supabaseConfig
      .from("pizza_order_items")
      .insert(formattedItems);

    if (itemsError) {
      console.error("Error saving order items:", itemsError);
      return { success: false, message: itemsError.message };
    }

    return { 
      success: true, 
      message: "Order saved successfully", 
      orderId: orderData.id 
    };
  } catch (error: any) {
    console.error("Unexpected error saving order:", error);
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred" 
    };
  }
};

export const getOrdersByCustomerId = async (customerId: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("pizza_orders")
      .select("*, pizza_order_items(*)")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected error fetching orders:", error);
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred" 
    };
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("pizza_orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Error updating order status:", error);
      return { success: false, message: error.message };
    }

    return { 
      success: true, 
      message: "Order status updated successfully", 
      data 
    };
  } catch (error: any) {
    console.error("Unexpected error updating order status:", error);
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred" 
    };
  }
};

export const getAllOrders = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("pizza_orders")
      .select("*, pizza_order_items(*), customer:pizza_users!customer_id(*)")
      .order("created_at", { ascending: false });

    if (error) {
      // If the foreign key mapping 'customer:pizza_users!customer_id' fails, 
      // fallback to just fetching orders and items, though typically supabase handles it if there's a FK.
      console.error("Error fetching all orders (with customer):", error);
      
      const fallback = await supabaseConfig
        .from("pizza_orders")
        .select("*, pizza_order_items(*)")
        .order("created_at", { ascending: false });
        
      if (fallback.error) {
        return { success: false, message: fallback.error.message };
      }
      
      // Manually fetch users if needed, but let's try just returning fallback data
      return { success: true, data: fallback.data };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected error fetching all orders:", error);
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred" 
    };
  }
};
