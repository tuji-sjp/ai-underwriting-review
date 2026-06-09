import React, { useState } from 'react';
import { IMG_CATEGORIES, TAB_IMAGES_NEW, TAB_IMAGES_HISTORY } from '../../data/mockData';
import type { ImgCategory } from '../../types';

// 每个 (tabId, sectionType, taskId) 下 0~2 个分类不加 ✅，其余都加
const NO_CHECK: Record<string, Set<string>> = {};

function buildNoCheckKey(tabId: string, sectionType: 'new' | 'history', taskId: string): string {
  return `${tabId}:${sectionType}:${taskId}`;
}

// AI看病历·新增影像
NO_CHECK[buildNoCheckKey('aiMedical', 'new', '69f1cc14498ec0b6e588be81')] = new Set(['出院小结']);
NO_CHECK[buildNoCheckKey('aiMedical', 'new', '69f1cc14498ec0b6e588be80')] = new Set(['入院记录_住院记录']);
NO_CHECK[buildNoCheckKey('aiMedical', 'new', '69f1cc14498ec0b6e588be7e')] = new Set(['诊断证明']);
NO_CHECK[buildNoCheckKey('aiMedical', 'new', '69f1cc14498ec0b6e588be7c')] = new Set(['超声检查报告', '入院记录_住院记录']);
NO_CHECK[buildNoCheckKey('aiMedical', 'new', '69f1cc14498ec0b6e588be79')] = new Set(['出院小结']);
NO_CHECK[buildNoCheckKey('aiMedical', 'new', '69f1cc14498ec0b6e588be82')] = new Set(['诊断证明']);
NO_CHECK[buildNoCheckKey('aiMedical', 'new', 'INS202604010001')] = new Set(['超声检查报告', '入院记录_住院记录']);

// AI核保评估·新增影像
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'new', '69f1cc14498ec0b6e588be81')] = new Set(['血生化检查']);
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'new', '69f1cc14498ec0b6e588be80')] = new Set(['诊断证明']);
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'new', '69f1cc14498ec0b6e588be7e')] = new Set(['其他检查']);
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'new', '69f1cc14498ec0b6e588be7c')] = new Set(['住院病案首页', '血生化检查']);
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'new', '69f1cc14498ec0b6e588be7a')] = new Set(['心电图']);
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'new', '69f1cc14498ec0b6e588be82')] = new Set(['视力检查']);
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'new', 'INS202604010001')] = new Set(['心电图', '血生化检查']);

// EM值评分·新增影像（与AI核保评估一致）
NO_CHECK[buildNoCheckKey('emScore', 'new', '69f1cc14498ec0b6e588be81')] = new Set(['血生化检查']);
NO_CHECK[buildNoCheckKey('emScore', 'new', '69f1cc14498ec0b6e588be80')] = new Set(['诊断证明']);
NO_CHECK[buildNoCheckKey('emScore', 'new', '69f1cc14498ec0b6e588be7e')] = new Set(['其他检查']);
NO_CHECK[buildNoCheckKey('emScore', 'new', '69f1cc14498ec0b6e588be7c')] = new Set(['住院病案首页', '血生化检查']);
NO_CHECK[buildNoCheckKey('emScore', 'new', '69f1cc14498ec0b6e588be7a')] = new Set(['心电图']);
NO_CHECK[buildNoCheckKey('emScore', 'new', '69f1cc14498ec0b6e588be82')] = new Set(['视力检查']);
NO_CHECK[buildNoCheckKey('emScore', 'new', 'INS202604010001')] = new Set(['心电图', '血生化检查']);

// AI核保评估·历史影像
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'history', '69f1cc14498ec0b6e588be81')] = new Set(['入院记录_住院记录']);
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'history', '69f1cc14498ec0b6e588be80')] = new Set(['出院小结']);
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'history', '69f1cc14498ec0b6e588be7c')] = new Set(['血生化检查']);
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'history', '69f1cc14498ec0b6e588be79')] = new Set(['诊断证明']);
NO_CHECK[buildNoCheckKey('aiUnderwriting', 'history', 'INS202604010001')] = new Set(['出院小结', '入院记录_住院记录']);

// EM值评分·历史影像（与AI核保评估一致）
NO_CHECK[buildNoCheckKey('emScore', 'history', '69f1cc14498ec0b6e588be81')] = new Set(['入院记录_住院记录']);
NO_CHECK[buildNoCheckKey('emScore', 'history', '69f1cc14498ec0b6e588be80')] = new Set(['出院小结']);
NO_CHECK[buildNoCheckKey('emScore', 'history', '69f1cc14498ec0b6e588be7c')] = new Set(['血生化检查']);
NO_CHECK[buildNoCheckKey('emScore', 'history', '69f1cc14498ec0b6e588be79')] = new Set(['诊断证明']);
NO_CHECK[buildNoCheckKey('emScore', 'history', 'INS202604010001')] = new Set(['出院小结', '入院记录_住院记录']);

function shouldShowCheck(tabId: string, sectionType: 'new' | 'history', taskId: string, cat: string): boolean {
  const key = buildNoCheckKey(tabId, sectionType, taskId);
  const skip = NO_CHECK[key];
  if (!skip) return true;
  return !skip.has(cat);
}

// 标题组件：首个无分隔线，其余有上分隔线
const SectionTitle: React.FC<{ label: string; isFirst?: boolean }> = ({ label, isFirst }) => (
  <div style={{ ...(isFirst ? {} : { paddingTop: 8, borderTop: '1px solid #e8e8e8' }), marginBottom: 8 }}>
    <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{label}</div>
  </div>
);

// 渲染缩略图卡片
const ThumbnailCard: React.FC<{
  tabId: string; taskId: string; cat: string; idx: number;
  showOcr: boolean; onOpenPreview: (tabId: string, taskId: string, cat: string, idx: number, showOcr: boolean) => void;
}> = ({ tabId, taskId, cat, idx, showOcr, onOpenPreview }) => (
  <div
    style={{
      flexShrink: 0, width: 140, border: '1px solid #f0f0f0', borderRadius: 10, overflow: 'hidden',
      cursor: 'pointer', transition: 'all 0.2s',
    }}
    onClick={() => onOpenPreview(tabId, taskId, cat, idx, showOcr)}
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
);

// 渲染分类标签
const CategoryTags: React.FC<{
  images: Record<string, number>; tabId: string; sectionType: 'new' | 'history'; taskId: string;
  selectedCat: string; onSelectCat: (cat: string) => void;
}> = ({ images, tabId, sectionType, taskId, selectedCat, onSelectCat }) => {
  let totalCount = 0;
  for (const k in images) totalCount += images[k];

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
      <span
        className={`img-cat-tag ${selectedCat === '全部' ? 'active' : ''}`}
        onClick={() => onSelectCat('全部')}
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
        const hasCheck = shouldShowCheck(tabId, sectionType, taskId, cn);
        return (
          <span
            key={cn}
            className={`img-cat-tag ${selectedCat === cn ? 'active' : ''}`}
            onClick={() => onSelectCat(cn)}
            style={{
              padding: '4px 12px', border: `1px solid ${selectedCat === cn ? '#1890ff' : '#d9d9d9'}`,
              borderRadius: 16, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
              background: selectedCat === cn ? '#1890ff' : undefined,
              color: selectedCat === cn ? '#fff' : '#666',
            }}
          >
            {cn}（{count}）{hasCheck && <span style={{ marginLeft: 3, fontSize: 12 }}>✅</span>}
          </span>
        );
      })}
    </div>
  );
};

// 渲染缩略图行（按分类筛选）
const ThumbnailRow: React.FC<{
  images: Record<string, number>; catList: string[]; selectedCat: string;
  tabId: string; taskId: string; showOcr: boolean;
  onOpenPreview: (tabId: string, taskId: string, cat: string, idx: number, showOcr: boolean) => void;
}> = ({ images, catList, selectedCat, tabId, taskId, showOcr, onOpenPreview }) => (
  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, minHeight: 160 }}>
    {catList.map(cat => {
      const count = images[cat] || 0;
      if (count === 0) return null;
      return Array.from({ length: count }).map((_, idx) => (
        <ThumbnailCard key={`${cat}-${idx}`} tabId={tabId} taskId={taskId} cat={cat} idx={idx} showOcr={showOcr} onOpenPreview={onOpenPreview} />
      ));
    })}
  </div>
);

interface ImageGalleryProps {
  imgType: 'claim' | 'ins';
  taskId: string;
  ecmState: string;
  tabId: string;
  sectionType: 'new' | 'history';
  nodeStates: Record<string, string>;
  onOpenPreview: (tabId: string, taskId: string, cat: string, idx: number, showOcr: boolean) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  imgType, taskId, ecmState, tabId, sectionType, nodeStates, onOpenPreview,
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

  const ocrClassifyKey = imgType === 'claim' ? 'ocrClassify_claim' : 'ocrClassify_ins';
  const ocrRecognizeKey = imgType === 'claim' ? 'ocrRecognize_claim' : 'ocrRecognize_ins';
  const showOcr = nodeStates[ocrClassifyKey] !== 'error' && nodeStates[ocrRecognizeKey] !== 'error';

  // ===== 新增影像：扁平结构 =====
  if (sectionType === 'new') {
    const images = TAB_IMAGES_NEW[tabId]?.[taskId] || {};
    let totalCount = 0;
    for (const k in images) totalCount += images[k];
    const catList = selectedCat === '全部' ? IMG_CATEGORIES : [selectedCat];

    return (
      <div style={{ marginBottom: 20 }}>
        <SectionTitle label="• 新增影像" isFirst />
        <CategoryTags images={images} tabId={tabId} sectionType="new" taskId={taskId} selectedCat={selectedCat} onSelectCat={setSelectedCat} />
        <ThumbnailRow images={images} catList={catList} selectedCat={selectedCat} tabId={tabId} taskId={taskId} showOcr={showOcr} onOpenPreview={onOpenPreview} />
      </div>
    );
  }

  // ===== 历史影像：按案件号 / 分公司-保单号分行 =====
  const historyData = TAB_IMAGES_HISTORY[tabId]?.[taskId];
  const groups = historyData ? historyData[imgType] : [];

  if (!groups || groups.length === 0) {
    return (
      <div style={{ paddingTop: 8, borderTop: '1px solid #e8e8e8', marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}><div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>• 历史影像</div></div>
        <div style={{ color: '#999', fontSize: 13 }}>暂无影像</div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 8, borderTop: '1px solid #e8e8e8', marginBottom: 20 }}>
      <div style={{ marginBottom: 8 }}><div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>• 历史影像</div></div>
      {groups.map((group, gIdx) => {
        const catList = selectedCat === '全部' ? IMG_CATEGORIES : [selectedCat];
        // 检查当前选中的分类在该 group 中是否有数据
        if (selectedCat !== '全部' && !(group.images[selectedCat])) return null;

        return (
          <div key={gIdx} style={{ ...(gIdx > 0 ? { paddingTop: 8, borderTop: '1px solid #f0f0f0', marginTop: 12 } : { marginTop: 4 }) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{group.label}</span>
            </div>
            <CategoryTags images={group.images} tabId={tabId} sectionType="history" taskId={taskId} selectedCat={selectedCat} onSelectCat={setSelectedCat} />
            <ThumbnailRow images={group.images} catList={catList} selectedCat={selectedCat} tabId={tabId} taskId={taskId} showOcr={showOcr} onOpenPreview={onOpenPreview} />
          </div>
        );
      })}
    </div>
  );
};

export default ImageGallery;
