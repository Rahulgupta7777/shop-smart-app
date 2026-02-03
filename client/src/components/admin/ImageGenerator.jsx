import { useState } from 'react';
import toast from 'react-hot-toast';
import { generateImage } from '../../api/images';

const STYLES = [
  { id: 'soft-anime', label: 'Soft Anime' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'watercolor', label: 'Watercolor' },
  { id: 'retro-90s', label: 'Retro 90s' },
  { id: 'minimal', label: 'Minimal' },
];

function ImageGenerator({ onGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('soft-anime');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Describe the image first');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Generating image...');
    try {
      const { imageUrl } = await generateImage({ prompt: prompt.trim(), style });
      setPreview(imageUrl);
      onGenerated(imageUrl);
      toast.success('Image ready', { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="style-pills">
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`style-pill ${style === s.id ? 'active' : ''}`}
            onClick={() => setStyle(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="image-gen-row">
        <input
          type="text"
          className="search-input"
          placeholder="Describe the image — e.g. 'cherry blossom raining in a tokyo alley'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {loading && (
        <div className="gen-loading">
          <span className="spinner" />
          Summoning image — takes ~5–10s
        </div>
      )}

      {preview && !loading && (
        <div className="image-preview">
          <img src={preview} alt="Generated preview" />
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
