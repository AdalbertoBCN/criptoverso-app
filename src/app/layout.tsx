import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const notoSerif = localFont({
  src: "./fonts/NotoSerif.woff",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Criptoverso",
  description: "Um jogo de adivinhação de capítulos bíblicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSerif.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
