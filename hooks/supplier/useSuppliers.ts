import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export const useSuppliers = (options?: { activeOnly?: boolean }) => {
  return useQuery({
    queryKey: ["suppliers", options?.activeOnly],
    queryFn: async () => {
      const response = await apiClient.get("/suppliers");
      const suppliers = response.data.data; // Extract array from { success, data }
      
      if (!Array.isArray(suppliers)) return [];

      if (options?.activeOnly) {
        return suppliers.filter((s: any) => s.isActive);
      }
      return suppliers;
    },
  });
};
