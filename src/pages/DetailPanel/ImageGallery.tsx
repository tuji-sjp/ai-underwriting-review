import React, { useState } from 'react';
import { IMG_CATEGORIES, TAB_IMAGES_NEW, TAB_IMAGES_HISTORY } from '../../data/mockData';
import type { ImgCategory } from '../../types';

// 标题组件：首个无分隔线，其余有上分隔线
const SectionTitle: React.FC<{ label: string; isFirst?: boolean }> = ({ label, isFirst }) => (
  <div style={{ ...(isFirst ? {} : { paddingTop: 8, borderTop: '1px solid #e8e8e8' }), marginBottom: 8 }}>
    <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{label}</div>
  </div>
);

interface ImageGalleryProps {
  imgType: 'claim' | 'ins';
  taskId: string;
  ecmState: string;
  tabId: string;
  sectionType: 'new' | 'history';
  rePool: boolean;
  nodeStates: Record<string, string>;
  onOpenPreview: (tabId: string, taskId: string, cat: string, idx: number, showOcr: boolean) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  imgType, taskId, ecmState, tabId, sectionType, rePool, nodeStates, onOpenPreview,
}) => {
  const [selectedCat, setSelectedCat] = useState('全部');

  // 新增影像：首个，无分隔线
  if (ecmState === 'error' && sectionType === 'new') {
    return <div style={{ marginBottom: 20 }}><SectionTitle label="• 新增影像" isFirst /><div style={{ color: '#999', fontSize: 13 }}>获取影像节点执行失败</div></div>;
  }
  if (ecmState === 'pending' && sectionType === 'new') {
    return <div style={{ marginBottom: 20 }}><SectionTitle label="• 新增影像" isFirst /><div style={{ color: '#999', fontSize: 13 }}>获取影像节点尚未执行，暂无数据</div></div>;
  }

  // 历史影像 / 异常 / 暂无：有分隔线
  if (ecmState === 'error' && sectionType === 'history') {
    return <div style={{ paddingTop: 8, borderTop: '1px solid #e8e8e8', marginBottom: 20 }}><div style={{ marginBottom: 8 }}><div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>• 历史影像</div></div><div style={{ color: '#999', fontSize: 13 }}>获取影像节点执行失败</div></div>;
  }
  if (ecmState === 'pending' && sectionType === 'history') {
    return <div style={{ paddingTop: 8, borderTop: '1px solid #e8e8e8', marginBottom: 20 }}><div style={{ marginBottom: 8 }}><div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>• 历史影像</div></div><div style={{ color: '#999', fontSize: 13 }}>获取影像节点尚未执行，暂无数据</div></div>;
  }

  // AI核保评估、EM值评分 tab 的历史影像：二次入池为"否"时显示暂无影像
  if (sectionType === 'history' && (tabId === 'aiUnderwriting' || tabId === 'emScore') && rePool === false) {
    return <div style={{ paddingTop: 8, borderTop: '1px solid #e8e8e8', marginBottom: 20 }}><div style={{ marginBottom: 8 }}><div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>• 历史影像</div></div><div style={{ color: '#999', fontSize: 13 }}>暂无影像</div></div>;
  }

  const ocrClassifyKey = imgType === 'claim' ? 'ocrClassify_claim' : 'ocrClassify_ins';
  const ocrRecognizeKey = imgType === 'claim' ? 'ocrRecognize_claim' : 'ocrRecognize_ins';
  const showOcr = nodeStates[ocrClassifyKey] !== 'error' && nodeStates[ocrRecognizeKey] !== 'error';

  const images = sectionType === 'new'
    ? (TAB_IMAGES_NEW[tabId]?.[taskId] || {})
    : (TAB_IMAGES_HISTORY[tabId]?.[taskId] || {});

  let totalCount = 0;
  for (const k in images) totalCount += images[k];

  const catList = selectedCat === '全部' ? IMG_CATEGORIES : [selectedCat];

  return (
    <div style={{
      ...(sectionType === 'new' ? {} : { paddingTop: 8, borderTop: '1px solid #e8e8e8' }),
      marginBottom: 20,
    }}>
      <SectionTitle label={sectionType === 'new' ? '• 新增影像' : '• 历史影像'} isFirst={sectionType === 'new'} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <span
          className={`img-cat-tag ${selectedCat === '全部' ? 'active' : ''}`}
          onClick={() => setSelectedCat('全部')}
          style={{
            padding: '4px 12px', border: `1px solid ${selectedCat === '全部' ? '#1890ff' : '#d9d9d9'}`,
            borderRadius: 16, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
            background: selectedCat === '全部' ? '#1890ff' : undefined,
            color: selectedCat === '全部' ? '#fff' : '#666',
          }}
        >
          全部（{totalCount}）
        </span>
        {IMG_CATEGORIES.map(cn => {
          const count = images[cn] || 0;
          if (count === 0) return null;
          return (
            <span
              key={cn}
              className={`img-cat-tag ${selectedCat === cn ? 'active' : ''}`}
              onClick={() => setSelectedCat(cn)}
              style={{
                padding: '4px 12px', border: `1px solid ${selectedCat === cn ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: 16, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
                background: selectedCat === cn ? '#1890ff' : undefined,
                color: selectedCat === cn ? '#fff' : '#666',
              }}
            >
              {cn}（{count}）
            </span>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, minHeight: 160 }}>
        {catList.map(cat => {
          const count = images[cat] || 0;
          if (count === 0) return null;
          return Array.from({ length: count }).map((_, g) => (
            <div
              key={`${cat}-${g}`}
              style={{
                flexShrink: 0, width: 140, border: '1px solid #f0f0f0', borderRadius: 10, overflow: 'hidden',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onClick={() => onOpenPreview(tabId, taskId, cat, g, showOcr)}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#1890ff'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#f0f0f0'; }}
            >
              <div style={{
                height: 120,
                background: 'linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <span style={{ position: 'absolute', fontSize: 18, color: 'rgba(0,0,0,0.06)', fontFamily: 'monospace' }}>sujp05</span>
              </div>
              <div style={{ padding: 8, background: '#fafbfc', textAlign: 'center', fontSize: 11, color: '#666' }}>{cat}</div>
            </div>
          ));
        })}
        {totalCount === 0 && <div style={{ flexShrink: 0, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 13 }}>暂无影像</div>}
      </div>
    </div>
  );
};

export default ImageGallery;
