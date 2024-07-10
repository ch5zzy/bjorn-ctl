import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { ConfigProvider } from "antd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "bjorn-ctl",
  description: "Control center for bjorn-rgb device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#00d19d"
              },
            }}
          >
          {children}
          </ConfigProvider>
        </Suspense>
      </body>
    </html>
  );
}
