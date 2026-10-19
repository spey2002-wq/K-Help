import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { PwaRegister } from "@/components/app/PwaRegister";
import { Splash } from "@/components/app/Splash";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "K-Help — Korea Life Platform",
    template: "%s · K-Help",
  },
  description:
    "Community, living guides, jobs, housing, real-time chat and AI translation for foreign residents in South Korea.",
  applicationName: "K-Help",
  appleWebApp: {
    capable: true,
    title: "K-Help",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <AuthProvider>
          <Navbar />
          <main className="container pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 md:py-10">
            {children}
          </main>
          <footer className="app-footer hidden border-t border-slate-200 bg-white md:block">
            <div className="container flex flex-col items-center justify-between gap-2 py-6 text-sm text-slate-500 sm:flex-row">
              <p className="font-medium text-slate-600">
                K-Help · Korea Life Platform for Foreign Residents
              </p>
              <p className="text-slate-400">NP Coders · Capstone Project</p>
            </div>
          </footer>
          <BottomNav />
          <PwaRegister />
          <Splash />
        </AuthProvider>
      </body>
    </html>
  );
}
