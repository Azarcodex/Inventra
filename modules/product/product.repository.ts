import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const baseWhere = {
  deletedAt: null,
};

export const productRepository = {
  // ✅ CREATE (with proper error handling)
  async create(data: {
    name: string;
    sku: string;
    price: number;
    stock: number;
    leadTime: number;
    bufferStock?: number;
  }, tx?: Prisma.TransactionClient) {
    const db = tx || prisma;
    try {
      return await db.product.create({
        data,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("SKU already exists");
      }
      throw error;
    }
  },

  // ✅ BASIC FETCH
  async findAll() {
    return prisma.product.findMany({
      where: baseWhere,
      orderBy: { createdAt: "desc" },
    });
  },

  // ✅ PAGINATED FETCH (cleaned up)
  async findPaginated(
    search: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = "createdAt",
    order: "asc" | "desc" = "desc"
  ) {
    const skip = (page - 1) * limit;

    const allowedSortFields = ["price", "stock", "createdAt"];
    const validatedField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const searchFilter = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              sku: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const where = {
      ...baseWhere,
      ...searchFilter,
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy: { [validatedField]: order },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  },

  // ✅ FIND BY ID
  async findById(id: string) {
    return prisma.product.findFirst({
      where: {
        id,
        ...baseWhere,
      },
    });
  },

  // ✅ UPDATE (FIXED)
  async update(id: string, data: Partial<{
    name: string;
    sku: string;
    price: number;
    stock: number;
    leadTime: number;
    bufferStock: number;
  }>) {
    // first check if active product exists
    const existing = await prisma.product.findFirst({
      where: {
        id,
        ...baseWhere,
      },
    });

    if (!existing) {
      throw new Error("Product not found or deleted");
    }

    return prisma.product.update({
      where: { id }, // ✅ ONLY unique field
      data,
    });
  },

  // ✅ SOFT DELETE (FIXED)
  async softDelete(id: string) {
    const existing = await prisma.product.findFirst({
      where: {
        id,
        ...baseWhere,
      },
    });

    if (!existing) {
      return null; // already deleted or doesn't exist
    }

    return prisma.product.update({
      where: { id }, // ✅ ONLY unique field
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
