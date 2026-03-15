import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/shared/lib/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager application",
  description: "Task Manager application for managing tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable} dark`}>
        <Providers>{children}</Providers>
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
