import { Poppins } from "next/font/google";
import "./globals.css";
import AuthLayout from "../components/common/authLayout";
import Header from "../components/common/header";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${poppins.variable} antialiased dark:bg-[#111111] bg-[#f4f4f5] text-[#111111] dark:text-[#f4f4f5]`}
      >
        {/* here will have the auth modal */}
        <AuthLayout />
        <Header />
        {children}
      </body>
    </html>
  );
}
