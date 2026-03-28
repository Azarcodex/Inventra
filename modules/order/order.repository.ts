import { Prisma, PrismaClient, MovementType } from "@prisma/client";

type TxClient = Prisma.TransactionClient | PrismaClient;

export const orderRepository = {
  async getProductForUpdate(productId: string, tx: TxClient) {
    return tx.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, stock: true, price: true },
    });
  },

  async decrementStock(productId: string, newStock: number, tx: TxClient) {
    return tx.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });
  },

  async createMovement(productId: string, quantity: number, type: MovementType, tx: TxClient) {
    return tx.stockMovement.create({
      data: {
        productId,
        quantity,
        type,
      },
    });
  },
};
