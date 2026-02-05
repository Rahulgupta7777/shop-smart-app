import { useState } from 'react';
import toast from 'react-hot-toast';
import ImageGenerator from '../../components/admin/ImageGenerator';
import ImageUpload from '../../components/admin/ImageUpload';

function AdminImages() {
  const [mode, setMode] = useState('generate');
  const [latest, setLatest] = useState('');

  const copyUrl = () => {
    if (!latest) return;
    navigator.clipboard.writeText(latest);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="admin-images">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Image Studio</h1>
          <p className="admin-page-subtitle">Generate or upload artwork · paste URL into product form</p>
        </div>
      </header>

      <div className="image-tabs" style={{ maxWidth: '420px' }}>
        <button
          type="button"
          className={`image-tab ${mode === 'generate' ? 'active' : ''}`}
          onClick={() => setMode('generate')}
        >
          Generate with AI
        </button>
        <button
          type="button"
          className={`image-tab ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => setMode('upload')}
        >
          Upload
        </button>
      </div>

      <div className="admin-panel">
        {mode === 'generate' ? (
          <ImageGenerator onGenerated={setLatest} />
        ) : (
          <ImageUpload onUploaded={setLatest} />
        )}

        {latest && (
          <div className="image-studio-output">
            <label className="detail-label">Uploaded URL</label>
            <div className="image-studio-url">
              <input type="text" value={latest} readOnly className="search-input" style={{ flex: 1, maxWidth: 'none' }} />
              <button type="button" className="btn btn-neu" onClick={copyUrl}>Copy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminImages;
