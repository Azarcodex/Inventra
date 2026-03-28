"use client";

import React from "react";
import { OrderTable } from "@/components/order/OrderTable";

export default function OrdersPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order History</h1>
          <p className="text-gray-500 font-medium mt-1">View all completed POS transactions</p>
        </header>

        <OrderTable />
      </div>
    </main>
  );
}
