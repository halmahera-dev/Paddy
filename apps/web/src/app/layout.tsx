import type { Metadata } from "next";

import { Toaster } from "@paddy-field/ui/components/sonner";
import { TooltipProvider } from "@paddy-field/ui/components/tooltip";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "My App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            {children}
            <Toaster richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
