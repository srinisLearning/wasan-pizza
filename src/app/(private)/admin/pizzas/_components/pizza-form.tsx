"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IPizza } from "@/interfaces";
import { pizzaCategories } from "@/constants/categories";
import { uploadImageAndGetUrl } from "@/server-actions/uploads";
import { addPizza, updatePizza } from "@/server-actions/pizzas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const pizzaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  sub_category: z.string().min(1, "Sub-category is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

type PizzaFormValues = z.infer<typeof pizzaSchema>;

interface PizzaFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: IPizza | null;
  onSuccess?: () => void;
}

const PizzaForm: React.FC<PizzaFormProps> = ({
  open,
  setOpen,
  initialData,
  onSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<PizzaFormValues>({
    resolver: zodResolver(pizzaSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "Vegetarian",
      sub_category: initialData?.["sub-category"] || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
      status: initialData?.status || "active",
    },
  });

  // Update form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      let mappedCategory = initialData.category || "Vegetarian";
      if (mappedCategory.toLowerCase().includes("non") || mappedCategory.toLowerCase().includes("nv")) {
        mappedCategory = "Non Vegetarian";
      } else if (mappedCategory.toLowerCase().includes("veg")) {
        mappedCategory = "Vegetarian";
      }

      let mappedSubCategory = initialData["sub-category"] || "";
      const matchSub = pizzaCategories.find(
        (c) =>
          c.value.toLowerCase() === mappedSubCategory.toLowerCase() ||
          c.label.toLowerCase() === mappedSubCategory.toLowerCase() ||
          mappedSubCategory.toLowerCase().includes(c.value.toLowerCase().substring(0, 5))
      );
      if (matchSub) {
        mappedSubCategory = matchSub.value;
      }

      form.reset({
        name: initialData.name,
        category: mappedCategory,
        sub_category: mappedSubCategory,
        description: initialData.description,
        image: initialData.image,
        status: initialData.status,
      });
    } else {
      form.reset({
        name: "",
        category: "Vegetarian",
        sub_category: "",
        description: "",
        image: "",
        status: "active",
      });
    }
    setSelectedFile(null);
  }, [initialData, form, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (values: PizzaFormValues) => {
    try {
      let imageUrl = values.image;

      if (selectedFile) {
        setIsUploading(true);
        const uploadResponse = await uploadImageAndGetUrl(selectedFile);
        if (uploadResponse.success && uploadResponse.imageUrl) {
          imageUrl = uploadResponse.imageUrl;
        } else {
          toast.error(uploadResponse.message || "Failed to upload image");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const pizzaData = {
        name: values.name,
        category: values.category,
        "sub-category": values.sub_category,
        description: values.description,
        status: values.status,
        image: imageUrl || "",
      };

      if (initialData) {
        const response = await updatePizza(initialData.id, pizzaData);
        if (response.success) {
          toast.success("Pizza updated successfully");
        } else {
          toast.error(response.message || "Failed to update pizza");
          return;
        }
      } else {
        const response = await addPizza(pizzaData);
        if (response.success) {
          toast.success("Pizza added successfully");
        } else {
          toast.error(response.message || "Failed to add pizza");
          setIsUploading(false);
          return;
        }
      }

      if (onSuccess) {
        onSuccess();
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Pizza" : "Add New Pizza"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pizza Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Margherita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Vegetarian" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Vegetarian
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Non Vegetarian" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Non Vegetarian
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sub_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pizzaCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="unvavailable">Unavailable</SelectItem>                   
                        
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Delicious pizza description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Pizza Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FormControl>
            {/*   {initialData?.image && !selectedFile && (
                <p className="text-xs text-gray-500 mt-2">
                  Current image URL: {initialData.image}
                </p>
              )}
              {selectedFile && (
                <p className="text-xs text-blue-500 mt-2">
                  New file selected: {selectedFile.name}
                </p>
              )} */}
            </FormItem>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                {isUploading || form.formState.isSubmitting
                  ? "Saving..."
                  : initialData
                  ? "Update Pizza"
                  : "Save Pizza"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PizzaForm;
