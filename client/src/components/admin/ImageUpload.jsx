import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../api/images';

function ImageUpload({ onUploaded }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error('File too large (max 8 MB)');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Uploading image...');
    try {
      const { imageUrl } = await uploadImage(file);
      setPreview(imageUrl);
      onUploaded(imageUrl);
      toast.success('Uploaded', { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="upload-label">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="upload-input"
          onChange={handleFile}
          disabled={loading}
        />
        {loading ? 'Uploading...' : 'Choose file'}
      </label>

      {loading && (
        <div className="gen-loading">
          <span className="spinner" />
          Uploading...
        </div>
      )}

      {preview && !loading && (
        <div className="image-preview">
          <img src={preview} alt="Uploaded preview" />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
