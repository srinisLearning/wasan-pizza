"use server";

import supabaseConfig from "@/config/supabase-config";
import { deleteImageByUrl } from "./uploads";

export const addPizza = async (pizzaData: any) => {
  try {
    const { data, error } = await supabaseConfig
      .from("pizza_pizzas")
      .insert([pizzaData])
      .select();

    if (error) {
      console.error("Error adding pizza:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error("Error adding pizza:", error);
    return { success: false, message: error.message };
  }
};

export const getAllPizzas = async (searchParams?: { category?: string; sub_category?: string; sortBy?: string; isAdmin?: boolean }) => {
  try {
    let query = supabaseConfig
      .from("pizza_pizzas")
      .select("*,pizza_variants(*)");

    if (!searchParams?.isAdmin) {
      query = query.eq("status", "available");
    }

    if (searchParams?.category && searchParams.category !== "all") {
      query = query.ilike("category", searchParams.category);
    }

    if (searchParams?.sub_category && searchParams.sub_category !== "all") {
      query = query.ilike("sub-category", searchParams.sub_category);
    }

    if (!searchParams?.sortBy || searchParams.sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    }

    const { data: pizzas, error } = await query;

    if (error) {
      console.error("Error fetching pizzas:", error);
      return { success: false, data: [] };
    }

    if (pizzas && (searchParams?.sortBy === "price_asc" || searchParams?.sortBy === "price_desc")) {
      pizzas.sort((a, b) => {
        const minPriceA = a.pizza_variants?.length > 0 ? Math.min(...a.pizza_variants.map((v: any) => v.price)) : 0;
        const minPriceB = b.pizza_variants?.length > 0 ? Math.min(...b.pizza_variants.map((v: any) => v.price)) : 0;
        
        if (searchParams.sortBy === "price_asc") {
          return minPriceA - minPriceB;
        } else {
          return minPriceB - minPriceA;
        }
      });
    }

    return { success: true, pizzas };
  } catch (error: any) {
    console.error("Error fetching pizzas:", error);
    return { success: false, data: [] };
  }
};

export const getPizzaById = async (id: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("pizza_pizzas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching pizza by id:", error);
      return { success: false, data: null, message: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching pizza by id:", error);
    return { success: false, data: null, message: error.message };
  }
};

const getPizzaImage = async (id: string) => {
  const { data } = await supabaseConfig
    .from("pizza_pizzas")
    .select("image")
    .eq("id", id)
    .single();
  return (data?.image as string) || "";
};

export const updatePizza = async (id: string, pizzaData: any) => {
  try {
    const oldImage = await getPizzaImage(id);

    const { data, error } = await supabaseConfig
      .from("pizza_pizzas")
      .update(pizzaData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating pizza:", error);
      return { success: false, message: error.message };
    }

    // Remove the previous image from storage if it was replaced
    if (oldImage && oldImage !== pizzaData.image) {
      await deleteImageByUrl(oldImage);
    }

    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error("Error updating pizza:", error);
    return { success: false, message: error.message };
  }
};

export const deletePizza = async (id: string) => {
  try {
    const image = await getPizzaImage(id);

    const { error } = await supabaseConfig
      .from("pizza_pizzas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting pizza:", error);
      return { success: false, message: error.message };
    }

    if (image) {
      await deleteImageByUrl(image);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting pizza:", error);
    return { success: false, message: error.message };
  }
};
