import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  sku: z.string().min(1, "SKU must not be empty").optional(),

  price: z.number().min(0, "Selling price cannot be negative"),
  taxRate: z.number().min(0),
  
  preferredSupplierId: z.string().uuid("Invalid supplier selection").optional().nullable(),
  lastCostPrice: z.number().min(0),

  stock: z.number().min(0, "Stock cannot be negative"),

  leadTime: z.number().gt(0, "Lead time must be greater than 0"),

  bufferStock: z.number().min(0).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
