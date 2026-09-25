"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { pizzaCategories } from "@/constants/categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const AddPizzaFilterComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentSubCategory = searchParams.get("sub_category") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasFilters = currentCategory !== "all" || currentSubCategory !== "all";

  return (
    <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
      <div className="w-full sm:w-[200px]">
        <Select value={currentCategory} onValueChange={(val) => updateFilters("category", val)}>
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
            <SelectItem value="Non Vegetarian">Non Vegetarian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-[200px]">
        <Select value={currentSubCategory} onValueChange={(val) => updateFilters("sub_category", val)}>
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder="Sub-category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {pizzaCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="text-gray-500 hover:text-red-500">
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default AddPizzaFilterComponent;
