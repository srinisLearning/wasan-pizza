import React from 'react'
import { validateJwtTokenAndGetUser } from "@/server-actions/users";
import HelpForm from "@/components/functional/help-form";
import PageTitle from "@/components/ui/page-title";

const CustomerHelpPage = async () => {
  const response = await validateJwtTokenAndGetUser();

  if (!response.success) {
    return <div>{response.message}</div>;
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="flex flex-col items-center bg-white shadow-md rounded-lg border border-primary max-w-2xl w-full p-6 justify-center">
        <PageTitle title="Help & Support" />
        <p className="text-gray-600 mt-2 text-center">
          Have a question or need assistance? <br /> Fill out the form below and
          we'll get back to you as soon as possible.
        </p>

        <HelpForm user={response.user} />
      </div>
    </div>
  );
};

export default CustomerHelpPage
