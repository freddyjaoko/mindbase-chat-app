import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { GaTags } from "@/components/ga-tags";

import { QueryClientProvider } from "../lib/query-client-provider";

import { GlobalStateProvider } from "./(main)/o/[slug]/context";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mindbase",
  description: "MindBase connects to your company knowledge and lets you interact withyour data",
  applicationName: "Mindbase",
  manifest: "/manifest.webmanifest",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mindbase",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <GlobalStateProvider>
      <html lang="en" className="h-full w-full">
        <GaTags gaKey={process.env.GOOGLE_ANALYTICS_KEY} />
        <body className={`antialiased h-full w-full bg-white`}>
          <QueryClientProvider>{children}</QueryClientProvider>
          <Toaster position="bottom-center" />
        </body>
      </html>
    </GlobalStateProvider>
  );
}
