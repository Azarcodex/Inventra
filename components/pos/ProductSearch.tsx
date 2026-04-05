"use client";

import React, { useState, useEffect } from "react";

interface Props {
  onSearch: (value: string) => void;
}

export const ProductSearch = ({ onSearch }: Props) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 400);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search products by name or SKU..."
        className="w-full p-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
