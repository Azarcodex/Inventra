import { productRepository } from "@/modules/product/product.repository";
import {
  CreateProductInput,
  createProductSchema,
} from "@/modules/product/product.validator";
import { MESSAGES } from "@/constants/messages";
import { calculateStockStatus } from "@/utils/stockStatus";
import { generateSku } from "@/utils/generateSku";

export const productService = {
  // ✅ CREATE
  async createProduct(input: CreateProductInput) {
    const parsed = createProductSchema.parse(input);

    // Auto-generate SKU if not provided, otherwise normalize it
    parsed.sku = parsed.sku
      ? parsed.sku.trim().toUpperCase()
      : generateSku();

    return productRepository.create(parsed as Required<Pick<typeof parsed, "sku">> & typeof parsed);
  },

  // ✅ GET ALL (FIXED: add status)
  async getAllProducts() {
    const products = await productRepository.findAll();

    return products.map((product) => ({
      ...product,
      status: calculateStockStatus(product.stock, product.bufferStock),
    }));
  },

  // ✅ GET BY ID (FIXED: not found handling)
  async getProductById(id: string) {
    if (!id) {
      throw new Error(MESSAGES.PRODUCT_ID_REQUIRED);
    }

    const product = await productRepository.findById(id);

    if (!product) {
      throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    return {
      ...product,
      status: calculateStockStatus(product.stock, product.bufferStock),
    };
  },

  // ✅ PAGINATED (clean)
  async getPaginatedProducts({
    search,
    page,
    limit,
    sortBy,
    order,
  }: {
    search: string;
    page: number;
    limit: number;
    sortBy: string;
    order: "asc" | "desc";
  }) {
    const { products, total } = await productRepository.findPaginated(
      search,
      page,
      limit,
      sortBy,
      order
    );

    return {
      products: products.map((product) => ({
        ...product,
        status: calculateStockStatus(product.stock, product.bufferStock),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // ✅ UPDATE (FIXED PROPERLY)
  async updateProduct(id: string, input: Partial<CreateProductInput>) {
    if (!id) throw new Error(MESSAGES.PRODUCT_ID_REQUIRED);

    // optional: validate partial input safely
    const parsed = createProductSchema.partial().parse(input);

    // normalize SKU if provided
    if (parsed.sku) {
      parsed.sku = parsed.sku.trim().toUpperCase();
    }

    const updated = await productRepository.update(id, parsed);

    if (!updated) {
      throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    return updated;
  },

  // ✅ SOFT DELETE (FIXED RESPONSE)
  async softDeleteProduct(id: string) {
    if (!id) throw new Error(MESSAGES.PRODUCT_ID_REQUIRED);

    const deleted = await productRepository.softDelete(id);

    if (!deleted) {
      throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    return { message: MESSAGES.PRODUCT_SOFT_DELETED };
  },
};
