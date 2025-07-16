// frontend/app/layout.tsx
import React from "react";
import "./globals.css";
import { AccountProvider } from "../context/AccountContext";
import { WalletProvider } from "../context/WalletContext";

export const metadata = {
  title: "Futures Simulator",
  description: "Trade simulator with leverage and wallet integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <AccountProvider>
            {children}
          </AccountProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
