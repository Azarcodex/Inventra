import { NextResponse } from "next/server";
import { overviewService } from "./overview/overview.service";
import { salesTrendService } from "./salesTrend/salesTrend.service";
import { lowStockService } from "./lowStock/lowStock.service";
import { apiHandler } from "@/utils/apiHandler";
import { STATUS_CODES } from "@/constants/statusCodes";
import { prisma } from "@/lib/db/prisma";

export const analyticsController = {
  getOverview: apiHandler(async () => {
    const overview = await overviewService.getOverview();

    return NextResponse.json(
      { success: true, data: overview },
      { status: STATUS_CODES.OK }
    );
  }),

  // Handle /api/analytics/sales-trend
  getSalesTrend: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const rangeParam = searchParams.get("range") || "7d";

    if (rangeParam !== "7d" && rangeParam !== "30d") {
      return NextResponse.json(
        { success: false, message: "Invalid range parameter. Allowed: 7d, 30d" },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    const trend = await salesTrendService.getSalesTrend(rangeParam);

    return NextResponse.json(
      { success: true, data: trend },
      { status: STATUS_CODES.OK }
    );
  }),

  // Handle /api/analytics/low-stock
  getLowStock: apiHandler(async () => {
    const LOW_STOCK_THRESHOLD = 10;

    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
        stock: { gt: 0, lte: LOW_STOCK_THRESHOLD },
      },
      select: {
        id: true,
        name: true,
        stock: true,
        bufferStock: true,
      },
      orderBy: { stock: "asc" },
    });

    const data = products.map((p) => ({
      productId: p.id,
      name: p.name,
      stock: p.stock,
      threshold: p.bufferStock || LOW_STOCK_THRESHOLD,
    }));

    return NextResponse.json(
      { success: true, data },
      { status: STATUS_CODES.OK }
    );
  }),

  // Handle /api/analytics/top-products
  getTopProducts: apiHandler(async () => {
    const stats = await prisma.productStats.findMany({
      where: { totalSold: { gt: 0 } },
      orderBy: { totalSold: "desc" },
      take: 10,
    });

    const productIds = stats.map((s) => s.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, deletedAt: null },
      select: { id: true, name: true },
    });

    const nameMap = new Map(products.map((p) => [p.id, p.name]));

    const data = stats
      .filter((s) => nameMap.has(s.productId))
      .map((s) => ({
        productId: s.productId,
        name: nameMap.get(s.productId)!,
        totalSold: s.totalSold,
      }));

    return NextResponse.json(
      { success: true, data },
      { status: STATUS_CODES.OK }
    );
  }),

  // Handle /api/analytics/dead-stock
  getDeadStock: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get("days");
    const days = daysParam && !isNaN(Number(daysParam)) ? Number(daysParam) : 30;

    const deadStock = await lowStockService.getDeadStockProducts(days);

    return NextResponse.json(
      { success: true, data: deadStock },
      { status: STATUS_CODES.OK }
    );
  }),

  // Handle /api/analytics/stockout-risk
  getStockoutRisk: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get("days");
    const days = daysParam && !isNaN(Number(daysParam)) ? Number(daysParam) : 7;

    const riskData = await lowStockService.getStockoutRisk(days);

    return NextResponse.json(
      { success: true, data: riskData },
      { status: STATUS_CODES.OK }
    );
  }),

  // Handle /api/analytics/restock
  getRestockRecommendations: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get("days");
    const days = daysParam && !isNaN(Number(daysParam)) ? Number(daysParam) : 7;

    const recommendations = await lowStockService.getRestockRecommendations(days);

    return NextResponse.json(
      { success: true, data: recommendations },
      { status: STATUS_CODES.OK }
    );
  }),

  // Handle /api/analytics/product-classification
  getProductClassification: apiHandler(async () => {
    const classifications = await lowStockService.getProductClassification();

    return NextResponse.json(
      { success: true, data: classifications },
      { status: STATUS_CODES.OK }
    );
  }),

  // Handle /api/analytics/health-score
  getInventoryHealth: apiHandler(async () => {
    const health = await lowStockService.getInventoryHealth();

    return NextResponse.json(
      { success: true, data: health },
      { status: STATUS_CODES.OK }
    );
  }),
};
