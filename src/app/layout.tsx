import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { TravelHUD } from "@/components/features/travel-hud";
import { AmbientSoundProvider } from "@/components/features/ambient-sound-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafarAI - Your AI Travel Concierge",
  description: "Experience the world effortlessly with AI-powered personalized travel planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AmbientSoundProvider>
            <TravelHUD />
            {children}
          </AmbientSoundProvider>
        </AuthProvider>
        <Toaster position="top-center" richColors />
        {/* Travelpayouts Verification */}
        <Script
          id="travelpayouts-verification"
          src="https://emrld.ltd/NDkxNzkw.js?t=491790"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
