const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🗑️  Resetting all data...\n");

  // Delete in order to respect foreign key constraints
  await prisma.purchaseItem.deleteMany();
  console.log("  ✅ Deleted purchase items");

  await prisma.stockMovement.deleteMany();
  console.log("  ✅ Deleted stock movements");

  await prisma.purchase.deleteMany();
  console.log("  ✅ Deleted purchases");

  await prisma.orderItem.deleteMany();
  console.log("  ✅ Deleted order items");

  await prisma.order.deleteMany();
  console.log("  ✅ Deleted orders");

  await prisma.dailySales.deleteMany();
  console.log("  ✅ Deleted daily sales records");

  await prisma.productStats.deleteMany();
  console.log("  ✅ Deleted product stats records");

  await prisma.product.deleteMany();
  console.log("  ✅ Deleted products");

  await prisma.supplier.deleteMany();
  console.log("  ✅ Deleted suppliers");

//   console.log("\n🌱 Seeding initial supplier data...");

//   const suppliers = [
//     {
//       name: "Global Tech Solutions",
//       gstNumber: "GST123456789",
//       contactPerson: "John Doe",
//       email: "sales@globaltech.com",
//       phone: "+1 555-0101",
//       paymentTerms: "Net 30",
//     },
//     {
//       name: "Swift Logistics Inc.",
//       gstNumber: "GST987654321",
//       contactPerson: "Jane Smith",
//       email: "info@swiftlogistics.com",
//       phone: "+1 555-0102",
//       paymentTerms: "Net 15",
//     },
//     {
//       name: "Premium Goods Co.",
//       gstNumber: "GST456789123",
//       contactPerson: "Robert Brown",
//       email: "robert@premiumgoods.com",
//       phone: "+1 555-0103",
//       paymentTerms: "Cash on Delivery",
//     },
//   ];

//   for (const supplier of suppliers) {
//     await prisma.supplier.create({
//       data: supplier,
//     });
//   }

//   console.log(`  ✅ Seeded ${suppliers.length} suppliers`);

//   console.log("\n🎉 Database reset and seeding complete!");
// }
}
resetDatabase()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
