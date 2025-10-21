import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        sku: "APL-001",
        name: "Apple Gala 1kg",
        category: "Fruits",
        priceCents: 450,
        stockQty: 120,
      },
      {
        sku: "MLK-002",
        name: "Milk 2L",
        category: "Dairy",
        priceCents: 390,
        stockQty: 80,
      },
      {
        sku: "BRC-003",
        name: "Brown Rice 5kg",
        category: "Pantry",
        priceCents: 1690,
        stockQty: 40,
      },
      {
        sku: "BAN-004",
        name: "Banana Bunch",
        category: "Fruits",
        priceCents: 250,
        stockQty: 200,
      },
      {
        sku: "BREAD-005",
        name: "Whole Wheat Bread",
        category: "Bakery",
        priceCents: 320,
        stockQty: 60,
      },
      {
        sku: "EGG-006",
        name: "Free Range Eggs 12pk",
        category: "Dairy",
        priceCents: 680,
        stockQty: 50,
      },
      {
        sku: "CHK-007",
        name: "Chicken Breast 1kg",
        category: "Meat",
        priceCents: 1200,
        stockQty: 30,
      },
      {
        sku: "CAR-008",
        name: "Carrots 1kg",
        category: "Vegetables",
        priceCents: 180,
        stockQty: 100,
      },
      {
        sku: "POT-009",
        name: "Potatoes 2kg",
        category: "Vegetables",
        priceCents: 350,
        stockQty: 75,
      },
      {
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
