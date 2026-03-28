import React from "react";

const TableSkeleton = () => {
  return (
    <div className="w-full h-full p-6 space-y-4 animate-pulse bg-white rounded-lg border border-gray-200 shadow-sm mt-4">
      {/* Header Skeleton */}
      <div className="flex gap-4 p-4 border-b border-gray-200">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6 ml-auto"></div>
      </div>

      {/* Rows Skeleton */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0">
          <div className="h-10 w-10 bg-gray-100 rounded-full flex-shrink-0"></div>
          <div className="space-y-2 flex-grow">
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
            <div className="h-3 bg-gray-50 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-100 rounded w-20"></div>
          <div className="h-4 bg-gray-100 rounded w-24"></div>
          <div className="h-8 bg-gray-100 rounded-md w-16 ml-auto"></div>
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
