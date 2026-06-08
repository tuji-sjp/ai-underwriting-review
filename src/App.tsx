import { useState, useMemo, useCallback } from 'react';
import Sidebar from './components/Layout/Sidebar';
import TopTabs from './components/Layout/TopTabs';
import FilterBar, { type FilterValues } from './components/Filter/FilterBar';
import DataTable from './components/Table/DataTable';
import DetailPanel from './pages/DetailPanel/DetailPanel';
import ImagePreview from './components/Modals/ImagePreview';
import ExportModal from './components/Modals/ExportModal';
import { allData, finalTaskIds, TAB_IMAGES_NEW } from './data/mockData';
import type { TaskRow, ImgCategory } from './types';

function buildAllImagesForTask(tabId: string, taskId: string): ImgCategory[] {
  const images = TAB_IMAGES_NEW[tabId]?.[taskId] || {};
  const list: ImgCategory[] = [];
  const IMG_CATEGORIES = ['伤残证明', '出院小结', '诊断证明', '入院记录_住院记录', '其他检查', '住院病案首页', '超声检查报告', '血生化检查', '血凝检查', 'PET-CT检查报告', '视力检查', 'X线检查报告', '乙肝五项', '心电图'];
  for (const cn of IMG_CATEGORIES) {
    const imgCount = images[cn] || 0;
    if (imgCount === 0) continue;
    for (let g = 0; g < imgCount; g++) {
      list.push({ cat: cn, index: g });
    }
  }
  return list;
}

function App() {
  // Filter state
  const [filteredData, setFilteredData] = useState<TaskRow[]>([...allData]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  // Detail panel state
  const [detailRow, setDetailRow] = useState<TaskRow | null>(null);

  // Image preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTabId, setPreviewTabId] = useState('');
  const [previewTaskId, setPreviewTaskId] = useState('');
  const [previewCat, setPreviewCat] = useState('');
  const [previewIdx, setPreviewIdx] = useState(0);
  const [previewShowOcr, setPreviewShowOcr] = useState(true);
  const [previewAllImages, setPreviewAllImages] = useState<ImgCategory[]>([]);

  // Export modal state
  const [exportOpen, setExportOpen] = useState(false);

  const topTabs = [
    { key: 'health', label: '健康类', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
    { key: 'home', label: '首页', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> },
  ];
  const [activeTab, setActiveTab] = useState('health');

  const handleSearch = useCallback((filters: FilterValues) => {
    let result = allData.filter(row => {
      if (filters.taskId && !row.taskId.toLowerCase().includes(filters.taskId.toLowerCase())) return false;
      if (filters.branch && row.branch !== filters.branch) return false;
      if (filters.policyNo && !row.policyNo.toLowerCase().includes(filters.policyNo.toLowerCase())) return false;
      if (filters.custNo && !row.insuredNo.includes(filters.custNo)) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters.reasons.length > 0) {
        const hasReason = filters.reasons.some(r => row.reason.includes(r));
        if (!hasReason) return false;
      }
      if (filters.dateStart && row.execTime.substring(0, 10) < filters.dateStart) return false;
      if (filters.dateEnd && row.execTime.substring(0, 10) > filters.dateEnd) return false;
      if (filters.rePool && !row.rePool) return false;
      return true;
    });
    setFilteredData(result);
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setFilteredData([...allData]);
    setCurrentPage(1);
  }, []);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleToggleRow = useCallback((taskId: string) => {
    setSelectedIds(prev => {
      const next = { ...prev };
      if (next[taskId]) delete next[taskId];
      else next[taskId] = true;
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    const pageIds = pagedData.map(r => r.taskId);
    const allPageChecked = pageIds.every(id => selectedIds[id]);
    setSelectedIds(prev => {
      const next = { ...prev };
      if (allPageChecked && pageIds.length > 0) {
        for (const id of pageIds) delete next[id];
      } else {
        for (const id of pageIds) next[id] = true;
      }
      return next;
    });
  }, [pagedData, selectedIds]);

  const handleViewDetail = useCallback((taskId: string) => {
    const row = allData.find(r => r.taskId === taskId);
    if (row) setDetailRow(row);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailRow(null);
  }, []);

  const handleOpenPreview = useCallback((tabId: string, taskId: string, cat: string, idx: number, showOcr: boolean) => {
    setPreviewTabId(tabId);
    setPreviewTaskId(taskId);
    setPreviewCat(cat);
    setPreviewShowOcr(showOcr);
    setPreviewAllImages(buildAllImagesForTask(tabId, taskId));
    // Find the index in the full list
    const allImages = buildAllImagesForTask(tabId, taskId);
    for (let i = 0; i < allImages.length; i++) {
      if (allImages[i].cat === cat && allImages[i].index === idx) {
        setPreviewIdx(i);
        break;
      }
    }
    setPreviewOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewOpen(false);
    setPreviewAllImages([]);
  }, []);

  const handlePreviewNav = useCallback((dir: -1 | 1) => {
    if (previewAllImages.length === 0) return;
    let newIndex = previewIdx + dir;
    if (newIndex < 0) newIndex = previewAllImages.length - 1;
    if (newIndex >= previewAllImages.length) newIndex = 0;
    setPreviewIdx(newIndex);
    setPreviewCat(previewAllImages[newIndex].cat);
  }, [previewIdx, previewAllImages]);

  const handleExportSelected = useCallback(() => {
    const selectedIdsKeys = Object.keys(selectedIds);
    if (selectedIdsKeys.length === 0) {
      alert('请先勾选需要导出的任务行');
      return;
    }
    const selectedRows = filteredData.filter(r => selectedIdsKeys.includes(r.taskId));
    setExportOpen(true);
  }, [selectedIds, filteredData]);

  const handleExport = useCallback(() => {
    const selectedIdsKeys = Object.keys(selectedIds);
    const selectedRows = filteredData.filter(r => selectedIdsKeys.includes(r.taskId));
    let summary = '【导出结果（模拟）】\n';
    summary += `已选 ${selectedRows.length} 条任务：\n`;
    const fields = [
      { key: 'taskId', label: '任务ID' },
      { key: 'branch', label: '分公司' },
      { key: 'policyNo', label: '保单号' },
      { key: 'insuredNo', label: '被保人客户号' },
      { key: 'insuredName', label: '被保人姓名' },
      { key: 'execCount', label: '执行次数' },
      { key: 'reason', label: '自核未过原因' },
      { key: 'status', label: '执行状态' },
      { key: 'execTime', label: '执行时间' },
      { key: 'cost', label: '耗时' },
      { key: 'rePool', label: '二次入池' },
    ];
    for (const row of selectedRows) {
      summary += `\n--- ${row.taskId} ---\n`;
      for (const field of fields) {
        let val = row[field.key as keyof TaskRow];
        if (field.key === 'rePool') val = (val as boolean) ? '是' : '否';
        if (field.key === 'cost') val = (val as number) !== null ? `${val}s` : '-';
        if (val === null || val === undefined) val = '空';
        summary += `  ${field.label}：${val}\n`;
      }
    }
    summary += '\n（实际导出将生成 CSV 文件）';
    alert(summary);
    setExportOpen(false);
  }, [selectedIds, filteredData]);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: 200, minHeight: '100vh', background: '#f5f7fa', flex: 1 }}>
        <TopTabs tabs={topTabs} activeKey={activeTab} onTabClick={setActiveTab} />
        <div style={{ padding: '20px 24px' }}>
          <FilterBar onSearch={handleSearch} onReset={handleReset} />
          <DataTable
            data={pagedData}
            finalTaskIds={finalTaskIds}
            selectedIds={selectedIds}
            onToggleRow={handleToggleRow}
            onToggleAll={handleToggleAll}
            onViewDetail={handleViewDetail}
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={filteredData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            onExportSelected={handleExportSelected}
          />
        </div>
      </div>

      {detailRow && (
        <DetailPanel
          row={detailRow}
          onClose={handleCloseDetail}
          onOpenPreview={handleOpenPreview}
        />
      )}

      <ImagePreview
        open={previewOpen}
        tabId={previewTabId}
        taskId={previewTaskId}
        cat={previewCat}
        idx={previewIdx}
        showOcr={previewShowOcr}
        allImages={previewAllImages}
        onClose={handleClosePreview}
        onNav={handlePreviewNav}
      />

      <ExportModal
        open={exportOpen}
        selectedRows={filteredData.filter(r => selectedIds[r.taskId])}
        onClose={() => setExportOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}

export default App;
