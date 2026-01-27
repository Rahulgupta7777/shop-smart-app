const prisma = require('../src/lib/prisma');

const img = (label) =>
  `https://placehold.co/400x400/FBF8F3/FF4D6D?text=${encodeURIComponent(label)}`;

const products = [
  {
    name: 'Sakura Drift Oversized Tee',
    description: 'Cherry blossom watercolor scatter across a heavyweight oversized tee. Soft hand-feel, garment-dyed.',
    price: 34.99,
    category: 'Tees',
    inStock: true,
    quantity: 42,
    imageUrl: img('Sakura Drift'),
  },
  {
    name: 'Neon Alley Hoodie',
    description: 'Cyberpunk backstreet print in coral and iris. Brushed fleece interior.',
    price: 64.99,
    category: 'Hoodies',
    inStock: true,
    quantity: 28,
    imageUrl: img('Neon Alley'),
  },
  {
    name: 'Katakana Name Custom Tee',
    description: 'Your name, translated into katakana and printed with care. Made to order in 5–7 days.',
    price: 29.99,
    category: 'Customs',
    inStock: true,
    quantity: 999,
    imageUrl: img('Katakana Custom'),
  },
  {
    name: 'Forest Spirit A3 Poster',
    description: 'A deer made of light, drifting through a watercolor forest. Matte A3 print on 200gsm.',
    price: 18.99,
    category: 'Posters',
    inStock: true,
    quantity: 60,
    imageUrl: img('Forest Spirit'),
  },
  {
    name: 'Sunset Mecha Poster',
    description: 'A towering mecha silhouette against a butter-orange sky. A3, matte finish.',
    price: 18.99,
    category: 'Posters',
    inStock: true,
    quantity: 55,
    imageUrl: img('Sunset Mecha'),
  },
  {
    name: '90s Anime Sticker Pack (12pc)',
    description: 'Twelve die-cut vinyl stickers with retro CRT scanlines and film grain.',
    price: 8.99,
    category: 'Stickers',
    inStock: true,
    quantity: 300,
    imageUrl: img('90s Sticker Pack'),
  },
  {
    name: 'Cloud Walker Joggers',
    description: 'Relaxed fit joggers with a subtle all-over cloud pattern. Mid-weight cotton blend.',
    price: 44.99,
    category: 'Bottoms',
    inStock: true,
    quantity: 36,
    imageUrl: img('Cloud Walker'),
  },
  {
    name: '文字 Kanji Hoodie Black',
    description: 'Signature Moji piece — oversized hoodie in off-black with embroidered 文字 kanji.',
    price: 69.99,
    category: 'Hoodies',
    inStock: true,
    quantity: 22,
    imageUrl: img('Moji Kanji Hoodie'),
  },
  {
    name: 'Anime Eyes Ceramic Mug',
    description: '350ml ceramic mug with a stylized anime-eyes wrap print. Dishwasher safe.',
    price: 14.99,
    category: 'Accessories',
    inStock: true,
    quantity: 80,
    imageUrl: img('Anime Eyes Mug'),
  },
  {
    name: 'Moji Classic Logo Tee White',
    description: 'The clean minimal one — small Moji wordmark on a heavyweight white tee.',
    price: 24.99,
    category: 'Tees',
    inStock: true,
    quantity: 120,
    imageUrl: img('Moji Classic Tee'),
  },
  {
    name: 'Rainy Day Tote Bag',
    description: 'Watercolor street scene in the rain, printed on a 12oz natural canvas tote.',
    price: 19.99,
    category: 'Accessories',
    inStock: false,
    quantity: 0,
    imageUrl: img('Rainy Day Tote'),
  },
  {
    name: 'Cherry Blossom Enamel Pin',
    description: 'Hard enamel pin in coral and gold. Rubber backing included.',
    price: 6.99,
    category: 'Accessories',
    inStock: true,
    quantity: 150,
    imageUrl: img('Cherry Blossom Pin'),
  },
];

async function main() {
  console.log('Seeding Moji products...');
  await prisma.product.deleteMany();
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
