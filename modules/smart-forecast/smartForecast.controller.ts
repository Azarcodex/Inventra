import { NextResponse } from "next/server";
import { smartForecastService } from "./smartForecast.service";
import { apiHandler } from "@/utils/apiHandler";
import { STATUS_CODES } from "@/constants/statusCodes";

export const smartForecastController = {
  getSmartForecast: apiHandler(async () => {
    const data = await smartForecastService.generateSmartForecast();

    return NextResponse.json(
      { success: true, data },
      { status: STATUS_CODES.OK }
    );
  }),
};
