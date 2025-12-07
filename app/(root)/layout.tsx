import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Anton } from "next/font/google";
import Head from 'next/head'
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import CartSideBar from "@/components/CartSideBar/CartSideBar";
import './globals.css';
import Toast from "@/components/ToastNotification/Toast";
import Loading from "@/components/loader/loading";
import FloatingChatBot from "@/components/Chat/components/FloatingChatBot";
import { Toaster } from "@/components/ui/sonner"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "optional",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400", // Anton only comes in one weight
});

export const metadata: Metadata = {
  title: "OverClockedX",
  description: "Ecommerce for computer retail store - updgrade your's now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${anton.variable}`}>
      <body className="antialiased overflow-x-hidden">
        <NavBar />
        <Toaster />
        {children}
        <Toast />
        <Footer />
        <Loading />
        <FloatingChatBot />
      </body>
    </html>
  );
}
