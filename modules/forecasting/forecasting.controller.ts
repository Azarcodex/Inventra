import { NextResponse } from "next/server";
import { forecastingService } from "./forecasting.service";
import { apiHandler } from "@/utils/apiHandler";
import { STATUS_CODES } from "@/constants/statusCodes";

export const forecastingController = {
  getForecasts: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days")) || 30;

    const data = await forecastingService.generateForecasts(days);

    return NextResponse.json(
      { success: true, data },
      { status: STATUS_CODES.OK }
    );
  }),
};
