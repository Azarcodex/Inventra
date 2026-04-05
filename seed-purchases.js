 const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Generating backdated purchase history for initial stock...");

  // Fetch all existing products and suppliers
  const products = await prisma.product.findMany();
  const suppliers = await prisma.supplier.findMany();

  if (products.length === 0 || suppliers.length === 0) {
    console.log("No products or suppliers found. Please run the default seeder first.");
    return;
  }

  // Create a map of supplier ID to their products
  const supplierToProducts = {};
  for (const product of products) {
    if (product.preferredSupplierId && product.stock > 0) {
      if (!supplierToProducts[product.preferredSupplierId]) {
        supplierToProducts[product.preferredSupplierId] = [];
      }
      supplierToProducts[product.preferredSupplierId].push(product);
    }
  }

  // Generate a mock purchase for each supplier that has stock
  for (const supplierId of Object.keys(supplierToProducts)) {
    const supplierProducts = supplierToProducts[supplierId];
    
    let totalAmount = 0;
    const purchaseItems = [];

    for (const product of supplierProducts) {
      // Use the current stock as the "purchased" quantity, and lastCostPrice
      const cost = product.lastCostPrice || (product.price * 0.5); // Fallback cost
      const subtotal = product.stock * cost;
      totalAmount += subtotal;

      purchaseItems.push({
        productId: product.id,
        quantity: product.stock,
        costPrice: cost
      });
    }

    if (purchaseItems.length === 0) continue;

    // Create the Purchase and its Line Items
    const purchase = await prisma.purchase.create({
      data: {
        supplierId: supplierId,
        totalAmount: totalAmount,
        status: "COMPLETED",
        referenceNo: `PO-INIT-${Math.floor(1000 + Math.random() * 9000)}`,
        items: {
          create: purchaseItems
        }
      }
    });

    console.log(`Created Purchase Record ${purchase.id} for Supplier ${supplierId} with ${purchaseItems.length} items (Total: $${totalAmount}).`);
  }

  console.log("Successfully retrofitted purchase history into the ledger!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
