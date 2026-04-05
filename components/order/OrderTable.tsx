"use client";

import React from "react";
import { useOrders } from "@/hooks/order/useOrders";

export const OrderTable = () => {
  const { data, isLoading } = useOrders(1, 50);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
        <div className="h-12 bg-gray-50 border-b border-gray-100"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b border-gray-50 bg-white"></div>
        ))}
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Items</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-b last:border-0 border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <span className="text-gray-400 font-mono text-xs" title={order.id}>
                    {order.id.split("-")[0].toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="font-bold text-gray-800">
                    {new Date(order.createdAt).toLocaleString(undefined, { 
                      month: "short", 
                      day: "numeric", 
                      hour: "numeric", 
                      minute: "2-digit" 
                    })}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-600">
                    {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} Items
                  </span>
                </td>
                <td className="px-6 py-5 text-right font-black text-gray-900">
                  ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                  No orders found. Head to the POS to make a sale!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
