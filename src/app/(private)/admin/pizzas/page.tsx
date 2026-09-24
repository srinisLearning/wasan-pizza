"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
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
import { IPizza } from "@/interfaces";
import PizzaForm from "./_components/pizza-form";
import { deletePizza, getAllPizzas } from "@/server-actions/pizzas";
import { toast } from "react-hot-toast";

import { useRouter } from "next/navigation";

const AdminPizzaPage = () => {
  const router = useRouter();
  const [pizzas, setPizzas] = useState<IPizza[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState<IPizza | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pizzaToDelete, setPizzaToDelete] = useState<IPizza | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPizzas = async () => {
    setIsLoading(true);
    const response = await getAllPizzas();
    if (response.success && response.data) {
      setPizzas(response.data as IPizza[]);
    } else {
      toast.error("Failed to fetch pizzas");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const handleAddPizza = () => {
    setSelectedPizza(null);
    setIsFormOpen(true);
  };

  const handleEditPizza = (pizza: IPizza) => {
    setSelectedPizza(pizza);
    setIsFormOpen(true);
  };

  const handleDeletePizza = async () => {
    if (!pizzaToDelete) return;

    setIsDeleting(true);
    const response = await deletePizza(pizzaToDelete.id);
    setIsDeleting(false);

    if (response.success) {
      setPizzas((prev) => prev.filter((p) => p.id !== pizzaToDelete.id));
      toast.success("Pizza deleted successfully");
      setPizzaToDelete(null);
    } else {
      toast.error(response.message || "Failed to delete pizza");
    }
  };

  const handleFormSuccess = () => {
    fetchPizzas();
  };

  return (
    <>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex justify-between items-center">
          <PageTitle title="Pizzas List" />
          <Button onClick={handleAddPizza}>Add Pizza</Button>
        </div>

        <div className="border rounded-md mt-5 w-3xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pizzas.map((pizza) => (
                <TableRow key={pizza.id}>
                  <TableCell>
                    {pizza.image ? (
                      <img
                        src={pizza.image}
                        alt={pizza.name}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-md" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{pizza.name}</TableCell>
                  <TableCell className="capitalize">{pizza.category}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${pizza.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {pizza.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-5">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditPizza(pizza)}
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPizzaToDelete(pizza)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/admin/pizzas/variants/${pizza.id}`)
                      }
                      className="text-sm underline pointer"
                    >
                      Variants
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pizzas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-24 text-gray-500"
                  >
                    No pizzas found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PizzaForm
        open={isFormOpen}
        setOpen={setIsFormOpen}
        initialData={selectedPizza}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog
        open={!!pizzaToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPizzaToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete pizza?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium">{pizzaToDelete?.name}</span> and its
              image. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(e) => {
                // Keep the dialog open until the delete finishes
                e.preventDefault();
                handleDeletePizza();
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

export default AdminPizzaPage;
