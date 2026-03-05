// app/layout.tsx

import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import React, { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "react-hot-toast";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Xing | Codex Coder",
  description: "A professional developer portfolio mimicking a code editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" className="dark">
        <body className={`${jetbrainsMono.variable} font-mono antialiased bg-background text-foreground h-screen overflow-hidden`}>
          <script
            type="module"
            defer
            src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/spiral.js"
          ></script>
          {children}
          <Toaster position="bottom-right" />
        </body>
      </html>
    </AuthProvider>
  );
}
