"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface HelpFormProps {
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

function HelpForm({ user }: HelpFormProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setLoading(true);
    try {
      // Here you would typically call a server action to send the message
      // For now, we will just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully!");
      setMessage("");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6 max-w-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={user.name} disabled className="bg-gray-50" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={user.phone || "N/A"} disabled className="bg-gray-50" />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled className="bg-gray-50" />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="message">How can we help you?</Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[150px] resize-y"
          required
        />
      </div>
      
      <Button type="submit" disabled={loading} className="w-full md:w-auto self-start">
        {loading ? "Sending..." : "Submit Message"}
      </Button>
    </form>
  );
}

export default HelpForm;
