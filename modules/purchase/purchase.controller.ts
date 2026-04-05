import { NextResponse } from "next/server";
import { purchaseService } from "./purchase.service";
import { apiHandler } from "@/utils/apiHandler";
import { STATUS_CODES } from "@/constants/statusCodes";

export const purchaseController = {
  createPurchase: apiHandler(async (req: Request) => {
    const body = await req.json();
    const data = await purchaseService.recordPurchase(body);
    return NextResponse.json({ success: true, data }, { status: STATUS_CODES.CREATED });
  }),

  getPurchases: apiHandler(async () => {
    const data = await purchaseService.getAllPurchases();
    return NextResponse.json({ success: true, data }, { status: STATUS_CODES.OK });
  }),

  getPurchase: apiHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const data = await purchaseService.getPurchaseById(id);
    if (!data) return NextResponse.json({ success: false, message: "Ledger entry not found" }, { status: STATUS_CODES.NOT_FOUND });
    return NextResponse.json({ success: true, data }, { status: STATUS_CODES.OK });
  })
};
