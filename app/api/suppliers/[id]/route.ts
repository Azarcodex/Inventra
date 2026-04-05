import { supplierController } from "@/modules/supplier/supplier.controller";

export const PATCH = supplierController.updateSupplier;
export const PUT = supplierController.toggleStatus; // Using PUT for toggle for variety/clarity
