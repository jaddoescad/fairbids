import './globals.css'
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { LocationProvider } from "@/context/LocationContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className={"h-full"}>
      <body className="bg-background text-foreground h-full">
        <main className="h-full flex flex-col items-center">
          <LocationProvider>
            <ChakraProvider>{children}</ChakraProvider>
          </LocationProvider>
        </main>
      </body>
    </html>
  );
}



