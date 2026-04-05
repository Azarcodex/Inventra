import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SmartForecastResult } from "@/modules/smart-forecast/smartForecast.types";

export function useSmartForecast() {
  return useQuery<SmartForecastResult>({
    queryKey: ["smart-forecast"],
    queryFn: async () => {
      const { data } = await axios.get("/api/smart-forecast");
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (AI calls are expensive)
    retry: 1,
  });
}
