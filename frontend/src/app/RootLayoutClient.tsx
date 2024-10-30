"use client";

import localFont from "next/font/local";
import { StoreProvider } from "../Components/StoreProvider/StoreProvider";
import { NextUIProvider } from "@nextui-org/system";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster
          richColors
          expand={true}
          position="top-right"
          duration={1000}
        />
        <NextUIProvider>
          <StoreProvider>
            <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
              {children}
            </SessionProvider>
          </StoreProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
