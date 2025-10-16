
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ResponsiveEcomerce from "../components/ResponsiveEcomerce";
import './category.css';
import { Suspense } from "react";
import ReactQueryProvider from "@/providers/QueryProvider";
import MobileBottomNav from "../components/MobileBottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Friends Telecom",
  description: "Bangladesh’s most trusted and popular Apple shop. Buy iPhone, MacBook, iPad, AirPods & more with best prices, warranty & fast delivery.",
  icons : {
    icon : "/favicon.jpg",
    
  }
};


export default function deshboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<ReactQueryProvider>
<Suspense fallback={<div>Loading...</div>}>
<ResponsiveEcomerce></ResponsiveEcomerce>

            <div className="flex  w-screen">
                 {children}

            
            </div>

        </Suspense>

</ReactQueryProvider>
        
           


      
       
      </body>
    </html>
  );
}
