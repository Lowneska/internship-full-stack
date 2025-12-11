import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.css";
import "../assets/styles/globals.css";

/******************************************
 * Import fonts
 ******************************************/
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/******************************************
 * Title
 ******************************************/
export const metadata: Metadata = {
  title: "Workout app",
};

/******************************************
 * Root Layout
 ******************************************/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
