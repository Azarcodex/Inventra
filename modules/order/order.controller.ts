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
};
