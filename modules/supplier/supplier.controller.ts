import { NextResponse } from "next/server";
import { supplierService } from "./supplier.service";
import { apiHandler } from "@/utils/apiHandler";
import { STATUS_CODES } from "@/constants/statusCodes";

export const supplierController = {
  getSuppliers: apiHandler(async () => {
    const data = await supplierService.getAllSuppliers();
    return NextResponse.json({ success: true, data }, { status: STATUS_CODES.OK });
  }),

  createSupplier: apiHandler(async (req: Request) => {
    const body = await req.json();
    const data = await supplierService.createSupplier(body);
    return NextResponse.json({ success: true, data }, { status: STATUS_CODES.CREATED });
  }),

  updateSupplier: apiHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await req.json();
    const data = await supplierService.updateSupplier(id, body);
    return NextResponse.json({ success: true, data }, { status: STATUS_CODES.OK });
  }),

  toggleStatus: apiHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const data = await supplierService.toggleSupplierStatus(id);
    return NextResponse.json({ success: true, data }, { status: STATUS_CODES.OK });
  })
};
