const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🗑️  Resetting all data...\n");

  // Delete in order to respect foreign key constraints
  const movements = await prisma.stockMovement.deleteMany();
  console.log(`  ✅ Deleted ${movements.count} stock movements`);

  const dailySales = await prisma.dailySales.deleteMany();
  console.log(`  ✅ Deleted ${dailySales.count} daily sales records`);

  const productStats = await prisma.productStats.deleteMany();
  console.log(`  ✅ Deleted ${productStats.count} product stats records`);

  const products = await prisma.product.deleteMany();
  console.log(`  ✅ Deleted ${products.count} products`);

  console.log("\n🎉 Database reset complete! All tables are empty.");
  console.log("   Dashboard will now show all zeros.");
}

resetDatabase()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
