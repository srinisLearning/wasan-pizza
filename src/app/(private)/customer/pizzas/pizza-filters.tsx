"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { pizzaCategories, sortByOptions } from "@/constants/categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PizzaFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentSortBy = searchParams.get("sortBy") || "newest";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" && key === "category") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasFilters = currentCategory !== "all" || currentSortBy !== "newest";

  return (
    <div className="flex flex-col sm:flex-row justify-start items-center gap-4 mb-8">
      <div className="w-full sm:w-[200px]">
        <Select value={currentCategory} onValueChange={(val) => updateFilters("category", val)}>
          <SelectTrigger className="border-primary">
            <SelectValue placeholder="Category" />
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
      
      <div className="w-full sm:w-[200px]">
        <Select value={currentSortBy} onValueChange={(val) => updateFilters("sortBy", val)}>
          <SelectTrigger className="border-primary">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sortByOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="text-gray-500 hover:text-red-500 border-primary">
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default PizzaFilters;
