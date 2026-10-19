import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";

// One variable family, used across its width axis:
// 62% (extra-condensed) for stadium-style display type, 100% for body, 125% for small labels.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TurfInApp",
  description: "TurfInApp - Your Premium turf Experience",
  icons: {
    icon: "/turfinLogo.svg",
  },
  // Safari shows its "Open in App Store" banner for the player app
  other: {
    "apple-itunes-app": "app-id=6785032253",
  },
};

export const viewport: Viewport = {
  themeColor: "#050E08",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} antialiased`}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
