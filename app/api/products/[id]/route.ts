import { productController } from "@/modules/product/product.controller";

export const PUT = productController.updateProduct;
export const DELETE = productController.softDeleteProduct;