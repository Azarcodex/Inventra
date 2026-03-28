import { DashboardContainer } from "@/components/dashboard/DashboardContainer";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold px-6 text-gray-800">Analytics Dashboard</h1>
        <DashboardContainer />
      </div>
    </main>
  );
}
