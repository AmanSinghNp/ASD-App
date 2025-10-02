import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create users
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      email: 'staff@example.com',
      passwordHash: 'placeholder_hash_for_staff',
      role: 'STAFF',
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      passwordHash: 'placeholder_hash_for_customer',
      role: 'CUSTOMER',
    },
  });

  console.log('Users created:', { staffUser, customerUser });

  // Check if products exist, create 10 if none
  const existingProducts = await prisma.product.count();
  let products = [];

  if (existingProducts === 0) {
    console.log('No products found, creating 10 active products...');
    
    const productData = [
      { sku: 'APL-001', name: 'Apple Gala 1kg', category: 'Fruits', priceCents: 450, stockQty: 120 },
      { sku: 'MLK-002', name: 'Milk 2L', category: 'Dairy', priceCents: 390, stockQty: 80 },
      { sku: 'BRC-003', name: 'Brown Rice 5kg', category: 'Pantry', priceCents: 1690, stockQty: 40 },
      { sku: 'BAN-004', name: 'Banana Bunch', category: 'Fruits', priceCents: 250, stockQty: 200 },
      { sku: 'BREAD-005', name: 'Whole Wheat Bread', category: 'Bakery', priceCents: 320, stockQty: 60 },
      { sku: 'EGG-006', name: 'Free Range Eggs 12pk', category: 'Dairy', priceCents: 680, stockQty: 50 },
      { sku: 'CHK-007', name: 'Chicken Breast 1kg', category: 'Meat', priceCents: 1200, stockQty: 30 },
      { sku: 'CAR-008', name: 'Carrots 1kg', category: 'Vegetables', priceCents: 180, stockQty: 100 },
      { sku: 'POT-009', name: 'Potatoes 2kg', category: 'Vegetables', priceCents: 350, stockQty: 75 },
      { sku: 'ONI-010', name: 'Onions 1kg', category: 'Vegetables', priceCents: 220, stockQty: 90 }
    ];

    products = await Promise.all(
      productData.map(data => 
        prisma.product.create({
          data: {
            ...data,
            imageUrl: '',
            isActive: true
          }
        })
      )
    );
    
    console.log('Created 10 products:', products.length);
  } else {
    products = await prisma.product.findMany();
    console.log('Found existing products:', products.length);
  }

  // Create realistic delivery orders with varied statuses
  const today = new Date();
  const customerNames = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Brown', 'Lisa Davis', 'Tom Anderson', 'Amy Taylor'];
  const addresses = [
    { line1: '123 Main St', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
    { line1: '456 Oak Ave', suburb: 'Melbourne', state: 'VIC', postcode: '3000' },
    { line1: '789 Pine Rd', suburb: 'Brisbane', state: 'QLD', postcode: '4000' },
    { line1: '321 Elm St', suburb: 'Perth', state: 'WA', postcode: '6000' },
    { line1: '654 Maple Dr', suburb: 'Adelaide', state: 'SA', postcode: '5000' },
    { line1: '987 Cedar Ln', suburb: 'Hobart', state: 'TAS', postcode: '7000' }
  ];

  console.log('Creating realistic delivery orders...');

  // Create orders for today with different statuses
  const todayOrders = [
    { status: 'Processing', count: 3, hour: 10 },
    { status: 'Packed', count: 2, hour: 12 },
    { status: 'OutForDelivery', count: 4, hour: 14 },
    { status: 'Delivered', count: 5, hour: 16 }
  ];

  for (const orderGroup of todayOrders) {
    for (let i = 0; i < orderGroup.count; i++) {
      const orderTime = new Date(today);
      orderTime.setHours(orderGroup.hour + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);
      
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
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
          quantity
        });
      }
      
      // Create order
      const order = await prisma.order.create({
        data: {
          userId: customerUser.id,
          deliveryMethod: 'Delivery',
          addressLine1: address.line1,
          suburb: address.suburb,
          state: address.state,
          postcode: address.postcode,
          slotStart: orderTime,
          slotEnd: new Date(orderTime.getTime() + 60 * 60 * 1000), // 1 hour later
          status: orderGroup.status,
          totalCents,
          createdAt: orderTime
        }
      });
      
      // Create order items
      await prisma.orderItem.createMany({
        data: orderItems.map(item => ({
          orderId: order.id,
          ...item
        }))
      });
      
      // Update product stock
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQty: {
              decrement: item.quantity
            }
          }
        });
      }
    }
  }

  // Create orders for yesterday (mostly delivered)
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  for (let i = 0; i < 8; i++) {
    const orderTime = new Date(yesterday);
    orderTime.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
    
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
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
        quantity
      });
    }
    
    // Create order
    const order = await prisma.order.create({
      data: {
        userId: customerUser.id,
        deliveryMethod: 'Delivery',
        addressLine1: address.line1,
        suburb: address.suburb,
        state: address.state,
        postcode: address.postcode,
        slotStart: orderTime,
        slotEnd: new Date(orderTime.getTime() + 60 * 60 * 1000),
        status: 'Delivered',
        totalCents,
        createdAt: orderTime
      }
    });
    
    // Create order items
    await prisma.orderItem.createMany({
      data: orderItems.map(item => ({
        orderId: order.id,
        ...item
      }))
    });
    
    // Update product stock
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQty: {
            decrement: item.quantity
          }
        }
      });
    }
  }


  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
