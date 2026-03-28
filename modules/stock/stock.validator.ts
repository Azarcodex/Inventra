import { z } from "zod";
import { MovementType } from "@prisma/client";

export const createStockMovementSchema = z
  .object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z
      .number({ message: "Quantity must be a number" })
      .int("Quantity must be an integer"),
    type: z.nativeEnum(MovementType, {
      message: "Invalid movement type",
    }),
  })
  .refine(
    (data) => {
      // 🟢 For SALE and PURCHASE, quantity must ALWAYS be positive
      if (
        data.type === MovementType.SALE ||
        data.type === MovementType.PURCHASE
      ) {
        return data.quantity > 0;
      }
      // 🟢 For ADJUSTMENT, we allow negative values to decrement stock
      return data.quantity !== 0; // But not zero
    },
    {
      message: "Invalid quantity for selected movement type",
      path: ["quantity"],
    },
  );

export type CreateStockMovementInput = z.infer<
  typeof createStockMovementSchema
>;
