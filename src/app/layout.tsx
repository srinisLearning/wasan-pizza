import type { Metadata } from "next";
 import { Montserrat, Geist } from "next/font/google";
 import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
 
import CustomLayout from "@/custom-layout";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
 

export const metadata: Metadata = {
  title: "Wasan Pizza",
  description: "Pizza Delivery App",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", geist.variable)}
    >
      <body
        className={`antialiased ${montserrat.className} min-h-full flex flex-col`}
        cz-shortcut-listen="true"
      >
        <CustomLayout>{children}</CustomLayout>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { fontSize: "20px", color: "#000" },
          }}
        />
      </body>
    </html>
  );
}
 