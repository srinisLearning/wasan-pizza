"use server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
export const createPaymentIntent = async (amount: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      description: "Pizza Order Payment",
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while creating payment intent",
    };
  }
};