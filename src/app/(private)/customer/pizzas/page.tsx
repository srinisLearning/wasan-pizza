import React from "react";
import { getAllPizzas } from "@/server-actions/pizzas";
import { PizzasGrid } from "./PizzasGrid";
import PizzaFilters from "./pizza-filters";

const PizzasPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sub_category?: string; sortBy?: string }>;
}) => {
  const resolvedParams = await searchParams;
  const { success, pizzas } = await getAllPizzas(resolvedParams);

  return (
    <div className="p-6">
      <h4 className="text-3xl font-bold text-primary/40 mb-6">
        Order Your Favorite Pizza from our delicious Menu
      </h4>
      <PizzaFilters />
      {success && pizzas && pizzas.length > 0 ? (
        <PizzasGrid pizzas={pizzas} />
      ) : success ? (
        <p className="text-gray-500">No pizzas found matching your filters.</p>
      ) : (
        <p className="text-red-500">
          Failed to load pizzas. Please try again later.
        </p>
      )}
    </div>
  );
};

export default PizzasPage;
