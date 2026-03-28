import { NextResponse } from "next/server";
import { orderService } from "./order.service";
import { apiHandler } from "@/utils/apiHandler";
import { STATUS_CODES } from "@/constants/statusCodes";

export const orderController = {
  createOrder: apiHandler(async (req: Request) => {
    const body = await req.json();
    const result = await orderService.createOrder(body);

    return NextResponse.json(
      { success: true, data: result },
      { status: STATUS_CODES.CREATED }
    );
  }),

  getOrders: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await orderService.getOrders(page, limit);

    return NextResponse.json(
      { success: true, ...result },
      { status: STATUS_CODES.OK }
    );
  }),
};
