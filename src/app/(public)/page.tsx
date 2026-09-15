import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold tracking-tighter text-white drop-shadow-md">
          Wasan<span className="text-primary ml-2">Pizza</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="font-bold text-white border-white/20 shadow-sm" size="sm">
              Sign In | Sign Up
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mt-2">
            <DropdownMenuItem asChild className="p-3 cursor-pointer">
              <Link href="/login">Login to Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="p-3 cursor-pointer">
              <Link href="/register" className="font-bold text-primary">Create an Account</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-32 lg:py-48 xl:py-64 flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-black">
          <Image
            src="/pizza-hero.jpg"
            alt="Delicious wood-fired pizza"
            fill
            className="object-cover opacity-60"
            priority
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl text-white drop-shadow-lg">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
              Hot & Fresh Pizza, <br className="hidden sm:inline" />
              Delivered to <span className="text-primary">Your Door</span>
            </h1>
            <p className="text-lg text-black md:text-xl max-w-[600px] mx-auto opacity-90">
              Craving the perfect slice? Wasan Pizza brings you the finest ingredients, hand-tossed crusts, and mouth-watering flavors right when you need them.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-lg px-8 h-14 rounded-full shadow-xl hover:scale-105 transition-transform">
              <Link href="/register">Order Now</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-lg px-8 h-14 rounded-full shadow-xl hover:scale-105 transition-transform bg-black text-white hover:bg-black/80">
              <Link href="/browse">Browse Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Page Content / Features */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-primary">Wasan Pizza</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full">
                <span className="text-4xl">🍕</span>
              </div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-muted-foreground">
                We use only the freshest ingredients, organic tomatoes, and 100% real mozzarella cheese.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Hot out of the oven and delivered to your doorstep in 30 minutes or less, guaranteed.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full">
                <span className="text-4xl">🔥</span>
              </div>
              <h3 className="text-xl font-bold">Wood-Fired</h3>
              <p className="text-muted-foreground">
                Authentic wood-fired ovens give our crusts that perfect crisp, char, and flavor.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-extrabold text-primary">10K+</span>
              <span className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Happy Customers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-extrabold text-primary">50K+</span>
              <span className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Pizzas Delivered</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-extrabold text-primary">4.9/5</span>
              <span className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Average Rating</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
