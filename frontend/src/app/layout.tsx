// "use client"; // Ensures that this is a Client Component

// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "./globals.css";
// import { StoreProvider } from "../Components/StoreProvider/StoreProvider";
// import { NextUIProvider } from "@nextui-org/system";
// import { Toaster } from "sonner";
// import { SessionProvider } from "next-auth/react";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "SyncUp",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <Toaster
//           richColors
//           expand={true}
//           position="top-right"
//           duration={1000}
//         />
//         <NextUIProvider>
//           <StoreProvider>
//             <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
//               {children}
//             </SessionProvider>
//           </StoreProvider>
//         </NextUIProvider>
//       </body>
//     </html>
//   );
// }

import { Metadata } from "next";
import RootLayoutClient from "./RootLayoutClient"; // Client component with providers

export const metadata: Metadata = {
  title: "SyncUp",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
