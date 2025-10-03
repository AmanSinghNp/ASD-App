const { PrismaClient } = require('@prisma/client');

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

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'APL-001' },
      update: {},
      create: {
        sku: 'APL-001',
        name: 'Apple Gala 1kg',
        category: 'Fruits',
        priceCents: 450,
        stockQty: 120,
        imageUrl: '',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'MLK-002' },
      update: {},
      create: {
        sku: 'MLK-002',
        name: 'Milk 2L',
        category: 'Dairy',
        priceCents: 390,
        stockQty: 80,
        imageUrl: '',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'BRC-003' },
      update: {},
      create: {
        sku: 'BRC-003',
        name: 'Brown Rice 5kg',
        category: 'Pantry',
        priceCents: 1690,
        stockQty: 40,
        imageUrl: '',
        isActive: true,
      },
    }),
  ]);

  console.log('Products created:', products);

  // Create cart with items
  const cart = await prisma.cart.upsert({
    where: { 
      id: 'cart_alice_001' 
    },
    update: {},
    create: {
      id: 'cart_alice_001',
      userId: customerUser.id,
      status: 'OPEN',
    },
  });

  // Get the apple product for cart item
  const appleProduct = products.find(p => p.sku === 'APL-001');
  if (appleProduct) {
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: appleProduct.id,
        },
      },
      update: {},
      create: {
        cartId: cart.id,
        productId: appleProduct.id,
        quantity: 2,
      },
    });

    console.log('Cart and cart item created:', { cart, cartItem });
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
