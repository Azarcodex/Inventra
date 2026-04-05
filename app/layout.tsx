import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { CopilotWidget } from "@/components/copilot/CopilotWidget";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} bg-slate-50 text-slate-900 antialiased`}>
        <Toaster richColors position="top-right" />
        <QueryProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-gray-50">
              {children}
            </main>
          </div>
          <CopilotWidget />
        </QueryProvider>
      </body>
    </html>
  );
}
