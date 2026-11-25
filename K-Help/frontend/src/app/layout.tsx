import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTranslator } from "@/components/layout/PageTranslator";
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
          <LocaleProvider>
            <PageTranslator />
            <Navbar />
            <main className="container pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 md:py-10">
              {children}
            </main>
            <SiteFooter />
            <BottomNav />
            <PwaRegister />
            <Splash />
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
