"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { addAddress, updateAddress } from "@/server-actions/addresses";
import { useUserStore } from "@/store/users-store";
import { IAddress } from "@/interfaces";

const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address_line_1: z.string().min(5, "Address Line 1 is required"),
  address_line_2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  pincode: z.string().min(4, "Pincode is required"),
  landmark: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: IAddress | null;
  onSuccess: () => void;
}

const AddressForm = ({ open, setOpen, initialData, onSuccess }: AddressFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      pincode: "",
      landmark: "",
    },
  });

  useEffect(() => {
    if (initialData && open) {
      form.reset({
        name: initialData.name || "",
        address_line_1: initialData.address_line_1 || "",
        address_line_2: initialData.address_line_2 || "",
        city: initialData.city || "",
        pincode: initialData.pincode || "",
        landmark: initialData.landmark || "",
      });
    } else if (!initialData && open) {
      form.reset({
        name: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        pincode: "",
        landmark: "",
      });
    }
  }, [initialData, open, form]);

  const onSubmit = async (values: AddressFormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to save an address");
      return;
    }

    setIsSubmitting(true);
    let response;

    const payload = { ...values, customer_id: user.id };

    if (initialData) {
      response = await updateAddress(initialData.id, payload);
    } else {
      response = await addAddress(payload);
    }

    setIsSubmitting(false);

    if (response.success) {
      toast.success(initialData ? "Address updated successfully!" : "Address added successfully!");
      setOpen(false);
      onSuccess();
    } else {
      toast.error(response.message || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Address" : "Add Address"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Make changes to your address here." : "Add a new delivery address."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Home" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Flat/House No, Building" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Area, Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="Pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Near something..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4">
              <Button type="button" variant="outline" className="mr-2" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Address"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressForm;
