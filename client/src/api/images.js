const API_URL = import.meta.env.VITE_API_URL || '';

export async function generateImage({ prompt, style }) {
  const res = await fetch(`${API_URL}/api/images/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, style }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate image');
  }
  return res.json();
}

export async function uploadImage(file) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const res = await fetch(`${API_URL}/api/images/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64, filename: file.name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload image');
  }
  return res.json();
}
