import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Elements, PaymentElement, AddressElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ onPaymentSuccess }: { onPaymentSuccess: (paymentId: string) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "An error occurred with your payment.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      onPaymentSuccess(paymentIntent.id);
    } else {
      toast.error("Unexpected payment status.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Billing Address</h3>
        <AddressElement options={{ mode: "billing" }} />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Details</h3>
        <PaymentElement />
      </div>
      <Button type="submit" disabled={!stripe || isLoading} className="w-full">
        {isLoading ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
};

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientSecret: string;
  onPaymentSuccess: (paymentId: string) => void;
}

export const PaymentDialog = ({ open, onOpenChange, clientSecret, onPaymentSuccess }: PaymentDialogProps) => {
  if (!clientSecret) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete your payment</DialogTitle>
          <DialogDescription>
            Enter your payment details below to complete your order.
          </DialogDescription>
        </DialogHeader>
        
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm onPaymentSuccess={onPaymentSuccess} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};
