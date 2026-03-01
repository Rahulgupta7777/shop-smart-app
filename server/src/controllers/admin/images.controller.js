const supabase = require('../../lib/supabase');

const STYLE_PRESETS = {
  'soft-anime': 'soft pastel anime style, gentle watercolor, studio ghibli inspired',
  'cyberpunk': 'cyberpunk anime style, neon lights, dark alley, vibrant pinks and cyans',
  'watercolor': 'watercolor anime illustration, ink wash, delicate brushstrokes',
  'retro-90s': '90s retro anime aesthetic, CRT vibes, film grain, VHS look',
  'minimal': 'minimal anime line art, clean vector, single accent color',
};

async function generateWithPollinations(prompt) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Date.now()}&model=flux&nologo=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations returned ${res.status}`);
  return {
    buffer: Buffer.from(await res.arrayBuffer()),
    ext: 'png',
    contentType: 'image/png',
  };
}

async function generateWithReplicate(prompt) {
  const Replicate = require('replicate');
  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
  const output = await replicate.run('black-forest-labs/flux-schnell', {
    input: { prompt, num_outputs: 1, aspect_ratio: '1:1', output_format: 'webp' },
  });
  const imageUrl = Array.isArray(output) ? output[0] : output;
  const imageRes = await fetch(imageUrl);
  return {
    buffer: Buffer.from(await imageRes.arrayBuffer()),
    ext: 'webp',
    contentType: 'image/webp',
  };
}

async function generate(req, res, next) {
  try {
    const { prompt, style } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
    if (!supabase) {
      return res.status(503).json({ error: 'Storage not configured (SUPABASE_URL / SUPABASE_ANON_KEY missing)' });
    }

    const provider = (process.env.IMAGE_PROVIDER || 'pollinations').toLowerCase();
    const styleHint = STYLE_PRESETS[style] || STYLE_PRESETS['soft-anime'];
    const enhancedPrompt = `${styleHint}, ${prompt}, product photo, clean background, high quality`;

    let result;
    if (provider === 'replicate') {
      if (!process.env.REPLICATE_API_TOKEN) {
        return res.status(503).json({ error: 'REPLICATE_API_TOKEN missing' });
      }
      result = await generateWithReplicate(enhancedPrompt);
    } else {
      result = await generateWithPollinations(enhancedPrompt);
    }

    const path = `generated/${Date.now()}.${result.ext}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, result.buffer, { contentType: result.contentType });
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
    res.json({ imageUrl: publicUrl, provider });
  } catch (err) {
    next(err);
  }
}

async function upload(req, res, next) {
  try {
    const { image, filename } = req.body;
    if (!image) return res.status(400).json({ error: 'Image required' });
    if (!supabase) {
      return res.status(503).json({ error: 'Storage not configured (SUPABASE_URL / SUPABASE_ANON_KEY missing)' });
    }

    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    const mime = match ? match[1] : 'image/png';
    const base64 = match ? match[2] : image;
    const buffer = Buffer.from(base64, 'base64');

    const ext = filename?.split('.').pop() || mime.split('/')[1] || 'png';
    const path = `uploads/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, buffer, { contentType: mime });
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
    res.json({ imageUrl: publicUrl });
  } catch (err) {
    next(err);
  }
}

module.exports = { generate, upload };
