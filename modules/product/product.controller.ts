import { productService } from "@/modules/product/product.service";
import { NextResponse } from "next/server";
import { apiHandler } from "@/utils/apiHandler";
import { STATUS_CODES } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/messages";

export const productController = {
  // ✅ GET PRODUCTS (search + pagination + sorting)
  getProducts: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const sortBy = searchParams.get("sortBy") || "createdAt";

    const orderParam = searchParams.get("order");
    const order: "asc" | "desc" =
      orderParam === "asc" || orderParam === "desc" ? orderParam : "desc";

    const result = await productService.getPaginatedProducts({
      search,
      page,
      limit,
      sortBy,
      order,
    });

    return NextResponse.json(
      {
        message: MESSAGES.PRODUCT_FETCHED,
        ...result, // ✅ clean response (products + pagination)
      },
      { status: STATUS_CODES.OK },
    );
  }),

  // ✅ CREATE PRODUCT
  createProduct: apiHandler(async (req: Request) => {
    const body = await req.json();

    const product = await productService.createProduct(body);

    return NextResponse.json(
      {
        message: MESSAGES.PRODUCT_CREATED,
        data: product,
      },
      { status: STATUS_CODES.CREATED },
    );
  }),

  // ✅ UPDATE PRODUCT
  updateProduct: apiHandler(
    async (
      req: Request,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;
      const body = await req.json();

      const product = await productService.updateProduct(id, body);

      return NextResponse.json(
        {
          message: MESSAGES.PRODUCT_UPDATED,
          data: product,
        },
        { status: STATUS_CODES.OK }
      );
    }
  ),

  // ✅ SOFT DELETE PRODUCT
  softDeleteProduct: apiHandler(
    async (
      req: Request,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;

      await productService.softDeleteProduct(id);

      return NextResponse.json(
        {
          message: MESSAGES.PRODUCT_SOFT_DELETED,
          success: true,
        },
        { status: STATUS_CODES.OK }
      );
    }
  )
};
