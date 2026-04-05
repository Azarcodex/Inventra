import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gstNumber: z.string().optional().nullable(),
  contactPerson: z.string().optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  paymentTerms: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type SupplierInput = z.infer<typeof supplierSchema>;
