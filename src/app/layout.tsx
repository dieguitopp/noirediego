import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RetroBootLoader from "@/components/RetroBootLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "noirediego",
  description: "my cool bio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RetroBootLoader
          audioSrc="/assets/boot.mp3"
          completeGifSrc="/assets/dove.gif"
          mountChildrenAfterDone={true}
        >
          {children}
        </RetroBootLoader>
      </body>
    </html>
  );
}
