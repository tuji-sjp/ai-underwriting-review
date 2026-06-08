import React from 'react';
import { OCR_TEXTS, TAB_IMAGES_NEW, IMG_CATEGORIES } from '../../data/mockData';

interface ImagePreviewProps {
  open: boolean;
  tabId: string;
  taskId: string;
  cat: string;
  idx: number;
  showOcr: boolean;
  allImages: { cat: string; index: number }[];
  onClose: () => void;
  onNav: (dir: -1 | 1) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  open, tabId, taskId, cat, idx, showOcr, allImages, onClose, onNav,
}) => {
  if (!open) return null;

  const total = allImages.length;
  const texts = OCR_TEXTS[cat] || [];
  const text = texts[idx % texts.length] || 'OCR识别结果加载中...';

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ position: 'relative', background: '#fff', borderRadius: 16, overflow: 'hidden', maxWidth: '80vw', maxHeight: '80vh', boxShadow: '0 16px 48px rgba(0,0,0,0.3)', width: 960 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>{cat}</span>
            <span style={{ fontSize: 12, color: '#999', marginLeft: 12 }}>{idx + 1} / {total}</span>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: 18, color: '#999', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ff4d4f'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#999'; }}
          >
            ×
          </button>
        </div>
        <div style={{ display: 'flex', flex: 1, minHeight: 480 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRight: '1px solid #f0f0f0', position: 'relative' }}>
            <button
              onClick={() => onNav(-1)}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', border: '1px solid #d9d9d9', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 14, zIndex: 1 }}
            >
              ‹
            </button>
            <div style={{ width: 400, height: 450, background: '#f0f5ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d9d9d9', fontSize: 16, fontFamily: 'monospace', position: 'relative' }}>
              <span style={{ position: 'absolute', fontSize: 20, color: 'rgba(0,0,0,0.06)' }}>sujp05</span>
            </div>
            <button
              onClick={() => onNav(1)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', border: '1px solid #d9d9d9', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 14, zIndex: 1 }}
            >
              ›
            </button>
          </div>
          {showOcr && (
            <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', fontSize: 13, color: '#333', lineHeight: 1.8 }}>
              <p>{text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
