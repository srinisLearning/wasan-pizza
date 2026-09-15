import React, { useEffect, useState } from "react";
import PrivateHeader from "./private-header";
import { useUserStore } from "@/store/users-store";
import { IUser } from "@/interfaces";
import { validateJwtTokenAndGetUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import Spinner from "@/components/ui/spinner";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await validateJwtTokenAndGetUser();
        if (response.success && response.user) {
          setUser(response.user as IUser);
        } else {
          setError(response.message || "Failed to fetch user");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  if (loading) {
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  }
   
  if (error) {
    return(
      <div>
        "Error" : {error}
      </div>
    )
      
     
  }
  return (
    <div className="p-5">
      <PrivateHeader />
      {children}
    </div>
  );
};

export default PrivateLayout;
