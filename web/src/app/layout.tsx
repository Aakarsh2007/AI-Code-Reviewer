import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeSense AI — Enterprise Code Review",
  description: "AI-powered code analysis, bug detection, and optimization for professional developers.",
  keywords: ["code review", "AI", "static analysis", "developer tools"],
  authors: [{ name: "CodeSense AI" }],
  robots: "noindex, nofollow",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(222 47% 9%)",
              color: "hsl(210 40% 98%)",
              border: "1px solid hsl(217 33% 17%)",
              borderRadius: "0.625rem",
              fontSize: "0.875rem",
            },
            success: { iconTheme: { primary: "hsl(142 71% 45%)", secondary: "hsl(144 100% 5%)" } },
            error: { iconTheme: { primary: "hsl(0 84% 60%)", secondary: "hsl(210 40% 98%)" } },
          }}
        />
      </body>
    </html>
  );
}
