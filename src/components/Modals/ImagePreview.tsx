import React, { useState, useMemo, useCallback } from 'react';
import { OCR_TEXTS, OCR_DISEASES, ALIAS_MAPPED_DISEASES, AI_JUDGE_DISEASES } from '../../data/mockData';

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
  const [manualInput, setManualInput] = useState('');
  const [savedDiseases, setSavedDiseases] = useState<string[]>([]);

  const total = allImages.length;
  const texts = OCR_TEXTS[cat] || [];
  const text = texts[idx % texts.length] || 'OCR识别结果加载中...';

  const aiDiseases = useMemo(() => {
    const ocr = OCR_DISEASES[taskId] || [];
    const alias = (ALIAS_MAPPED_DISEASES[taskId] || []).map(m => m.standard);
    const ai = (AI_JUDGE_DISEASES[taskId] || []).map(j => j.aiResult);
    return { ocr, alias, ai };
  }, [taskId]);

  const handleSave = useCallback(() => {
    if (!manualInput.trim()) return;
    const newDiseases = manualInput
      .split(/[、,，]/)
      .map(s => s.trim())
      .filter(Boolean);
    setSavedDiseases(prev => {
      const set = new Set(prev);
      newDiseases.forEach(d => set.add(d));
      return Array.from(set);
    });
    setManualInput('');
  }, [manualInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  if (!open) return null;

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ position: 'relative', background: '#fff', borderRadius: 16, overflow: 'hidden', maxWidth: '92vw', maxHeight: '90vh', boxShadow: '0 16px 48px rgba(0,0,0,0.3)', width: 1280 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Three-column body */}
        <div style={{ display: 'flex', minHeight: 560 }}>
          {/* ===== Left column: Image ===== */}
          <div style={{ flex: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRight: '1px solid #f0f0f0', position: 'relative', minWidth: 0 }}>
            <button
              onClick={() => onNav(-1)}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', border: '1px solid #d9d9d9', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 16, zIndex: 1 }}
            >
              ‹
            </button>
            <div style={{ width: 460, height: 500, background: '#f0f5ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d9d9d9', fontSize: 16, fontFamily: 'monospace', position: 'relative' }}>
              <span style={{ position: 'absolute', fontSize: 20, color: 'rgba(0,0,0,0.06)' }}>sujp05</span>
            </div>
            <button
              onClick={() => onNav(1)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', border: '1px solid #d9d9d9', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 16, zIndex: 1 }}
            >
              ›
            </button>
          </div>

          {/* ===== Middle column: OCR text + Input ===== */}
          <div style={{ flex: 2.5, display: 'flex', flexDirection: 'column', borderRight: '1px solid #f0f0f0', minWidth: 0 }}>
            {/* OCR text area */}
            {showOcr && (
              <div style={{ flex: 1, padding: '16px 16px 8px', overflowY: 'auto', fontSize: 13, color: '#333', lineHeight: 1.8, minHeight: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 6 }}>OCR识别结果：</div>
                <p style={{ margin: 0 }}>{text}</p>
              </div>
            )}
            {/* Input area at bottom */}
            <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #f0f0f0', background: '#fafbfc' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>请输入人工纠正后的疾病：</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder={'多个疾病用顿号"、"分隔'}
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    flex: 1, height: 32, padding: '0 10px', border: '1px solid #d9d9d9',
                    borderRadius: 4, fontSize: 13, outline: 'none', background: '#fff',
                    color: '#333', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1890ff'}
                  onBlur={e => e.target.style.borderColor = '#d9d9d9'}
                />
                <button
                  onClick={handleSave}
                  style={{
                    height: 32, padding: '0 16px', border: '1px solid #1890ff', borderRadius: 4,
                    background: '#1890ff', color: '#fff', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                    lineHeight: 'normal',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#40a9ff'; e.currentTarget.style.borderColor = '#40a9ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1890ff'; e.currentTarget.style.borderColor = '#1890ff'; }}
                >
                  保存
                </button>
              </div>
            </div>
          </div>

          {/* ===== Right column: Disease summaries ===== */}
          <div style={{ flex: 3.5, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Manual corrected diseases */}
            <div style={{ flex: 1, padding: '16px', borderBottom: '1px solid #f0f0f0', overflowY: 'auto', minHeight: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#000', marginBottom: 10 }}>人工纠正疾病-汇总结果：</div>
              <div style={{ fontSize: 13, color: '#333', lineHeight: 1.8 }}>
                {savedDiseases.length > 0 ? savedDiseases.join('、') : <span style={{ color: '#999' }}>暂无数据</span>}
              </div>
            </div>
            {/* AI recognized diseases */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', minHeight: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#000', marginBottom: 10 }}>AI识别疾病-汇总结果：</div>
              <div style={{ fontSize: 13, color: '#333', lineHeight: 1.8 }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 4 }}>• OCR抽取疾病</div>
                  <div>{aiDiseases.ocr.length > 0 ? aiDiseases.ocr.join('、') : <span style={{ color: '#999' }}>暂无数据</span>}</div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 4 }}>• 非别名映射疾病</div>
                  <div>{aiDiseases.alias.length > 0 ? aiDiseases.alias.join('、') : <span style={{ color: '#999' }}>暂无数据</span>}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 4 }}>• AI判断疾病</div>
                  <div>{aiDiseases.ai.length > 0 ? aiDiseases.ai.join('、') : <span style={{ color: '#999' }}>暂无数据</span>}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
