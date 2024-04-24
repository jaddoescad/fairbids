import './globals.css'
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { LocationProvider } from "@/context/LocationContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

  export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'Fairbids',
    description: 'Compare renovation quotes and make informed decisions. Post your quotes, browse others, and ensure fair prices for your projects.',
    openGraph: {
      title: 'Fairbids',
      description: 'Compare renovation quotes and make informed decisions. Post your quotes, browse others, and ensure fair prices for your projects.',
      url: defaultUrl,
      type: 'website',
      images: [
        {
          url: `${defaultUrl}/static/images/logo.png`,
          width: 1200,
          height: 630,
          alt: 'Fairbids Preview Image',
        },
      ],
    },
  };
  

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



