import { z } from "zod";
import { MovementType } from "@prisma/client";

export const analyticsMovementEventSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  type: z.nativeEnum(MovementType),
  quantity: z.number().int().positive("Quantity must be positive for analytics updating"),
  price: z.number().min(0, "Price cannot be negative").nullable().optional(),
}).refine((data) => {
  if (data.type === "SALE" && data.price == null) {
    return false;
  }
  return true;
}, {
  message: "Price is required for SALE analytics",
  path: ["price"],
});

export type AnalyticsMovementEvent = z.infer<typeof analyticsMovementEventSchema>;
