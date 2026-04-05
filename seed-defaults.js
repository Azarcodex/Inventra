const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding process...");

  // Create Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: "Global Tech Supplies",
      gstNumber: "GSTIN-12345-TEC",
      contactPerson: "Alice Johnson",
      email: "alice@globaltech.com",
      phone: "+1-555-0101",
      paymentTerms: "Net 30",
    }
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: "Fresh Goods Distributors",
      gstNumber: "GSTIN-67890-FGD",
      contactPerson: "Bob Smith",
      email: "bob@freshgoods.com",
      phone: "+1-555-0202",
      paymentTerms: "Upon Receipt",
    }
  });

  console.log("Created 2 default suppliers.");

  // Create Products
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Wireless Mouse Pro",
        sku: "WM-PRO-001",
        price: 29.99,
        lastCostPrice: 15.00,
        stock: 50,
        leadTime: 3,
        bufferStock: 10,
        preferredSupplierId: supplier1.id,
      },
      {
        name: "Mechanical Keyboard X",
        sku: "MK-X-002",
        price: 89.99,
        lastCostPrice: 45.00,
        stock: 20,
        leadTime: 5,
        bufferStock: 5,
        preferredSupplierId: supplier1.id,
      },
      {
        name: "Organic Arabica Coffee Beans (1kg)",
        sku: "COF-ORG-1KG",
        price: 18.50,
        lastCostPrice: 8.00,
        stock: 120,
        leadTime: 2,
        bufferStock: 20,
        preferredSupplierId: supplier2.id,
      },
      {
        name: "Ergonomic Office Chair",
        sku: "FURN-CHR-01",
        price: 199.99,
        lastCostPrice: 100.00,
        stock: 5, // Designed to trigger low stock warnings
        leadTime: 14,
        bufferStock: 10,
        preferredSupplierId: supplier1.id,
      },
      {
        name: "Premium Green Tea Box",
        sku: "TEA-GRN-BX",
        price: 12.00,
        lastCostPrice: 5.00,
        stock: 0, // Designed to trigger out of stock behavior / disabled checkout
        leadTime: 2,
        bufferStock: 15,
        preferredSupplierId: supplier2.id,
      }
    ]
  });

  console.log(`Created ${products.count} default products.`);
  console.log("Seeding complete. You can now test the POS terminal, Inventory view, and Checkout.");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
