// app/layout.tsx

import type { Metadata } from "next";
import { JetBrains_Mono, Fira_Code, Source_Code_Pro, Hanuman } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SettingsProvider } from "@/components/providers/settings-provider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrains",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-source-code",
});

const hanuman = Hanuman({
  subsets: ["khmer", "latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-hanuman",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} ${firaCode.variable} ${sourceCodePro.variable} ${hanuman.variable} antialiased text-foreground h-screen overflow-hidden`} suppressHydrationWarning>
        <SettingsProvider>
          <script
            type="module"
            defer
            src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/spiral.js"
          ></script>
          {children}
          <Toaster position="bottom-right" />
        </SettingsProvider>
      </body>
    </html>
  );
}
