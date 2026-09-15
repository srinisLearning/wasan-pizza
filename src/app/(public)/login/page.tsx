"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import Link from "next/link"
import Cookies from "js-cookie"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { loginUser } from "@/server-actions/users"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.enum(["customer", "admin"], {
    required_error: "Please select a role.",
  })
})

export default function LoginPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "customer",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await loginUser(values)
      if (response.success) {
        Cookies.set("token", response.token, { expires: 1 })
        Cookies.set("role", response.role, { expires: 1 })
        Cookies.set("email", response.email, { expires: 1 })
        toast.success(response.message)
        
        if (response.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/customer/pizzas")
        }
      } else {
        toast.error(response.message)
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-[900px] mx-auto min-h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Left Column - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <Image
            src="/pizza-hero.jpg"
            alt="Delicious pizza"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col space-y-2 text-center">
              <Link href="/" className="text-sm font-semibold text-primary hover:underline self-start mb-4">
                &larr; Back to Home
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password to log in
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {form.formState.isSubmitting ? "Logging In..." : "Log In"}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}