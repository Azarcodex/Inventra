export const dynamic = "force-dynamic";

import { supplierController } from "@/modules/supplier/supplier.controller";

export const GET = supplierController.getSuppliers;
export const POST = supplierController.createSupplier;
