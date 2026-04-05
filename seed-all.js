const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting fresh data seed (30 products, 5 suppliers)");

  // 1. Create Suppliers
  const suppliersData = [
    { name: "Apex Electronics", gstNumber: "27AAECA1234F1Z5", contactPerson: "John Tech", email: "sales@apexelectronics.com", phone: "+91-9876543210", paymentTerms: "Net 30" },
    { name: "Kitchen Hub Distributors", gstNumber: "07AAACR5678B1Z2", contactPerson: "Sarah Chef", email: "orders@kitchenhub.in", phone: "+91-9988776655", paymentTerms: "Due on Receipt" },
    { name: "Office Essentials Co.", gstNumber: "19AADCO4321A1Z0", contactPerson: "Mike Admin", email: "support@officeco.com", phone: "+91-8877665544", paymentTerms: "Net 15" },
    { name: "Home Living Imports", gstNumber: "33AABCH9012C1Z9", contactPerson: "Lisa Home", email: "lisa@homeliving.com", phone: "+91-7766554433", paymentTerms: "Net 45" },
    { name: "Smart Gadgets Wholesale", gstNumber: "06AAEDG3456D1Z8", contactPerson: "Kevin Smart", email: "kevin@smartgadgets.io", phone: "+91-6655443322", paymentTerms: "Net 30" }
  ];

  const suppliers = [];
  for (const s of suppliersData) {
    const created = await prisma.supplier.create({ data: s });
    suppliers.push(created);
  }
  console.log(`✅ Created ${suppliers.length} Suppliers`);

  // 2. Create Products (30)
  const productsRaw = [
    { name: "Ergonomic Mesh Chair", sku: "CHAIR-001", price: 12500, taxRate: 18, lastCostPrice: 7500, stock: 15, leadTime: 7, bufferStock: 5 },
    { name: "Standing Desk 48-inch", sku: "DESK-048", price: 22000, taxRate: 18, lastCostPrice: 14000, stock: 8, leadTime: 10, bufferStock: 3 },
    { name: "Dual Monitor Arm", sku: "ACC-MNT-DL", price: 4500, taxRate: 12, lastCostPrice: 2200, stock: 25, leadTime: 4, bufferStock: 10 },
    { name: "Wireless Mechanical Keyboard", sku: "GAD-KBD-WL", price: 6800, taxRate: 18, lastCostPrice: 3800, stock: 40, leadTime: 5, bufferStock: 15 },
    { name: "Logitech MX Master 3S", sku: "GAD-MSE-MX3", price: 9500, taxRate: 18, lastCostPrice: 6200, stock: 12, leadTime: 5, bufferStock: 5 },
    { name: "USB-C Hub (7-in-1)", sku: "ACC-HUB-71", price: 3200, taxRate: 12, lastCostPrice: 1500, stock: 50, leadTime: 3, bufferStock: 20 },
    { name: "Noise Cancelling Headphones", sku: "AUD-HDPH-NC", price: 18000, taxRate: 18, lastCostPrice: 11000, stock: 10, leadTime: 12, bufferStock: 4 },
    { name: "Portable SSD 1TB", sku: "STO-SSD-1TB", price: 8500, taxRate: 18, lastCostPrice: 5500, stock: 30, leadTime: 4, bufferStock: 10 },
    { name: "Laptop Stand Aluminum", sku: "ACC-STND-LP", price: 1800, taxRate: 12, lastCostPrice: 800, stock: 60, leadTime: 3, bufferStock: 20 },
    { name: "Webcam 1080p", sku: "GAD-CAM-108", price: 4200, taxRate: 18, lastCostPrice: 2000, stock: 22, leadTime: 6, bufferStock: 8 },
    { name: "Chef's Knife 8-inch", sku: "KIT-KNF-008", price: 3500, taxRate: 12, lastCostPrice: 1600, stock: 18, leadTime: 5, bufferStock: 6 },
    { name: "Non-stick Skillet 12-inch", sku: "KIT-PAN-012", price: 2800, taxRate: 12, lastCostPrice: 1300, stock: 20, leadTime: 7, bufferStock: 10 },
    { name: "Digital Kitchen Scale", sku: "KIT-SCL-DIG", price: 1200, taxRate: 12, lastCostPrice: 500, stock: 45, leadTime: 4, bufferStock: 15 },
    { name: "AeroPress Coffee Maker", sku: "KIT-CFE-AER", price: 4000, taxRate: 18, lastCostPrice: 2200, stock: 14, leadTime: 8, bufferStock: 5 },
    { name: "Cast Iron Dutch Oven", sku: "KIT-POT-DTN", price: 7500, taxRate: 12, lastCostPrice: 4200, stock: 7, leadTime: 14, bufferStock: 4 },
    { name: "Adjustable Wall Shelf", sku: "HME-SHF-ADJ", price: 1500, taxRate: 18, lastCostPrice: 700, stock: 100, leadTime: 3, bufferStock: 30 },
    { name: "Smart LED Bulb (RGB)", sku: "HME-LIT-RGB", price: 950, taxRate: 12, lastCostPrice: 450, stock: 150, leadTime: 5, bufferStock: 50 },
    { name: "Organic Cotton Duvet", sku: "HME-BED-DVT", price: 5400, taxRate: 5, lastCostPrice: 3100, stock: 25, leadTime: 10, bufferStock: 10 },
    { name: "Wool Throw Blanket", sku: "HME-DEC-WOL", price: 2800, taxRate: 5, lastCostPrice: 1400, stock: 35, leadTime: 7, bufferStock: 12 },
    { name: "Velvet Accent Pillow", sku: "HME-DEC-PLW", price: 1100, taxRate: 12, lastCostPrice: 450, stock: 80, leadTime: 4, bufferStock: 25 },
    { name: "Hydroflask 32oz", sku: "KIT-BOT-HYD", price: 3200, taxRate: 12, lastCostPrice: 1600, stock: 40, leadTime: 6, bufferStock: 14 },
    { name: "Electric Gooseneck Kettle", sku: "KIT-KTL-ELC", price: 5800, taxRate: 18, lastCostPrice: 3300, stock: 12, leadTime: 8, bufferStock: 6 },
    { name: "French Press 1L", sku: "KIT-CFE-FRE", price: 2400, taxRate: 18, lastCostPrice: 1100, stock: 30, leadTime: 5, bufferStock: 10 },
    { name: "Magnetic Knife Strip", sku: "KIT-MAG-STP", price: 1400, taxRate: 12, lastCostPrice: 600, stock: 55, leadTime: 4, bufferStock: 15 },
    { name: "Table Clamp Power Strip", sku: "OFF-PWR-CLP", price: 2100, taxRate: 18, lastCostPrice: 1000, stock: 42, leadTime: 5, bufferStock: 12 },
    { name: "Leather Desk Mat", sku: "OFF-MAT-LTH", price: 1600, taxRate: 12, lastCostPrice: 750, stock: 70, leadTime: 4, bufferStock: 15 },
    { name: "Bamboo Monitor Stand", sku: "OFF-MNT-BAM", price: 2500, taxRate: 12, lastCostPrice: 1200, stock: 18, leadTime: 6, bufferStock: 8 },
    { name: "Vertical Ergonomic Mouse", sku: "GAD-MSE-VRT", price: 3400, taxRate: 18, lastCostPrice: 1800, stock: 26, leadTime: 5, bufferStock: 10 },
    { name: "Desk Ring Light", sku: "OFF-LIT-RING", price: 1900, taxRate: 12, lastCostPrice: 850, stock: 38, leadTime: 4, bufferStock: 12 },
    { name: "Under-desk Cable Tray", sku: "OFF-CBL-TRY", price: 1300, taxRate: 18, lastCostPrice: 500, stock: 65, leadTime: 3, bufferStock: 20 }
  ];

  for (let i = 0; i < productsRaw.length; i++) {
    const supplierIndex = i % suppliers.length;
    const prod = productsRaw[i];
    
    // Create product
    const createdProduct = await prisma.product.create({
      data: {
        ...prod,
        preferredSupplierId: suppliers[supplierIndex].id
      }
    });

    // 3. Log a corresponding "Initial" Purchase (using your architecture)
    // This will make them appear in Purchase History!
    await prisma.purchase.create({
      data: {
        supplierId: suppliers[supplierIndex].id,
        totalAmount: createdProduct.stock * createdProduct.lastCostPrice,
        referenceNo: `INIT-${createdProduct.sku}`,
        status: "COMPLETED",
        items: {
          create: [{
            productId: createdProduct.id,
            quantity: createdProduct.stock,
            costPrice: createdProduct.lastCostPrice
          }]
        }
      }
    });
  }

  console.log(`✅ Seeded 30 products into the database and linked to history.`);
  console.log("🎉 SUCCESS: Ready for testing.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
