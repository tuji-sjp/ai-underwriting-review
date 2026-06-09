import React, { useState } from 'react';
import FlowDiagram from './FlowDiagram';
import ImageGallery from './ImageGallery';
import AiResult from './AiResult';
import { branchAiStates, branchNodeStates } from '../../data/mockData';
import type { TaskRow, NodeState } from '../../types';

interface DetailPanelProps {
  row: TaskRow | null;
  onClose: () => void;
  onOpenPreview: (tabId: string, taskId: string, cat: string, idx: number, showOcr: boolean) => void;
}

function buildUnifiedFlowNodeStates(taskId: string): Record<string, string> {
  const states: Record<string, string> = {};
  const branchStates = branchNodeStates[taskId];
  if (!branchStates) {
    const allKeys = ['ecm_claim','ocrClassify_claim','ocrRecognize_claim','desensitize_claim','ecm_ins','ocrClassify_ins','ocrRecognize_ins','desensitize_ins','merge','aiMedical','aiUnderwriting','emScore','complete'];
    for (const k of allKeys) states[k] = 'pending';
    return states;
  }
  for (const bk in branchStates.claim) states[bk] = branchStates.claim[bk];
  for (const bk2 in branchStates.ins) states[bk2] = branchStates.ins[bk2];

  const dc = states['desensitize_claim'];
  const di = states['desensitize_ins'];
  if (dc === 'done' || di === 'done') {
    states.merge = 'done';
  } else if (dc === 'pending' || di === 'pending') {
    states.merge = 'pending';
  } else {
    states.merge = 'error';
  }

  if (states.merge === 'pending') {
    states.aiMedical = 'pending';
    states.aiUnderwriting = 'pending';
    states.emScore = 'pending';
    states.complete = 'pending';
  } else if (states.merge === 'error') {
    states.aiMedical = 'error';
    states.aiUnderwriting = 'error';
    states.emScore = 'error';
    states.complete = 'error';
  } else {
    const aiStates = branchAiStates[taskId] || null;
    if (aiStates) {
      states.aiMedical = aiStates.aiMedical || 'done';
      states.aiUnderwriting = aiStates.aiUnderwriting || 'done';
      states.emScore = aiStates.emScore || 'done';
    } else {
      states.aiMedical = 'done';
      states.aiUnderwriting = 'done';
      states.emScore = 'done';
    }
  }

  if (states.merge === 'done') {
    const allAiDone = states.aiMedical === 'done' && states.aiUnderwriting === 'done' && states.emScore === 'done';
    const anyAiError = states.aiMedical === 'error' || states.aiUnderwriting === 'error' || states.emScore === 'error';
    if (allAiDone) states.complete = 'done';
    else if (anyAiError) states.complete = 'error';
  }

  return states;
}

const UNIFIED_TABS = [
  { key: 'aiMedical', label: 'AI看病历' },
  { key: 'aiUnderwriting', label: 'AI核保评估' },
  { key: 'emScore', label: 'EM值评分' },
];

const COL_TABS: Record<string, { key: string; label: string }[]> = {
  aiMedical: [
    { key: 'claim', label: '理赔影像' },
    { key: 'ins', label: '投保影像' },
    { key: 'ai', label: 'AI结果' },
  ],
  aiUnderwriting: [
    { key: 'claim', label: '理赔影像' },
    { key: 'ins', label: '投保影像' },
    { key: 'middleResult', label: '中间结果' },
    { key: 'conclusionCompare', label: '结论比对' },
  ],
  emScore: [
    { key: 'claim', label: '理赔影像' },
    { key: 'ins', label: '投保影像' },
    { key: 'ai', label: 'AI结果' },
  ],
};

const DetailPanel: React.FC<DetailPanelProps> = ({ row, onClose, onOpenPreview }) => {
  const [activeTab, setActiveTab] = useState('aiMedical');
  const [activeCols, setActiveCols] = useState<Record<string, string>>({
    aiMedical: 'claim',
    aiUnderwriting: 'claim',
    emScore: 'claim',
  });

  if (!row) return null;

  const nodeStates = buildUnifiedFlowNodeStates(row.taskId);

  const handleSwitchTab = (tabId: string) => {
    setActiveTab(tabId);
    setActiveCols(prev => ({ ...prev, [tabId]: 'claim' }));
  };

  const handleSwitchCol = (tabId: string, colKey: string) => {
    setActiveCols(prev => ({ ...prev, [tabId]: colKey }));
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, transition: 'background 0.3s' }}
        onClick={onClose}
      />
      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: 900, height: '100vh', background: '#fff',
        zIndex: 1001, boxShadow: '-8px 0 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>任务ID</div>
              <div style={{ fontSize: 14, fontFamily: 'monospace', color: '#333' }}>{row.taskId}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>被保人客户号</div>
              <div style={{ fontSize: 14, fontFamily: 'monospace', color: '#333' }}>{row.insuredNo}（{row.insuredName}）</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>执行状态</div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', padding: '3px 12px', borderRadius: 16,
                fontSize: 12, fontWeight: 500,
                background: row.status === '完成' ? 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)' : 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
                color: row.status === '完成' ? '#52c41a' : '#ff4d4f',
                border: `1px solid ${row.status === '完成' ? '#b7eb8f' : '#ffccc7'}`,
              }}>{row.status}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, border: 'none', background: '#f5f5f5', cursor: 'pointer',
              fontSize: 18, color: '#999', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ff4d4f'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#999'; }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, background: '#f5f7fa', overflowY: 'auto', padding: 16 }}>
          {/* Flow Diagram */}
          <div style={{
            background: '#fff', borderRadius: 8, marginBottom: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #ebebeb',
            padding: '8px 20px 20px 20px',
          }}>
            <FlowDiagram nodeStates={nodeStates} />
          </div>

          {/* Tab Card */}
          <div style={{
            background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid #ebebeb', padding: 16,
          }}>
            {/* Unified Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #f0f0f0' }}>
              {UNIFIED_TABS.map(tab => (
                <div
                  key={tab.key}
                  onClick={() => handleSwitchTab(tab.key)}
                  style={{
                    padding: '10px 20px', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.key ? 500 : 400,
                    color: activeTab === tab.key ? '#1890ff' : '#666',
                    borderBottom: `2px solid ${activeTab === tab.key ? '#1890ff' : 'transparent'}`,
                    marginBottom: -2, transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.color = '#1890ff'; }}
                  onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.color = '#666'; }}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            {/* Tab Content */}
            {UNIFIED_TABS.map(tab => (
              <div key={tab.key} style={{ display: activeTab === tab.key ? 'block' : 'none' }}>
                <div style={{ display: 'flex', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden', height: 600 }}>
                  {/* Left Col Tab Nav */}
                  <div style={{ width: 110, flexShrink: 0, background: '#fafbfc', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
                    {(COL_TABS[tab.key] || []).map(col => (
                      <div
                        key={col.key}
                        onClick={() => handleSwitchCol(tab.key, col.key)}
                        style={{
                          padding: '14px 16px', fontSize: 13, cursor: 'pointer', textAlign: 'left',
                          borderLeft: `3px solid ${activeCols[tab.key] === col.key ? 'transparent' : 'transparent'}`,
                          color: activeCols[tab.key] === col.key ? '#1890ff' : '#666',
                          background: activeCols[tab.key] === col.key ? '#D6E4FF' : 'transparent',
                          fontWeight: activeCols[tab.key] === col.key ? 500 : 400,
                          transition: 'all 0.2s', userSelect: 'none',
                        }}
                        onMouseEnter={e => {
                          if (activeCols[tab.key] !== col.key) { e.currentTarget.style.color = '#1890ff'; e.currentTarget.style.background = '#f0f5ff'; }
                        }}
                        onMouseLeave={e => {
                          if (activeCols[tab.key] !== col.key) { e.currentTarget.style.color = '#666'; e.currentTarget.style.background = 'transparent'; }
                        }}
                      >
                        {col.label}
                      </div>
                    ))}
                  </div>
                  {/* Right Content */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: 14, height: 554 }}>
                    {(COL_TABS[tab.key] || []).map(col => (
                      <div key={col.key} style={{ display: activeCols[tab.key] === col.key ? 'block' : 'none' }}>
                        {col.key === 'claim' && (
                          <>
                            <ImageGallery imgType="claim" taskId={row.taskId} ecmState={nodeStates['ecm_claim']} tabId={tab.key} sectionType="new" nodeStates={nodeStates} onOpenPreview={onOpenPreview} />
                            {tab.key !== 'aiMedical' && (
                              <ImageGallery imgType="claim" taskId={row.taskId} ecmState={nodeStates['ecm_claim']} tabId={tab.key} sectionType="history" nodeStates={nodeStates} onOpenPreview={onOpenPreview} />
                            )}
                          </>
                        )}
                        {col.key === 'ins' && (
                          <>
                            <ImageGallery imgType="ins" taskId={row.taskId} ecmState={nodeStates['ecm_ins']} tabId={tab.key} sectionType="new" nodeStates={nodeStates} onOpenPreview={onOpenPreview} />
                            {tab.key !== 'aiMedical' && (
                              <ImageGallery imgType="ins" taskId={row.taskId} ecmState={nodeStates['ecm_ins']} tabId={tab.key} sectionType="history" nodeStates={nodeStates} onOpenPreview={onOpenPreview} />
                            )}
                          </>
                        )}
                        {col.key === 'ai' && (
                          <AiResult tabId={tab.key} taskId={row.taskId} nodeState={nodeStates[tab.key]} hideCard={tab.key !== 'aiUnderwriting'} />
                        )}
                        {col.key === 'middleResult' && (
                          <AiResult tabId="aiUnderwriting" taskId={row.taskId} nodeState={nodeStates['aiUnderwriting']} showOnly="middleResult" />
                        )}
                        {col.key === 'conclusionCompare' && (
                          <AiResult tabId="aiUnderwriting" taskId={row.taskId} nodeState={nodeStates['aiUnderwriting']} showOnly="conclusionCompare" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default DetailPanel;
