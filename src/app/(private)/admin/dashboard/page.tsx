'use client'
import ProfileCard from "@/components/functional/profile-card";
import { useUserStore } from "@/store/users-store";
import React from "react";

function AdminDashboardPage() {
  const { user } = useUserStore();

  return (
    <div>
      <h1>Admin Dashboard page</h1>
      <ProfileCard user={user!} />
    </div>
  );
}

export default AdminDashboardPage;









/* "use client";
import React, { useEffect, useState } from 'react';
import { validateJwtTokenAndGetUser } from "@/server-actions/users";
import ProfileCard from "@/components/functional/profile-card";
import { IUser } from "@/interfaces";

const AdminDashboardPage = () => {
  const [user, setUser] = useState<IUser | null>(null);
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

  return (
    <div className="m-5 flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Admin Dashboard Page</h1>
      {loading && <div className="text-gray-500">Loading user data...</div>}
      {error && <div className="text-red-500 font-semibold">{error}</div>}
      {user && <ProfileCard user={user} />}
    </div>
  )
}

export default AdminDashboardPage; */