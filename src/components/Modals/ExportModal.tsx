import React from 'react';
import type { TaskRow } from '../../types';

interface ExportModalProps {
  open: boolean;
  selectedRows: TaskRow[];
  onClose: () => void;
  onExport: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, selectedRows, onClose, onExport }) => {
  if (!open) return null;

  return (
    <div
      className="export-overlay"
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.45)', zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        className="export-modal"
        style={{
          background: '#fff', borderRadius: 12, width: 700, maxHeight: '80vh',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="export-modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#333' }}>结果导出</h3>
          <button
            className="export-modal-close"
            onClick={onClose}
            style={{
              width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 18, color: '#999', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#333'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#999'; }}
          >
            ×
          </button>
        </div>
        <div className="export-modal-body" style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ marginBottom: 12, fontSize: 13, color: '#666' }}>
            选择需要导出的字段及对应值，未勾选的字段将不会出现在导出结果中。
          </div>
          <div style={{ fontSize: 13, color: '#333', lineHeight: 1.8 }}>
            已勾选 <strong>{selectedRows.length}</strong> 条任务
          </div>
        </div>
        <div className="export-modal-footer" style={{ padding: '12px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <span className="export-selected-count" id="exportSelectedCount" style={{ fontSize: 12, color: '#999', marginLeft: 'auto', marginRight: 12, alignSelf: 'center' }}>
            已选 {selectedRows.length} 条
          </span>
          <button className="btn" onClick={onClose}>取消</button>
          <button className="btn btn-primary" onClick={onExport}>导出</button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
