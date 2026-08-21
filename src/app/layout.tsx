import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { ToastProvider } from "@/components/ui/toast";
import { InventoryProvider } from "@/features/inventory/inventory-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beaver | Bananas4Monkeys",
  description: "Sistema web de inventario para empresas peruanas, desarrollado por Bananas4Monkeys.",
  icons: {
    icon: "/brand/beaver-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <InventoryProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </InventoryProvider>
      </body>
    </html>
  );
}
