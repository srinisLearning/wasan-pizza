import { validateJwtTokenAndGetUser } from "@/server-actions/users";
import ProfileCard from "@/components/functional/profile-card";
import React from "react";

async function PizzasPage() {
  const response = await validateJwtTokenAndGetUser();

  if (!response.success) {
    return <div>{response.message}</div>;
  }

  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <ProfileCard user={response.user!} />
    </div>
  );
}

export default PizzasPage;
