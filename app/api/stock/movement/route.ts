export const dynamic = "force-dynamic";

import { stockController } from "@/modules/stock/stock.controller";

export const POST = stockController.createStockMovement;
export const GET = stockController.getMovements;
