"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IVariant } from "@/interfaces";
import { addVariant, updateVariant } from "@/server-actions/variants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

const variantSchema = z.object({
  type: z.string().min(1, "Type is required"),
  price: z.any(),
});

type VariantFormValues = z.infer<typeof variantSchema>;

interface VariantFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  pizzaId: string;
  initialData?: IVariant | null;
  onSuccess?: () => void;
}

const VariantForm: React.FC<VariantFormProps> = ({
  open,
  setOpen,
  pizzaId,
  initialData,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VariantFormValues>({
    // @ts-ignore
    resolver: zodResolver(variantSchema),
    defaultValues: {
      type: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        type: initialData.type,
        price: initialData.price,
      });
    } else {
      form.reset({
        type: "",
        price: 0,
      });
    }
  }, [initialData, form, open]);

  const onSubmit = async (values: VariantFormValues) => {
    setIsLoading(true);
    try {
      if (initialData) {
        const response = await updateVariant(initialData.id, values);
        if (response.success) {
          toast.success("Variant updated successfully");
          setOpen(false);
          if (onSuccess) onSuccess();
        } else {
          toast.error(response.message || "Failed to update variant");
        }
      } else {
        const payload = {
          ...values,
          pizza_id: pizzaId,
        };
        const response = await addVariant(payload);
        if (response.success) {
          toast.success("Variant added successfully");
          setOpen(false);
          if (onSuccess) onSuccess();
        } else {
          toast.error(response.message || "Failed to add variant");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Variant" : "Add Variant"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type (e.g. Small, Medium, Large)</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Small" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="number"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : initialData
                  ? "Update Variant"
                  : "Add Variant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VariantForm;
