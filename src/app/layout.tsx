import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/header/Navbar";
import Sidebar from "../components/main/Sidebar";
import TakeInput from "../components/main/TakeInput";
import { AuthProvider } from "../context/Authcontext";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const refreshTasks = () => {
    // Placeholder function to refresh tasks (if needed)
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <div className="flex min-h-screen mt-5">
            <Sidebar />
            <div className="flex-1 px-4">
              <div className="min-h-[200px] flex justify-center items-center">
                <TakeInput refreshTasks={refreshTasks} />
              </div>
              {children}
            </div>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </body>
    </html>
  );
}
