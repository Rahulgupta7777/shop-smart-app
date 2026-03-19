require('dotenv').config();
const prisma = require('../src/lib/prisma');
const supabase = require('../src/lib/supabase');

const products = [
  {
    name: 'Sakura Drift Oversized Tee',
    description: 'Cherry blossom watercolor scatter across a heavyweight oversized tee. Soft hand-feel, garment-dyed.',
    price: 1299,
    category: 'Tees',
    inStock: true,
    quantity: 42,
    prompt: 'white oversized heavyweight cotton tshirt with delicate pink cherry blossom watercolor scatter, studio product photo, plain background',
    seed: 101,
  },
  {
    name: 'Neon Alley Hoodie',
    description: 'Cyberpunk backstreet print in coral and iris. Brushed fleece interior.',
    price: 2499,
    category: 'Hoodies',
    inStock: true,
    quantity: 28,
    prompt: 'black oversized anime hoodie with cyberpunk neon alley back print, coral and iris neon lights, studio photo, plain background',
    seed: 102,
  },
  {
    name: 'Katakana Name Custom Tee',
    description: 'Your name, translated into katakana and printed with care. Made to order in 5–7 days.',
    price: 1199,
    category: 'Customs',
    inStock: true,
    quantity: 999,
    prompt: 'black tshirt with large minimalist katakana japanese letters printed in white, product photo, plain background',
    seed: 103,
  },
  {
    name: 'Forest Spirit A3 Poster',
    description: 'A deer made of light, drifting through a watercolor forest. Matte A3 print on 200gsm.',
    price: 599,
    category: 'Posters',
    inStock: true,
    quantity: 60,
    prompt: 'anime watercolor poster of a glowing forest spirit deer walking through misty trees, soft pastel colors, ghibli style',
    seed: 104,
  },
  {
    name: 'Sunset Mecha Poster',
    description: 'A towering mecha silhouette against a butter-orange sky. A3, matte finish.',
    price: 599,
    category: 'Posters',
    inStock: true,
    quantity: 55,
    prompt: 'anime poster of towering mecha silhouette against butter orange sunset sky, retro 90s anime style, film grain',
    seed: 105,
  },
  {
    name: '90s Anime Sticker Pack (12pc)',
    description: 'Twelve die-cut vinyl stickers with retro CRT scanlines and film grain.',
    price: 299,
    category: 'Stickers',
    inStock: true,
    quantity: 300,
    prompt: 'sheet of twelve retro 90s anime vinyl stickers with CRT scanlines film grain, flat lay product photo, plain background',
    seed: 106,
  },
  {
    name: 'Cloud Walker Joggers',
    description: 'Relaxed fit joggers with a subtle all-over cloud pattern. Mid-weight cotton blend.',
    price: 1699,
    category: 'Bottoms',
    inStock: true,
    quantity: 36,
    prompt: 'cream relaxed fit joggers with subtle all over white cloud pattern, product photo, plain background',
    seed: 107,
  },
  {
    name: '文字 Kanji Hoodie Black',
    description: 'Signature Moji piece — oversized hoodie in off-black with embroidered 文字 kanji.',
    price: 2799,
    category: 'Hoodies',
    inStock: true,
    quantity: 22,
    prompt: 'black oversized hoodie with small embroidered japanese kanji characters on chest, minimalist, product photo, plain background',
    seed: 108,
  },
  {
    name: 'Anime Eyes Ceramic Mug',
    description: '350ml ceramic mug with a stylized anime-eyes wrap print. Dishwasher safe.',
    price: 549,
    category: 'Accessories',
    inStock: true,
    quantity: 80,
    prompt: 'white ceramic mug with stylized anime eyes wrap illustration, product photo, plain background',
    seed: 109,
  },
  {
    name: 'Moji Classic Logo Tee White',
    description: 'The clean minimal one — small Moji wordmark on a heavyweight white tee.',
    price: 899,
    category: 'Tees',
    inStock: true,
    quantity: 120,
    prompt: 'white heavyweight cotton tshirt with tiny minimal coral wordmark logo on chest, clean product photo, plain background',
    seed: 110,
  },
  {
    name: 'Rainy Day Tote Bag',
    description: 'Watercolor street scene in the rain, printed on a 12oz natural canvas tote.',
    price: 699,
    category: 'Accessories',
    inStock: false,
    quantity: 0,
    prompt: 'natural canvas tote bag with watercolor painting of rainy tokyo street scene, anime style, product photo',
    seed: 111,
  },
  {
    name: 'Cherry Blossom Enamel Pin',
    description: 'Hard enamel pin in coral and gold. Rubber backing included.',
    price: 249,
    category: 'Accessories',
    inStock: true,
    quantity: 150,
    prompt: 'coral pink and gold hard enamel pin of a single cherry blossom flower, close up product photo, plain cream background',
    seed: 112,
  },
];

async function generateAndUpload(prompt, seed) {
  const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=600&model=flux&nologo=true&seed=${seed}`;

  const res = await fetch(pollUrl);
  if (!res.ok) throw new Error(`Pollinations returned ${res.status}`);

  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const buffer = Buffer.from(await res.arrayBuffer());

  const path = `seeded/${seed}.${ext}`;
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
  return publicUrl;
}

async function main() {
  if (!supabase) {
    throw new Error('Supabase is not configured — set SUPABASE_URL and SUPABASE_ANON_KEY in server/.env');
  }

  console.log('Seeding Moji products with real product images...');
  console.log('(Pollinations image generation takes ~5-10s per product — total ~2 min)');
  console.log('');

  await prisma.product.deleteMany();

  let i = 0;
  for (const product of products) {
    i++;
    process.stdout.write(`[${i}/${products.length}] ${product.name}... `);
    try {
      const imageUrl = await generateAndUpload(product.prompt, product.seed);
      const { prompt, seed, ...data } = product;
      await prisma.product.create({ data: { ...data, imageUrl } });
      console.log('done');
    } catch (err) {
      console.log(`IMAGE FAILED (${err.message}), seeding with placeholder`);
      const { prompt, seed, ...data } = product;
      await prisma.product.create({
        data: {
          ...data,
          imageUrl: `https://placehold.co/600x600/FBF8F3/FF4D6D?text=${encodeURIComponent(data.name)}`,
        },
      });
    }
  }

  console.log('');
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
