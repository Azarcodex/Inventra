import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { CopilotWidget } from "@/components/copilot/CopilotWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 font-sans text-gray-900">
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
