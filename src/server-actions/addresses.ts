"use server";

import supabaseConfig from "@/config/supabase-config";

export const addAddress = async (addressData: any) => {
  try {
    const { data, error } = await supabaseConfig
      .from("pizza_addresses")
      .insert([addressData])
      .select();

    if (error) {
      console.error("Error adding address:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error("Error adding address:", error);
    return { success: false, message: error.message };
  }
};

export const getAddressByCustomerId = async (customerId: string) => {
  try {
    const { data: addresses, error } = await supabaseConfig
      .from("pizza_addresses")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user addresses:", error);
      return { success: false, data: [] };
    }

    return { success: true, data: addresses };
  } catch (error: any) {
    console.error("Error fetching user addresses:", error);
    return { success: false, data: [] };
  }
};

export const getAddressById = async (id: string) => {
  try {
    const { data:address, error } = await supabaseConfig
      .from("pizza_addresses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching address by id:", error);
      return { success: false, data: null, message: error.message };
    }

    return { success: true, address};
  } catch (error: any) {
    console.error("Error fetching address by id:", error);
    return { success: false, data: null, message: error.message };
  }
};

export const updateAddress = async (id: string, addressData: any) => {
  try {
    const { data, error } = await supabaseConfig
      .from("pizza_addresses")
      .update(addressData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating address:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error("Error updating address:", error);
    return { success: false, message: error.message };
  }
};

export const deleteAddress = async (id: string) => {
  try {
    const { error } = await supabaseConfig
      .from("pizza_addresses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting address:", error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return { success: false, message: error.message };
  }
};
