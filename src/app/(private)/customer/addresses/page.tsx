"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { IAddress } from "@/interfaces";
import AddressForm from "./_components/address-form";
import {
  deleteAddress,
  getAddressByCustomerId,
} from "@/server-actions/addresses";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/store/users-store";

const CustomerAddressesPage = () => {
  const { user } = useUserStore();
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addressToDelete, setAddressToDelete] = useState<IAddress | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    const response = await getAddressByCustomerId(user.id);
    if (response.success && response.data) {
      setAddresses(response.data as IAddress[]);
    } else {
      toast.error("Failed to fetch addresses");
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setIsFormOpen(true);
  };

  const handleEditAddress = (address: IAddress) => {
    setSelectedAddress(address);
    setIsFormOpen(true);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    setIsDeleting(true);
    const response = await deleteAddress(addressToDelete.id);
    setIsDeleting(false);

    if (response.success) {
      setAddresses((prev) => prev.filter((a) => a.id !== addressToDelete.id));
      toast.success("Address deleted successfully");
      setAddressToDelete(null);
    } else {
      toast.error(response.message || "Failed to delete address");
    }
  };

  const handleFormSuccess = () => {
    fetchAddresses();
  };

  return (
    <>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex justify-between items-center">
          <PageTitle title="My Addresses" />
          <Button onClick={handleAddAddress}>Add New Address</Button>
        </div>

        <div className="border rounded-md mt-5 mx-auto w-full bg-white">
          <Table>
            <TableHeader className="bg-primary/10 [&_tr]:border-primary border-primary">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Pincode</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                addresses.map((address) => (
                  <TableRow key={address.id}>
                    <TableCell className="font-medium">
                      {address.name}
                    </TableCell>
                    <TableCell>
                      {address.address_line_1}
                      {address.address_line_2 && `, ${address.address_line_2}`}
                      {address.landmark && ` (Near ${address.landmark})`}
                    </TableCell>
                    <TableCell>{address.city}</TableCell>
                    <TableCell>{address.pincode}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditAddress(address)}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAddressToDelete(address)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && addresses.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-24 text-gray-500"
                  >
                    No addresses found. Add one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddressForm
        open={isFormOpen}
        setOpen={setIsFormOpen}
        initialData={selectedAddress}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog
        open={!!addressToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setAddressToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the address{" "}
              <span className="font-medium">{addressToDelete?.name}</span>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAddress();
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

export default CustomerAddressesPage;
