import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tic-Tac-Toe",
  description:
    "Tactile 2-player Tic-Tac-Toe. Design your custom character, pick your signature X/O mark, and climb the real-time Top 10 leaderboard.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${jakarta.variable} ${syne.variable} ${mono.variable}`}
    >
      <body className="font-sans studio-canvas min-h-screen text-[#F1F5F9]">
        {children}
      </body>
    </html>
  );
}
