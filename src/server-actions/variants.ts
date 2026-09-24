"use server";

import supabaseConfig from "@/config/supabase-config";

export const addVariant = async (variantData: any) => {
  try {
    const { data, error } = await supabaseConfig
      .from("pizza_variants")
      .insert([variantData])
      .select();

    if (error) {
      console.error("Error adding variant:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error("Error adding variant:", error);
    return { success: false, message: error.message };
  }
};

export const getVariantsByPizzaId = async (pizzaId: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("pizza_variants")
      .select("*")
      .eq("pizza_id", pizzaId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching variants:", error);
      return { success: false, data: [] };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching variants:", error);
    return { success: false, data: [] };
  }
};

export const updateVariant = async (id: string, variantData: any) => {
  try {
    const { data, error } = await supabaseConfig
      .from("pizza_variants")
      .update(variantData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating variant:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error("Error updating variant:", error);
    return { success: false, message: error.message };
  }
};

export const deleteVariant = async (id: string) => {
  try {
    const { error } = await supabaseConfig
      .from("pizza_variants")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting variant:", error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting variant:", error);
    return { success: false, message: error.message };
  }
};
