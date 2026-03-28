import { NextResponse } from "next/server";
import { stockService } from "@/modules/stock/stock.service";
import { apiHandler } from "@/utils/apiHandler";
import { STATUS_CODES } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/messages";

export const stockController = {
  createStockMovement: apiHandler(async (req: Request) => {
    const body = await req.json();

    const result = await stockService.createStockMovement(body);

    return NextResponse.json(
      {
        message: MESSAGES.STOCK_MOVEMENT_CREATED,
        data: result,
      },
      { status: STATUS_CODES.CREATED },
    );
  }),

  getMovements: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: STATUS_CODES.BAD_REQUEST },
      );
    }

    const result = await stockService.getMovements(productId);

    return NextResponse.json({
      data: result,
    });
  }),

  getProductStockStatus: apiHandler(
    async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
      const { id } = await params;
      const result = await stockService.getProductStockStatus(id);

      return NextResponse.json({
        success: true,
        data: result,
      });
    }
  )
};
