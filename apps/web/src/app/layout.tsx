import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

export const metadata: Metadata = {
  title: "SqueezeWeasel",
  description: "No-code/low-code AI automation studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

