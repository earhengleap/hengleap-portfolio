import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "react-hot-toast";
import { CrispProvider } from "@/components/crisp-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Xing",
  description: "A developer portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <CrispProvider />
        <body className={`${poppins.variable} antialiased`}>
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
