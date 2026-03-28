import { productController } from "@/modules/product/product.controller";

export const GET = productController.getProducts;
export const POST = productController.createProduct;
