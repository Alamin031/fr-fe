import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ResponsiveEcommerce from "../components/ResponsiveEcomerce";

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
  icons: {
    icon: '/favicon.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="google-site-verification" content="google746b68f5bd72ee8e" ></meta>
      
      <meta name="facebook-domain-verification" content="agpej8ithgyhkzuoqrzjmlgt9ksype" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >


            {children}


       
      </body>
    </html>
  );
}
