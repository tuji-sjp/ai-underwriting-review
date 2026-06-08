import React from 'react';
import type { TaskRow } from '../../types';

interface DataTableProps {
  data: TaskRow[];
  finalTaskIds: Set<string>;
  selectedIds: Record<string, boolean>;
  onToggleRow: (taskId: string) => void;
  onToggleAll: () => void;
  onViewDetail: (taskId: string) => void;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onExportSelected: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data, finalTaskIds, selectedIds, onToggleRow, onToggleAll, onViewDetail,
  currentPage, pageSize, totalCount, onPageChange, onPageSizeChange, onExportSelected,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const renderPagination = () => {
    const buttons: React.ReactNode[] = [];
    buttons.push(
      <button
        key="prev"
        className={currentPage <= 1 ? 'disabled' : ''}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        &lt;
      </button>
    );

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    startPage = Math.max(1, endPage - 4);

    if (startPage > 1) {
      buttons.push(<button key="p1" onClick={() => onPageChange(1)}>1</button>);
      if (startPage > 2) buttons.push(<span key="e1" style={{ padding: '0 4px', color: '#999' }}>...</span>);
    }
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={`p${i}`} className={i === currentPage ? 'active' : ''} onClick={() => onPageChange(i)}>
          {i}
        </button>
      );
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) buttons.push(<span key="e2" style={{ padding: '0 4px', color: '#999' }}>...</span>);
      buttons.push(<button key={`p${totalPages}`} onClick={() => onPageChange(totalPages)}>{totalPages}</button>);
    }
    buttons.push(
      <button
        key="next"
        className={currentPage >= totalPages ? 'disabled' : ''}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        &gt;
      </button>
    );
    return buttons;
  };

  return (
    <div className="table-card" style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#fafbfc' }}>
            <tr>
              <th style={{ width: 40, padding: '13px 16px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 500, borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #f0f0f0' }}>
                <input type="checkbox" onClick={onToggleAll} style={{ width: 14, height: 14, cursor: 'pointer' }} />
              </th>
              <th style={thStyle}>任务ID</th>
              <th style={thStyle}>分公司-保单号</th>
              <th style={thStyle}>被保人客户号</th>
              <th style={thStyle}>执行次数</th>
              <th style={thStyle}>自核未过原因</th>
              <th style={thStyle}>执行状态</th>
              <th style={thStyle}>执行时间</th>
              <th style={thStyle}>耗时</th>
              <th style={thStyle}>二次入池</th>
              <th style={{ ...thStyle, borderRight: 'none' }}>AI审核流程</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => {
              const statusClass = row.status === '完成' ? 'tag-success' : 'tag-failed';
              const countClass = row.execCount > 1 ? 'blue' : 'green';
              const reasonIcon = row.status === '完成'
                ? <span style={{ color: '#52c41a', fontSize: 14, flexShrink: 0 }}>&#10004;</span>
                : <span style={{ color: '#d9d9d9', fontSize: 14, flexShrink: 0 }}>&#10004;</span>;

              return (
                <tr key={row.taskId} style={{ transition: 'all 0.15s' }}>
                  <td style={{ ...tdStyle, width: 40, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={!!selectedIds[row.taskId]}
                      onClick={() => onToggleRow(row.taskId)}
                      style={{ width: 14, height: 14, cursor: 'pointer' }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{row.taskId}</span>
                    {finalTaskIds.has(row.taskId) && <span className="tag-final" style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', color: '#fff', marginLeft: 4 }}>终</span>}
                  </td>
                  <td style={tdStyle}>{row.branch} - {row.policyNo}</td>
                  <td style={tdStyle}>{row.insuredNo}（{row.insuredName}）</td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 24, height: 24, borderRadius: 6, fontSize: 12,
                      background: countClass === 'green' ? '#f6ffed' : '#e6f7ff',
                      color: countClass === 'green' ? '#52c41a' : '#1890ff',
                      border: `1px solid ${countClass === 'green' ? '#b7eb8f' : '#91d5ff'}`,
                    }}>
                      {row.execCount}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {reasonIcon}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.reason}>{row.reason}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', padding: '3px 12px', borderRadius: 16,
                      fontSize: 12, fontWeight: 500,
                      background: statusClass === 'tag-success'
                        ? 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)'
                        : 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
                      color: statusClass === 'tag-success' ? '#52c41a' : '#ff4d4f',
                      border: `1px solid ${statusClass === 'tag-success' ? '#b7eb8f' : '#ffccc7'}`,
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={tdStyle}>{row.execTime}</td>
                  <td style={tdStyle}>{row.cost !== null ? `${row.cost}s` : '-'}</td>
                  <td style={tdStyle}>{row.rePool ? '是' : '否'}</td>
                  <td style={{ ...tdStyle, borderRight: 'none' }}>
                    <span
                      onClick={() => onViewDetail(row.taskId)}
                      style={{ color: '#1890ff', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#40a9ff'; e.currentTarget.style.transform = 'translateX(1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#1890ff'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                      查看详情
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination-bar" style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', background: '#fafbfc' }}>
        <div className="pagination-left" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="pagination-info" style={{ fontSize: 13, color: '#666' }}>共<span>{totalCount}</span>条数据</span>
          <button className="btn btn-primary" onClick={onExportSelected} style={{ fontSize: 12, padding: '4px 14px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: -2, marginRight: 4 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            结果导出
          </button>
        </div>
        <div className="pagination-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="pagination" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {renderPagination()}
          </div>
          <div className="page-size-select" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 13, outline: 'none' }}
            >
              <option value={10}>10 条/页</option>
              <option value={20}>20 条/页</option>
              <option value={50}>50 条/页</option>
              <option value={100}>100 条/页</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '13px 16px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 500,
  borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #f0f0f0', whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #f0f0f0', color: '#333',
  verticalAlign: 'middle', borderRight: '1px solid #f0f0f0', transition: 'all 0.15s',
};

export default DataTable;
