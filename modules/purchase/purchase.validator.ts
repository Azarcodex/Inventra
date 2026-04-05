import { z } from "zod";

export const purchaseSchema = z.object({
  supplierId: z.string().uuid("Invalid supplier ID"),
  referenceNo: z.string().optional().nullable(),
  items: z.array(z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().int().positive("Quantity must be positive"),
    costPrice: z.number().nonnegative("Cost price cannot be negative"),
  })).min(1, "At least one item is required"),
});

export type PurchaseInput = z.infer<typeof purchaseSchema>;
