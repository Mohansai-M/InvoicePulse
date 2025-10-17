// src/app/layout.tsx
import "./globals.css";
import Navbar from "./components/NavBar";
import { AuthProvider } from "./Global/AuthContext";

export const metadata = {
  title: "InvoicePulse",
  description: "Upload, Extract, and Review Invoices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Navbar />
          <main className="main-container">{children}</main>
        </body>
      </AuthProvider>
    </html>
  );
}
