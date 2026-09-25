"use client";

import React, { useState } from "react";
import { IPizza, IVariant } from "@/interfaces";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/cart-store";
import toast from "react-hot-toast";

interface PizzaWithVariants extends IPizza {
  pizza_variants: IVariant[];
}

export const PizzasGrid = ({ pizzas }: { pizzas: PizzaWithVariants[] }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedPizza, setSelectedPizza] = useState<PizzaWithVariants | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const handlePizzaClick = (pizza: PizzaWithVariants) => {
    setSelectedPizza(pizza);
    if (pizza.pizza_variants && pizza.pizza_variants.length > 0) {
      setSelectedVariantId(pizza.pizza_variants[0].id);
    }
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedPizza || !selectedVariantId) return;
    
    const variant = selectedPizza.pizza_variants.find((v) => v.id === selectedVariantId);
    if (!variant) return;

    addToCart({
      pizzaId: selectedPizza.id,
      name: selectedPizza.name,
      image: selectedPizza.image,
      variantId: variant.id,
      variantType: variant.type,
      price: variant.price,
      quantity: quantity,
    });

    toast.success(`${quantity}x ${selectedPizza.name} (${variant.type}) added to cart!`);
    setSelectedPizza(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6 mt-6">
        {pizzas.map((pizza) => (
          <div
            key={pizza.id}
            className="border rounded-lg shadow-sm hover:shadow-md cursor-pointer overflow-hidden bg-white transition-all duration-200 flex flex-col"
            onClick={() => handlePizzaClick(pizza)}
          >
            <div className="h-66 w-full bg-gray-100 overflow-hidden">
              {pizza.image ? (
                <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            <div className="p-4 flex-grow flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-lg leading-tight">{pizza.name}</h3>
                <div className="flex gap-2">
                  {pizza.category && (
                    <span className={`text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap ${pizza.category === 'Vegetarian' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {pizza.category}
                    </span>
                  )}
                  {pizza["sub-category"] && (
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                      {pizza["sub-category"]}
                    </span>
                  )}
                </div>
              </div>
             {/*  <p className="text-gray-600 text-sm line-clamp-2 mb-2 flex-grow">{pizza.description}</p> */}
              <div className="mt-auto flex items-center justify-between">
                {pizza.pizza_variants && pizza.pizza_variants.length > 0 ? (
                  <p className="font-medium text-primary">
                    Starts at ₹{Math.min(...pizza.pizza_variants.map((v) => v.price))}
                  </p>
                ) : <div />}
                <Button size="sm" variant="outline" className="text-primary border-primary" onClick={(e) => { e.stopPropagation(); handlePizzaClick(pizza); }}>
                  ORDER
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPizza} onOpenChange={(open) => !open && setSelectedPizza(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedPizza && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPizza.name}</DialogTitle>
                <DialogDescription>{selectedPizza.description}</DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col gap-4 py-4">
                <div className="h-48 w-full bg-gray-100 rounded-md overflow-hidden">
                   {selectedPizza.image && (
                     <img src={selectedPizza.image} alt={selectedPizza.name} className="w-full h-full object-cover" />
                   )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Label>Select Variant</Label>
                  <Select
                    value={selectedVariantId}
                    onValueChange={setSelectedVariantId}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedPizza.pizza_variants?.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.type} - ₹{variant.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </Button>
                    <span className="font-medium w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                {selectedVariantId && (
                  <div className="flex justify-between items-center font-semibold mt-2">
                    <span>Total:</span>
                    <span>
                      ₹{(selectedPizza.pizza_variants.find((v) => v.id === selectedVariantId)?.price || 0) * quantity}
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={handleAddToCart} className="w-full">
                  Add to Cart
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
