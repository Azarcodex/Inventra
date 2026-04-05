import { purchaseController } from "@/modules/purchase/purchase.controller";

export const GET = purchaseController.getPurchases;
export const POST = purchaseController.createPurchase;
