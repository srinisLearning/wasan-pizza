"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { IVariant } from "@/interfaces";
import { deleteVariant, getVariantsByPizzaId } from "@/server-actions/variants";
import { toast } from "react-hot-toast";
import VariantForm from "./variant-form";
import { useRouter } from "next/navigation";

interface VariantsContentProps {
  pizzaId: string;
}

const VariantsContent: React.FC<VariantsContentProps> = ({ pizzaId }) => {
  const router = useRouter();
  const [variants, setVariants] = useState<IVariant[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [variantToDelete, setVariantToDelete] = useState<IVariant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchVariants = async () => {
    setIsLoading(true);
    const response = await getVariantsByPizzaId(pizzaId);
    if (response.success && response.data) {
      setVariants(response.data as IVariant[]);
    } else {
      toast.error("Failed to fetch variants");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVariants();
  }, [pizzaId]);

  const handleFormSuccess = () => {
    fetchVariants();
  };

  const handleEdit = (variant: IVariant) => {
    setSelectedVariant(variant);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedVariant(null);
    setIsFormOpen(true);
  };

  const handleDeleteVariant = async () => {
    if (!variantToDelete) return;

    setIsDeleting(true);
    const response = await deleteVariant(variantToDelete.id);
    setIsDeleting(false);

    if (response.success) {
      setVariants((prev) => prev.filter((v) => v.id !== variantToDelete.id));
      toast.success("Variant deleted successfully");
      setVariantToDelete(null);
    } else {
      toast.error(response.message || "Failed to delete variant");
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>Add Variant</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-gray-500">
                    No variants found. Add a variant to get started.
                  </TableCell>
                </TableRow>
              ) : (
                variants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">{variant.type}</TableCell>
                    <TableCell>₹{variant.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(variant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setVariantToDelete(variant)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <VariantForm
        open={isFormOpen}
        setOpen={setIsFormOpen}
        pizzaId={pizzaId}
        initialData={selectedVariant}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog
        open={!!variantToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setVariantToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete variant?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the{" "}
              <span className="font-medium">{variantToDelete?.type}</span> variant.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDeleteVariant();
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VariantsContent;
