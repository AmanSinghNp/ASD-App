import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to generate order ID
let orderCounter = 1;
function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const counter = String(orderCounter++).padStart(3, '0');
  return `ORD-${year}${month}${day}-${counter}`;
}

async function main() {
  console.log("Starting database seeding...");

  // Create users
  const staffUser = await prisma.user.upsert({
    where: { email: "staff@example.com" },
    update: {},
    create: {
      email: "staff@example.com",
      passwordHash: "placeholder_hash_for_staff",
      role: "STAFF",
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      passwordHash: "placeholder_hash_for_customer",
      role: "CUSTOMER",
    },
  });

  console.log("Users created:", { staffUser, customerUser });

  // Check if products exist, create 10 if none
  const existingProducts = await prisma.product.count();
  let products = [];

  if (existingProducts === 0) {
    console.log("No products found, creating 10 active products...");

    const productData = [
      {
        id: "PROD-APL-001",
        sku: "APL-001",
        name: "Apple Gala 1kg",
        category: "Fruits",
        priceCents: 450,
        stockQty: 120,
      },
      {
        id: "PROD-MLK-002",
        sku: "MLK-002",
        name: "Milk 2L",
        category: "Dairy",
        priceCents: 390,
        stockQty: 80,
      },
      {
        id: "PROD-BRC-003",
        sku: "BRC-003",
        name: "Brown Rice 5kg",
        category: "Pantry",
        priceCents: 1690,
        stockQty: 40,
      },
      {
        id: "PROD-BAN-004",
        sku: "BAN-004",
        name: "Banana Bunch",
        category: "Fruits",
        priceCents: 250,
        stockQty: 200,
      },
      {
        id: "PROD-BREAD-005",
        sku: "BREAD-005",
        name: "Whole Wheat Bread",
        category: "Bakery",
        priceCents: 320,
        stockQty: 60,
      },
      {
        id: "PROD-EGG-006",
        sku: "EGG-006",
        name: "Free Range Eggs 12pk",
        category: "Dairy",
        priceCents: 680,
        stockQty: 50,
      },
      {
        id: "PROD-CHK-007",
        sku: "CHK-007",
        name: "Chicken Breast 1kg",
        category: "Meat",
        priceCents: 1200,
        stockQty: 30,
      },
      {
        id: "PROD-CAR-008",
        sku: "CAR-008",
        name: "Carrots 1kg",
        category: "Vegetables",
        priceCents: 180,
        stockQty: 100,
      },
      {
        id: "PROD-POT-009",
        sku: "POT-009",
        name: "Potatoes 2kg",
        category: "Vegetables",
        priceCents: 350,
        stockQty: 75,
      },
      {
        id: "PROD-ONI-010",
        sku: "ONI-010",
        name: "Onions 1kg",
        category: "Vegetables",
        priceCents: 220,
        stockQty: 90,
      },
    ];

    products = await Promise.all(
      productData.map((data) =>
        prisma.product.create({
          data: {
            ...data,
            imageUrl: "",
            isActive: true,
          },
        })
      )
    );

    console.log("Created 10 products:", products.length);
  } else {
    products = await prisma.product.findMany();
    console.log("Found existing products:", products.length);
  }

  // Ensure additional catalogue items (to align with frontend mock data) exist
  const additionalProducts = [
    { sku: 'TEST-OUT-001', name: 'Dragon Fruit (Out of Stock)', category: 'Fruits', priceCents: 999, stockQty: 0 },
    { sku: 'TEST-OUT-002', name: 'Seaweed Snack (Out of Stock)', category: 'Snacks', priceCents: 299, stockQty: 0 },
    { sku: 'TOM-007', name: 'Tomatoes 1kg', category: 'Vegetables', priceCents: 340, stockQty: 110 },
    { sku: 'CHS-008', name: 'Cheddar Cheese 500g', category: 'Dairy', priceCents: 850, stockQty: 50 },
    { sku: 'CAR-009', name: 'Carrots 1kg', category: 'Vegetables', priceCents: 210, stockQty: 130 },
    { sku: 'SNK-011', name: 'Potato Chips 200g', category: 'Snacks', priceCents: 350, stockQty: 150 },
    { sku: 'DRK-012', name: 'Orange Juice 1L', category: 'Drinks', priceCents: 420, stockQty: 100 },
    { sku: 'CLN-013', name: 'Laundry Detergent 2L', category: 'Cleaning', priceCents: 990, stockQty: 60 },
    { sku: 'FRZ-014', name: 'Frozen Peas 500g', category: 'Frozen', priceCents: 270, stockQty: 80 },
    { sku: 'BVG-015', name: 'Coffee Beans 1kg', category: 'Beverages', priceCents: 1590, stockQty: 40 },
    { sku: 'YOG-016', name: 'Greek Yogurt 1kg', category: 'Dairy', priceCents: 690, stockQty: 70 },
    { sku: 'AVO-017', name: 'Avocado 2 pack', category: 'Fruits', priceCents: 480, stockQty: 90 },
    { sku: 'PAST-018', name: 'Pasta Penne 500g', category: 'Pantry', priceCents: 220, stockQty: 120 },
    { sku: 'TUNA-019', name: 'Canned Tuna 185g', category: 'Pantry', priceCents: 180, stockQty: 200 },
    { sku: 'ICE-020', name: 'Ice Cream Vanilla 1L', category: 'Frozen', priceCents: 650, stockQty: 60 },
    { sku: 'BIS-021', name: 'Chocolate Biscuits 250g', category: 'Snacks', priceCents: 320, stockQty: 110 },
    { sku: 'SPIN-022', name: 'Baby Spinach 120g', category: 'Vegetables', priceCents: 350, stockQty: 80 },
    { sku: 'SALM-023', name: 'Salmon Fillet 250g', category: 'Meat', priceCents: 990, stockQty: 50 },
    { sku: 'WATR-024', name: 'Spring Water 1.5L', category: 'Drinks', priceCents: 160, stockQty: 180 },
    { sku: 'SOAP-025', name: 'Hand Soap 250ml', category: 'Cleaning', priceCents: 210, stockQty: 140 },
  ];

  console.log('Upserting additional products to match frontend catalogue...');
  for (const p of additionalProducts) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        id: `PROD-${p.sku}`,
        sku: p.sku,
        name: p.name,
        category: p.category,
        priceCents: p.priceCents,
        stockQty: p.stockQty,
        imageUrl: '',
        isActive: true,
      },
    });
  }
  console.log('Additional products ensured.');

  // Create realistic delivery orders with varied statuses
  const today = new Date();
  const customerNames = [
    "John Smith",
    "Sarah Johnson",
    "Mike Chen",
    "Emma Wilson",
    "David Brown",
    "Lisa Davis",
    "Tom Anderson",
    "Amy Taylor",
  ];
  const addresses = [
    { line1: "123 Main St", suburb: "Sydney", state: "NSW", postcode: "2000" },
    {
      line1: "456 Oak Ave",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    },
    {
      line1: "789 Pine Rd",
      suburb: "Brisbane",
      state: "QLD",
      postcode: "4000",
    },
    { line1: "321 Elm St", suburb: "Perth", state: "WA", postcode: "6000" },
    {
      line1: "654 Maple Dr",
      suburb: "Adelaide",
      state: "SA",
      postcode: "5000",
    },
    { line1: "987 Cedar Ln", suburb: "Hobart", state: "TAS", postcode: "7000" },
  ];

  console.log("Creating realistic delivery orders...");

  // Create orders for today with different statuses
  const todayOrders = [
    { status: "Processing", count: 3, hour: 10 },
    { status: "Packed", count: 2, hour: 12 },
    { status: "OutForDelivery", count: 4, hour: 14 },
    { status: "Delivered", count: 5, hour: 16 },
  ];

  const orders = []; // Array to store created orders

  for (const orderGroup of todayOrders) {
    for (let i = 0; i < orderGroup.count; i++) {
      const orderTime = new Date(today);
      orderTime.setHours(
        orderGroup.hour + Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 60),
        0,
        0
      );

      const customerName =
        customerNames[Math.floor(Math.random() * customerNames.length)];
      const address = addresses[Math.floor(Math.random() * addresses.length)];

      // Select random products for this order
      const numItems = Math.floor(Math.random() * 3) + 1;
      const selectedProducts = products
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems);

      let totalCents = 0;
      const orderItems = [];

      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = product.priceCents * quantity;
        totalCents += itemTotal;

        orderItems.push({
          productId: product.id,
          nameAtPurchase: product.name,
          priceCents: product.priceCents,
          quantity,
        });
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          id: generateOrderId(),
          userId: customerUser.id,
          deliveryMethod: "Delivery",
          addressLine1: address.line1,
          suburb: address.suburb,
          state: address.state,
          postcode: address.postcode,
          slotStart: orderTime,
          slotEnd: new Date(orderTime.getTime() + 60 * 60 * 1000), // 1 hour later
          status: orderGroup.status,
          totalCents,
          createdAt: orderTime,
        },
      });

      orders.push(order); // Add order to array

      // Create order items
      await prisma.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: order.id,
          ...item,
        })),
      });

      // Update product stock
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQty: {
              decrement: item.quantity,
            },
          },
        });
      }
    }
  }

  // Create orders for yesterday (mostly delivered)
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  for (let i = 0; i < 8; i++) {
    const orderTime = new Date(yesterday);
    orderTime.setHours(
      10 + Math.floor(Math.random() * 8),
      Math.floor(Math.random() * 60),
      0,
      0
    );

    const customerName =
      customerNames[Math.floor(Math.random() * customerNames.length)];
    const address = addresses[Math.floor(Math.random() * addresses.length)];

    // Select random products for this order
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = products
      .sort(() => 0.5 - Math.random())
      .slice(0, numItems);

    let totalCents = 0;
    const orderItems = [];

    for (const product of selectedProducts) {
      const quantity = Math.floor(Math.random() * 3) + 1;
      const itemTotal = product.priceCents * quantity;
      totalCents += itemTotal;

      orderItems.push({
        productId: product.id,
        nameAtPurchase: product.name,
        priceCents: product.priceCents,
        quantity,
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        id: generateOrderId(),
        userId: customerUser.id,
        deliveryMethod: "Delivery",
        addressLine1: address.line1,
        suburb: address.suburb,
        state: address.state,
        postcode: address.postcode,
        slotStart: orderTime,
        slotEnd: new Date(orderTime.getTime() + 60 * 60 * 1000),
        status: "Delivered",
        totalCents,
        createdAt: orderTime,
      },
    });

    // Create order items
    await prisma.orderItem.createMany({
      data: orderItems.map((item) => ({
        orderId: order.id,
        ...item,
      })),
    });

    // Update product stock
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQty: {
            decrement: item.quantity,
          },
        },
      });
    }
  }

  // Create sample FAQs
  console.log("Creating sample FAQs...");
  const faqs = await Promise.all([
    prisma.fAQ.upsert({
      where: { id: "faq-1" },
      update: {},
      create: {
        id: "faq-1",
        question: "How do I track my order?",
        answer:
          "You can track your order by logging into your account and viewing your order history. You will also receive email updates when your order status changes.",
        category: "shipping",
      },
    }),
    prisma.fAQ.upsert({
      where: { id: "faq-2" },
      update: {},
      create: {
        id: "faq-2",
        question: "What payment methods do you accept?",
        answer:
          "We accept credit cards, debit cards, PayPal, and cash on delivery. All online payments are processed securely.",
        category: "payment",
      },
    }),
    prisma.fAQ.upsert({
      where: { id: "faq-3" },
      update: {},
      create: {
        id: "faq-3",
        question: "How do I change my delivery address?",
        answer:
          "You can update your delivery address in your account settings. For existing orders, please contact customer support.",
        category: "account",
      },
    }),
    prisma.fAQ.upsert({
      where: { id: "faq-4" },
      update: {},
      create: {
        id: "faq-4",
        question: "What if a product is out of stock?",
        answer:
          "If a product is out of stock, it will be marked as unavailable on our website. You can sign up for notifications when it becomes available again.",
        category: "products",
      },
    }),
    prisma.fAQ.upsert({
      where: { id: "faq-5" },
      update: {},
      create: {
        id: "faq-5",
        question: "How do I cancel my order?",
        answer:
          "You can cancel your order within 30 minutes of placing it through your account. After that, please contact customer support.",
        category: "general",
      },
    }),
  ]);

  console.log("FAQs created:", faqs.length);

  // Create sample chat sessions
  console.log("Creating sample chat sessions...");
  const chatSession = await prisma.chatSession.create({
    data: {
      userId: customerUser.id,
      subject: "Order delivery question",
      status: "open",
    },
  });

  // Create sample chat messages
  const chatMessages = await Promise.all([
    prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        senderType: "customer",
        senderName: "Alice",
        message: "Hi, I have a question about my order delivery time.",
      },
    }),
    prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        senderType: "staff",
        senderName: "Support Staff",
        message:
          "Hello Alice! I'd be happy to help you with your delivery question. Could you please provide your order number?",
      },
    }),
    prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        senderType: "customer",
        senderName: "Alice",
        message: "My order number is ORD-12345. When can I expect delivery?",
      },
    }),
  ]);

  console.log("Chat session and messages created:", chatMessages.length);

  // Create sample stock history entries
  console.log("Creating sample stock history...");
  const stockHistoryEntries = await Promise.all([
    prisma.stockHistory.create({
      data: {
        productId: products[0].id,
        userId: staffUser.id,
        oldQuantity: 150,
        newQuantity: 120,
        changeType: "admin_update",
        reason: "Initial stock adjustment",
      },
    }),
    prisma.stockHistory.create({
      data: {
        productId: products[1].id,
        userId: null,
        oldQuantity: 100,
        newQuantity: 80,
        changeType: "purchase",
        reason: "Order ORD-12345 - 20 units sold",
      },
    }),
  ]);

  console.log("Stock history entries created:", stockHistoryEntries.length);

  // Create sample order status history
  console.log("Creating sample order status history...");
  const orderStatusHistory = await Promise.all([
    prisma.orderStatusHistory.create({
      data: {
        orderId: orders[0].id,
        status: "Processing",
        notes: "Order created successfully",
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: orders[0].id,
        status: "Confirmed",
        notes: "Order confirmed and payment processed",
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: orders[0].id,
        status: "Packed",
        notes: "Order packed and ready for delivery",
      },
    }),
  ]);

  console.log(
    "Order status history entries created:",
    orderStatusHistory.length
  );

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
