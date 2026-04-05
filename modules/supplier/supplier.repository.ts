import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { SupplierInput } from "./supplier.validator";

export const supplierRepository = {
  async getAll() {
    return prisma.supplier.findMany({
      orderBy: { name: "asc" },
    });
  },

  async findByName(name: string, tx?: Prisma.TransactionClient) {
    const db = tx || prisma;
    return db.supplier.findFirst({ where: { name } });
  },

  async getById(id: string) {
    return prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true, purchases: true }
        }
      }
    });
  },

  async create(data: SupplierInput, tx?: Prisma.TransactionClient) {
    const db = tx || prisma;
    return db.supplier.create({ data });
  },

  async update(id: string, data: Partial<SupplierInput>) {
    return prisma.supplier.update({
      where: { id },
      data,
    });
  },

  async setStatus(id: string, isActive: boolean) {
    return prisma.supplier.update({
      where: { id },
      data: { isActive },
    });
  }
};
