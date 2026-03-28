import { AnalyticsOverview } from "@/types/analytics.types";

interface Props {
  data?: AnalyticsOverview;
  isLoading?: boolean;
}

export const OverviewCards = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-50 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback if data is missing after loading
  const stats = data || {
    totalRevenue: 0,
    totalUnitsSold: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
        <p className="text-2xl font-bold mt-2">${stats.totalRevenue.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Units Sold</h3>
        <p className="text-2xl font-bold mt-2">{stats.totalUnitsSold.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-gray-500 text-sm font-medium">Low Stock Count</h3>
        <p className="text-2xl font-bold mt-2 text-warning">{stats.lowStockCount}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-gray-500 text-sm font-medium">Out of Stock Count</h3>
        <p className="text-2xl font-bold mt-2 text-destructive">{stats.outOfStockCount}</p>
      </div>
    </div>
  );
};
