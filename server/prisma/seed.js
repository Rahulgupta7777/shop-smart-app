require('dotenv').config();
const prisma = require('../src/lib/prisma');
const supabase = require('../src/lib/supabase');

const products = [
  // ---------- Tees ----------
  { seed: 101, category: 'Tees', name: 'Sakura Drift Oversized Tee', description: 'Cherry blossom watercolor scatter on a heavyweight oversized tee. Soft hand-feel, garment-dyed.', price: 1299, inStock: false, quantity: 0, prompt: 'white oversized heavyweight cotton tshirt with delicate pink cherry blossom watercolor scatter, product photo, plain background' },
  { seed: 110, category: 'Tees', name: 'Moji Classic Logo Tee White', description: 'The clean minimal one — small Moji wordmark on a heavyweight white tee.', price: 899, quantity: 120, prompt: 'white heavyweight cotton tshirt with tiny minimal coral wordmark logo on chest, clean product photo, plain background' },
  { seed: 113, category: 'Tees', name: 'Tokyo Rain Street Tee', description: 'Rainy Tokyo alley in watercolor — a quiet night in a loud city.', price: 1199, quantity: 55, prompt: 'white oversized tshirt with watercolor illustration of rainy tokyo street at night, anime style, product photo, plain background' },
  { seed: 114, category: 'Tees', name: 'Koi Fish Garden Tee', description: 'Twin koi circling in still water. Ink-style print on off-black cotton.', price: 1199, quantity: 65, prompt: 'black cotton tshirt with ink illustration of two koi fish circling in a pond, minimal japanese style, product photo, plain background' },
  { seed: 115, category: 'Tees', name: 'Hiragana Aiueo Tee', description: 'Hiragana vowels set in bold coral type. A study piece with style.', price: 999, quantity: 80, prompt: 'cream cotton tshirt with large coral hiragana japanese characters printed across chest, product photo, plain background' },
  { seed: 116, category: 'Tees', name: 'Cyber Samurai Tee', description: 'Samurai silhouette lit by cyberpunk neon. Discharge print on charcoal.', price: 1399, inStock: false, quantity: 0, prompt: 'charcoal black tshirt with silhouette of a samurai lit by cyberpunk neon pink and teal, anime style, product photo, plain background' },
  { seed: 117, category: 'Tees', name: 'Cloud Drifter Tee', description: 'Soft cloud scatter across a pastel blue relaxed-fit tee.', price: 899, quantity: 110, prompt: 'pastel sky blue cotton tshirt with soft white cloud illustration pattern, product photo, plain background' },
  { seed: 118, category: 'Tees', name: 'Sakura Typography Tee', description: 'Coral "桜" typography on heavyweight white. Bold and spare.', price: 1099, quantity: 90, prompt: 'white cotton tshirt with large single coral japanese kanji for sakura cherry blossom on front, minimal type design, product photo, plain background' },
  { seed: 119, category: 'Tees', name: 'Ramen Bowl Tee', description: 'Steaming ramen illustration on mustard cotton. Yes, we\'re hungry.', price: 999, quantity: 70, prompt: 'mustard yellow cotton tshirt with cute anime style illustration of a steaming bowl of ramen, product photo, plain background' },
  { seed: 120, category: 'Tees', name: 'Fox Spirit Kitsune Tee', description: 'Nine-tailed fox mask in watercolor. Mystical and quiet.', price: 1299, quantity: 45, prompt: 'black cotton tshirt with watercolor illustration of a kitsune fox spirit mask with coral markings, anime style, product photo, plain background' },
  { seed: 121, category: 'Tees', name: 'Sunflower Field Tee', description: 'Sunflower field in soft watercolor. Summer in a garment.', price: 999, quantity: 85, prompt: 'white cotton tshirt with watercolor illustration of a sunflower field in yellow and green, anime style, product photo, plain background' },
  { seed: 122, category: 'Tees', name: 'Retro Arcade Tee', description: '80s anime arcade energy — CRT scanlines and pixel mecha.', price: 1199, quantity: 60, prompt: 'navy blue cotton tshirt with retro 80s anime arcade game illustration, pixel art mecha and CRT scanlines, product photo, plain background' },

  // ---------- Hoodies ----------
  { seed: 102, category: 'Hoodies', name: 'Neon Alley Hoodie', description: 'Cyberpunk backstreet print in coral and iris. Brushed fleece interior.', price: 2499, quantity: 28, prompt: 'black oversized anime hoodie with cyberpunk neon alley back print, coral and iris neon lights, studio photo, plain background' },
  { seed: 108, category: 'Hoodies', name: '文字 Kanji Hoodie Black', description: 'Signature Moji piece — oversized hoodie in off-black with embroidered 文字 kanji.', price: 2799, inStock: false, quantity: 0, prompt: 'black oversized hoodie with small embroidered japanese kanji characters on chest, minimalist, product photo, plain background' },
  { seed: 123, category: 'Hoodies', name: 'Mountain Peak Hoodie', description: 'Snow-capped mountain range in soft watercolor — on cream fleece.', price: 2299, quantity: 42, prompt: 'cream oversized hoodie with watercolor illustration of snow capped mountain peaks on chest, product photo, plain background' },
  { seed: 124, category: 'Hoodies', name: 'Rainy Tokyo Hoodie', description: 'Full back print of rainy Tokyo alley. Warm, heavyweight.', price: 2599, quantity: 30, prompt: 'black oversized hoodie with full back print of rainy anime tokyo alley scene, product photo, plain background' },
  { seed: 125, category: 'Hoodies', name: 'Full Moon Hoodie', description: 'Single crescent moon, glowing. Minimal and moody.', price: 2399, inStock: false, quantity: 0, prompt: 'charcoal dark grey oversized hoodie with single glowing crescent moon illustration on chest, minimalist anime style, product photo, plain background' },
  { seed: 126, category: 'Hoodies', name: 'Pastoral Fields Hoodie', description: 'Rolling watercolor hills on cream fleece — soft summer energy.', price: 2499, quantity: 35, prompt: 'cream oversized hoodie with pastoral watercolor illustration of rolling green hills and soft clouds, anime style, product photo, plain background' },
  { seed: 127, category: 'Hoodies', name: 'Kanji Minimal Hoodie White', description: 'Clean white hoodie with a tiny kanji chest mark. Understated.', price: 2199, quantity: 55, prompt: 'white oversized hoodie with tiny minimal black kanji character on chest, product photo, plain background' },
  { seed: 128, category: 'Hoodies', name: 'Street Wolf Hoodie', description: 'Stylized wolf silhouette on forest green. Heavyweight fleece.', price: 2699, quantity: 25, prompt: 'forest green oversized hoodie with minimal stylized wolf silhouette back print, anime style, product photo, plain background' },

  // ---------- Customs ----------
  { seed: 103, category: 'Customs', name: 'Katakana Name Custom Tee', description: 'Your name, translated into katakana and printed with care. Made to order in 5–7 days.', price: 1199, quantity: 999, prompt: 'black tshirt with large minimalist katakana japanese letters printed in white, product photo, plain background' },
  { seed: 129, category: 'Customs', name: 'Kanji Name Custom Hoodie', description: 'Your name as a custom kanji selection, embroidered on an oversized hoodie.', price: 2499, quantity: 999, prompt: 'black oversized hoodie with custom embroidered kanji characters on chest, product photo, plain background' },
  { seed: 130, category: 'Customs', name: 'Hiragana Name Custom Tee', description: 'Your name in hiragana, rendered in coral script. Made to order.', price: 1199, quantity: 999, prompt: 'cream tshirt with custom coral hiragana japanese script printed across chest, product photo, plain background' },
  { seed: 131, category: 'Customs', name: 'Anime Portrait Custom Poster', description: 'Upload a photo, get an original anime-style portrait poster in 2–3 days.', price: 899, quantity: 999, prompt: 'custom anime style watercolor portrait illustration poster on cream paper background, studio ghibli inspired' },

  // ---------- Posters ----------
  { seed: 104, category: 'Posters', name: 'Forest Spirit A3 Poster', description: 'A deer made of light, drifting through a watercolor forest. Matte A3 on 200gsm.', price: 599, quantity: 60, prompt: 'anime watercolor poster of a glowing forest spirit deer walking through misty trees, soft pastel colors, ghibli style' },
  { seed: 105, category: 'Posters', name: 'Sunset Mecha Poster', description: 'A towering mecha silhouette against a butter-orange sky. A3, matte finish.', price: 599, quantity: 55, prompt: 'anime poster of towering mecha silhouette against butter orange sunset sky, retro 90s anime style, film grain' },
  { seed: 132, category: 'Posters', name: 'Night Market Poster', description: 'Tokyo night market in watercolor — lanterns, steam, and life.', price: 599, inStock: false, quantity: 0, prompt: 'anime watercolor poster of a bustling tokyo night market with paper lanterns and food stalls, warm glow' },
  { seed: 133, category: 'Posters', name: 'Cherry Blossom Avenue Poster', description: 'An avenue canopy of sakura in full bloom. Soft pastels, matte A3.', price: 649, quantity: 70, prompt: 'anime watercolor poster of a cherry blossom tree lined avenue in full pink bloom, dreamy pastel colors' },
  { seed: 134, category: 'Posters', name: 'Shibuya Crossing Poster', description: 'Rain-slicked Shibuya in anime illustration. A3, matte.', price: 599, quantity: 45, prompt: 'anime illustration poster of rain slicked shibuya crossing at night with neon signs and umbrellas, cinematic' },
  { seed: 135, category: 'Posters', name: 'Dragon Ascending Ink Poster', description: 'A dragon rising through ink-wash clouds. Bold and quiet.', price: 699, quantity: 50, prompt: 'japanese ink wash painting poster of a dragon ascending through clouds, sumi-e style, minimal' },
  { seed: 136, category: 'Posters', name: 'Crescent Moon Cat Poster', description: 'A cat sleeping on a crescent moon. A5 small print.', price: 499, quantity: 90, prompt: 'anime illustration poster of a small black cat sleeping on a crescent moon against a starry night sky, minimal' },
  { seed: 137, category: 'Posters', name: 'Mount Fuji Minimal Poster', description: 'Fuji-san reduced to three soft gradients. A3 matte.', price: 549, quantity: 65, prompt: 'minimal flat illustration poster of mount fuji with soft coral pink gradient sky, japanese minimalist style' },

  // ---------- Stickers ----------
  { seed: 106, category: 'Stickers', name: '90s Anime Sticker Pack (12pc)', description: 'Twelve die-cut vinyl stickers with retro CRT scanlines and film grain.', price: 299, quantity: 300, prompt: 'sheet of twelve retro 90s anime vinyl stickers with CRT scanlines film grain, flat lay product photo, plain background' },
  { seed: 138, category: 'Stickers', name: 'Kanji Sticker Pack (10pc)', description: 'Ten kanji vinyl stickers — moji, sakura, ai, yume, and more.', price: 249, quantity: 400, prompt: 'sheet of ten vinyl stickers of bold japanese kanji characters in coral and black, flat lay product photo, plain background' },
  { seed: 139, category: 'Stickers', name: 'Japanese Food Sticker Pack', description: 'Ramen, sushi, takoyaki, mochi — cute anime-style food stickers.', price: 299, quantity: 250, prompt: 'sheet of kawaii anime style japanese food stickers including ramen sushi takoyaki mochi, flat lay product photo, plain background' },
  { seed: 140, category: 'Stickers', name: 'Weather Mood Sticker Pack', description: 'Rain, cloud, moon, sun — tiny mood stickers for your laptop.', price: 199, quantity: 320, prompt: 'sheet of small minimalist anime style weather stickers including rain clouds sun moon, flat lay product photo, plain background' },
  { seed: 141, category: 'Stickers', name: 'Kawaii Creatures Sticker Pack', description: 'Original cute anime-style creatures. No licensed IP, all Moji originals.', price: 349, quantity: 180, prompt: 'sheet of original cute kawaii anime style creature stickers pastel colors, flat lay product photo, plain background' },

  // ---------- Bottoms ----------
  { seed: 107, category: 'Bottoms', name: 'Cloud Walker Joggers', description: 'Relaxed fit joggers with a subtle all-over cloud pattern. Mid-weight cotton blend.', price: 1699, quantity: 36, prompt: 'cream relaxed fit joggers with subtle all over white cloud pattern, product photo, plain background' },
  { seed: 142, category: 'Bottoms', name: 'Rain Patter Lounge Shorts', description: 'Lightweight lounge shorts with subtle rain droplet pattern.', price: 1099, quantity: 48, prompt: 'charcoal grey lounge shorts with subtle rain droplet pattern, product photo, plain background' },
  { seed: 143, category: 'Bottoms', name: 'Kanji Track Pants', description: 'Black track pants with side kanji embroidery. Tapered fit.', price: 1899, quantity: 32, prompt: 'black tapered track pants with small white kanji embroidery on thigh, product photo, plain background' },
  { seed: 144, category: 'Bottoms', name: 'Sakura Lounge Shorts', description: 'Cream lounge shorts with scattered cherry blossom pattern.', price: 1199, quantity: 55, prompt: 'cream lounge shorts with scattered pink cherry blossom pattern, product photo, plain background' },
  { seed: 145, category: 'Bottoms', name: 'Cyber Grid Joggers', description: 'Dark joggers with neon grid print running down the leg.', price: 1799, quantity: 28, prompt: 'black joggers with subtle cyberpunk neon grid pattern running down the leg, anime style, product photo, plain background' },

  // ---------- Accessories ----------
  { seed: 109, category: 'Accessories', name: 'Anime Eyes Ceramic Mug', description: '350ml ceramic mug with a stylized anime-eyes wrap print. Dishwasher safe.', price: 549, quantity: 80, prompt: 'white ceramic mug with stylized anime eyes wrap illustration, product photo, plain background' },
  { seed: 111, category: 'Accessories', name: 'Rainy Day Tote Bag', description: 'Watercolor street scene in the rain, printed on a 12oz natural canvas tote.', price: 699, inStock: false, quantity: 0, prompt: 'natural canvas tote bag with watercolor painting of rainy tokyo street scene, anime style, product photo' },
  { seed: 112, category: 'Accessories', name: 'Cherry Blossom Enamel Pin', description: 'Hard enamel pin in coral and gold. Rubber backing included.', price: 249, quantity: 150, prompt: 'coral pink and gold hard enamel pin of a single cherry blossom flower, close up product photo, plain cream background' },
  { seed: 146, category: 'Accessories', name: 'Kitsune Fox Enamel Pin', description: 'Nine-tailed fox spirit pin in coral, white, and gold.', price: 299, quantity: 120, prompt: 'coral and white hard enamel pin of a cute nine tailed kitsune fox spirit, close up product photo, plain cream background' },
  { seed: 147, category: 'Accessories', name: 'Moon Phase Pin Set (4pc)', description: 'Four-piece enamel pin set — new moon, crescent, half, full.', price: 499, quantity: 90, prompt: 'four piece enamel pin set showing moon phases in gold and white, close up product photo, plain cream background' },
  { seed: 148, category: 'Accessories', name: '文字 Moji Keychain', description: 'Brass keychain stamped with the 文字 kanji. Small and heavy.', price: 349, quantity: 140, prompt: 'brass keychain with stamped japanese kanji characters, close up product photo, plain cream background' },
  { seed: 149, category: 'Accessories', name: 'Anime Bookmark Set (3pc)', description: 'Three illustrated bookmarks — sakura, koi, and lantern.', price: 299, quantity: 110, prompt: 'three illustrated japanese anime style bookmarks featuring sakura koi fish and paper lantern, flat lay product photo, plain background' },
  { seed: 150, category: 'Accessories', name: 'Sakura Phone Case', description: 'Soft silicone phone case with all-over cherry blossom print.', price: 899, quantity: 75, prompt: 'soft silicone phone case with all over pink cherry blossom pattern on cream background, product photo' },
];

function pollUrl(prompt, seed) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=600&model=flux&nologo=true&seed=${seed}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, maxRetries = 5) {
  let lastErr;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        const wait = 5000 * (attempt + 1);
        process.stdout.write(`(rate-limited, waiting ${wait / 1000}s) `);
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`Pollinations ${res.status}`);
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < maxRetries - 1) {
        await sleep(3000 * (attempt + 1));
      }
    }
  }
  throw lastErr || new Error('Pollinations retry exhausted');
}

async function generateAndUpload(prompt, seed, existingPaths) {
  const existing = existingPaths.find((p) => p.startsWith(`${seed}.`));
  if (existing) {
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(`seeded/${existing}`);
    return { publicUrl, cached: true };
  }

  const res = await fetchWithRetry(pollUrl(prompt, seed));
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const buffer = Buffer.from(await res.arrayBuffer());
  const path = `seeded/${seed}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
  return { publicUrl, cached: false };
}

async function main() {
  if (!supabase) {
    throw new Error('Supabase is not configured — set SUPABASE_URL and SUPABASE_ANON_KEY in server/.env');
  }

  console.log(`Seeding ${products.length} Moji products...`);

  const { data: list } = await supabase.storage
    .from('product-images')
    .list('seeded', { limit: 500 });
  const existingPaths = (list || []).map((f) => f.name);
  console.log(`Found ${existingPaths.length} cached images, will only generate the rest`);
  console.log('');

  await prisma.product.deleteMany();

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const tag = `[${String(i + 1).padStart(2, ' ')}/${products.length}]`;
    process.stdout.write(`${tag} ${product.name}... `);
    try {
      const { publicUrl, cached } = await generateAndUpload(product.prompt, product.seed, existingPaths);
      const { prompt, seed, ...data } = product;
      await prisma.product.create({ data: { ...data, imageUrl: publicUrl } });
      console.log(cached ? 'cached' : 'generated');
      if (!cached) await sleep(1500);
    } catch (err) {
      console.log(`IMAGE FAILED (${err.message}), using placeholder`);
      const { prompt, seed, ...data } = product;
      await prisma.product.create({
        data: {
          ...data,
          imageUrl: `https://placehold.co/600x600/FBF8F3/FF4D6D?text=${encodeURIComponent(product.name)}`,
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
