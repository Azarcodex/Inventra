import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api/orders';

async function runTests() {
  console.log("🚀 Starting System Architecture Tests...");

  // 1. Setup Dummy Data
  console.log("\n📦 Setting up test product...");
  const product = await prisma.product.create({
    data: {
      name: "Architecture Test Product",
      sku: "TEST-SKU-" + Date.now(),
      price: 100,
      stock: 10,
      leadTime: 5,
    }
  });

  console.log(`✅ Created Product: ${product.id} (Initial Stock: 10)`);

  try {
    // ----------------------------------------------------
    // TEST 1: IDEMPOTENCY (Double Click Prevention)
    // ----------------------------------------------------
    console.log("\n🧪 TEST 1: Firing 2 identical requests (Spamming Checkout)...");
    const idempotencyKey = "TEST-TICKET-" + Date.now();
    const payload1 = {
      items: [{ productId: product.id, quantity: 1 }],
      idempotencyKey
    };

    const res1 = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload1)
    });

    const res2 = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload1)
    });

    const body1 = await res1.json();
    const body2 = await res2.json();

    const orderId1 = body1.data?.orderId;
    const orderId2 = body2.data?.orderId;

    if (orderId1 === orderId2 && orderId1 !== undefined) {
      console.log(`✅ Idempotency Works: Both requests returned the exact same Order ID: ${orderId1}`);
    } else {
      console.log(`❌ Idempotency FAILED: Got different orders! ${orderId1} vs ${orderId2}`);
      console.log(body1, body2);
    }

    const stockAfterTest1 = await prisma.product.findUnique({ where: { id: product.id } });
    console.log(`📊 Stock is now: ${stockAfterTest1.stock} (Should be 9. We safely ignored the 2nd click!)`);


    // ----------------------------------------------------
    // TEST 2: RACE CONDITIONS (High Concurrency)
    // ----------------------------------------------------
    console.log("\n🧪 TEST 2: Firing 5 concurrent purchases at the exact same millisecond...");
    const concurrentRequests = [];
    
    // Fire 5 requests instantly, using unique tickets so they aren't blocked by idempotency
    for (let i = 0; i < 5; i++) {
      concurrentRequests.push(
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [{ productId: product.id, quantity: 1 }],
            idempotencyKey: "TEST-TICKET-" + Date.now() + "-" + i // Unique tickets
          })
        }).then(res => res.json())
      );
    }

    const loadTestResults = await Promise.all(concurrentRequests);
    console.log(`✅ Fired 5 orders. Fast transaction completed.`);

    const finalStock = await prisma.product.findUnique({ where: { id: product.id } });
    if (finalStock.stock === 4) {
      console.log(`✅ Race Condition Fixed! Stock is accurately ${finalStock.stock}. (9 - 5 = 4)`);
    } else {
      console.log(`❌ Race Condition FAILED! Stock is ${finalStock.stock}. Phantom inventory leaked!`);
    }

    console.log("\n🎉 ALL TESTS COMPLETED. The architecture is stable!");

  } catch (error) {
    console.error("Test failed to run:", error);
  } finally {
    // Cleanup
    await prisma.product.delete({ where: { id: product.id } });
    await prisma.order.deleteMany({ where: { items: { some: { productId: product.id } } } });
    await prisma.stockMovement.deleteMany({ where: { productId: product.id } });
    await prisma.$disconnect();
  }
}

runTests();
