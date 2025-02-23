"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import LoginCheck from "@/components/loginCheck";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <html lang="en">
      <head>
      <title>Seller Dashboard</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <LoginCheck>{children}</LoginCheck>
        </Providers>
      </body>
    </html>
  );
}
