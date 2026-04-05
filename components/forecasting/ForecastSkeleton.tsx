import React from "react";

const ForecastSkeleton = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* Weather Strip Skeleton */}
      <div className="bg-gray-200 rounded-2xl h-32 w-full"></div>

      {/* Title Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/4 mt-8"></div>

      {/* Insight Cards Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-5 bg-gray-100 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              
              <div className="flex gap-2 mt-4">
                <div className="h-6 bg-gray-50 rounded w-16"></div>
                <div className="h-6 bg-gray-50 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastSkeleton;
