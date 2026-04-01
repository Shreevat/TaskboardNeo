import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Board",
  description: "Drag-and-drop task board built with Next.js, shadcn/ui and dnd-kit",
};

import { Sidebar } from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased overflow-hidden`}>
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex-1 h-full overflow-hidden relative">
              {children}
            </div>
          </div>
      </body>
    </html>
  );
}
