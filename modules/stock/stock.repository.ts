import { Prisma, MovementType } from "@prisma/client";

type Tx = Prisma.TransactionClient;

export const stockRepository = {
  async getProductForUpdate(tx: Tx, productId: string) {
    const result = await tx.$queryRaw<Array<{ id: string; stock: number }>>`
      SELECT id, stock 
      FROM "Product"
      WHERE id = ${productId}
      FOR UPDATE
    `;

    return result[0] || null;
  },

  async updateProductStock(tx: Tx, productId: string, newStock: number) {
    return tx.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });
  },

  async createMovement(
    tx: Tx,
    data: {
      productId: string;
      type: MovementType;
      quantity: number;
    },
  ) {
    return tx.stockMovement.create({
      data,
    });
  },

  async findByProductId(productId: string) {
    const { prisma } = await import("@/lib/db/prisma");
    return prisma.stockMovement.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });
  },
};
