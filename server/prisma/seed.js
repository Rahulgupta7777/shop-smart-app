const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Noise-cancelling over-ear headphones with 30hr battery life',
    price: 79.99,
    category: 'Electronics',
    inStock: true,
    quantity: 50,
    imageUrl: 'https://via.placeholder.com/300x300?text=Headphones',
  },
  {
    name: 'Organic Green Tea',
    description: 'Premium Japanese matcha green tea, 100 bags',
    price: 12.99,
    category: 'Groceries',
    inStock: true,
    quantity: 200,
    imageUrl: 'https://via.placeholder.com/300x300?text=Green+Tea',
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight breathable running shoes for daily training',
    price: 59.99,
    category: 'Sports',
    inStock: true,
    quantity: 30,
    imageUrl: 'https://via.placeholder.com/300x300?text=Shoes',
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated 750ml bottle, keeps drinks cold for 24hrs',
    price: 24.99,
    category: 'Home',
    inStock: true,
    quantity: 100,
    imageUrl: 'https://via.placeholder.com/300x300?text=Bottle',
  },
  {
    name: 'USB-C Charging Cable',
    description: 'Braided 6ft fast-charging cable',
    price: 9.99,
    category: 'Electronics',
    inStock: true,
    quantity: 500,
    imageUrl: 'https://via.placeholder.com/300x300?text=Cable',
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip 6mm thick exercise mat with carrying strap',
    price: 29.99,
    category: 'Sports',
    inStock: false,
    quantity: 0,
    imageUrl: 'https://via.placeholder.com/300x300?text=Yoga+Mat',
  },
];

async function main() {
  console.log('Seeding database...');
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
