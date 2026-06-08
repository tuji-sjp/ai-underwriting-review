import React, { useState, useRef, useEffect, useCallback } from 'react';
import { allData, REASON_OPTIONS } from '../../data/mockData';
import type { TaskRow } from '../../types';

interface FilterProps {
  onSearch: (filters: FilterValues) => void;
  onReset: () => void;
}

export interface FilterValues {
  taskId: string;
  branch: string;
  policyNo: string;
  custNo: string;
  dateStart: string;
  dateEnd: string;
  status: string;
  reasons: string[];
  rePool: boolean;
}

// ===== Custom Date Range Picker =====
const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];
const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const DateRangePicker: React.FC<{
  value: [string, string];
  onChange: (start: string, end: string) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [dpYear, setDpYear] = useState(new Date().getFullYear());
  const [dpMonth, setDpMonth] = useState(new Date().getMonth());
  const [tempStart, setTempStart] = useState(value[0]);
  const [tempEnd, setTempEnd] = useState(value[1]);
  const popupRef = useRef<HTMLDivElement>(null);

  const display = value[0] && value[1] ? `${value[0]} ~ ${value[1]}` :
    value[0] ? `${value[0]} ~ ` : '';

  useEffect(() => {
    if (!open) return;
    setTempStart(value[0]);
    setTempEnd(value[1]);
  }, [open]);

  const navigate = useCallback((delta: number) => {
    let m = dpMonth + delta;
    let y = dpYear;
    while (m > 11) { y++; m -= 12; }
    while (m < 0) { y--; m += 12; }
    setDpYear(y);
    setDpMonth(m);
  }, [dpYear, dpMonth]);

  const handleClickDay = useCallback((dateStr: string) => {
    if (!tempStart || tempEnd) {
      setTempStart(dateStr);
      setTempEnd('');
    } else if (dateStr === tempStart) {
      setTempEnd('');
    } else {
      if (dateStr < tempStart) {
        setTempEnd(tempStart);
        setTempStart(dateStr);
      } else {
        setTempEnd(dateStr);
      }
    }
  }, [tempStart, tempEnd]);

  const confirm = useCallback(() => {
    onChange(tempStart || '', tempEnd || '');
    setOpen(false);
  }, [tempStart, tempEnd, onChange]);

  const cancel = useCallback(() => {
    setOpen(false);
  }, []);

  const renderCalendar = (year: number, month: number) => {
    const rows: React.ReactNode[] = [];
    const firstDay = new Date(year, month, 1);
    let startWeekday = firstDay.getDay();
    startWeekday = startWeekday === 0 ? 6 : startWeekday - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const rowsCount = Math.max(6, Math.ceil((startWeekday + daysInMonth) / 7));

    let day = 1;
    let prevDay = prevDays - startWeekday + 1;

    for (let r = 0; r < rowsCount; r++) {
      const cells: React.ReactNode[] = [];
      for (let c = 0; c < 7; c++) {
        let curDay: number;
        let isCurrentMonth = true;
        let dateStr = '';

        if (r === 0 && c < startWeekday) {
          curDay = prevDay++;
          isCurrentMonth = false;
          const pm = month - 1;
          const py = month === 0 ? year - 1 : year;
          const actualPm = pm < 0 ? 11 : pm;
          dateStr = `${py}-${String(actualPm + 1).padStart(2, '0')}-${String(curDay).padStart(2, '0')}`;
        } else if (day > daysInMonth) {
          curDay = day - daysInMonth;
          isCurrentMonth = false;
          const nm = month + 1;
          const ny = month === 11 ? year + 1 : year;
          const actualNm = nm > 11 ? 0 : nm;
          dateStr = `${ny}-${String(actualNm + 1).padStart(2, '0')}-${String(curDay).padStart(2, '0')}`;
        } else {
          curDay = day++;
          dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(curDay).padStart(2, '0')}`;
        }

        let cls = 'dp-day';
        if (!isCurrentMonth) cls += ' dp-other';
        if (dateStr === todayStr) cls += ' dp-today';
        if (dateStr === tempStart) cls += ' dp-selected-start';
        if (dateStr === tempEnd) cls += ' dp-selected-end';
        if (tempStart && tempEnd && dateStr > tempStart && dateStr < tempEnd) cls += ' dp-in-range';

        cells.push(
          <td
            key={c}
            className={cls}
            data-date={dateStr}
            onMouseDown={e => { e.stopPropagation(); handleClickDay(dateStr); }}
            style={{
              padding: '6px 4px', textAlign: 'center', cursor: isCurrentMonth ? 'pointer' : 'default',
              fontSize: 13, borderRadius: 4, minWidth: 28, userSelect: 'none',
              color: isCurrentMonth ? undefined : 'transparent',
            }}
          >
            {curDay}
          </td>
        );
      }
      rows.push(<tr key={r}>{cells}</tr>);
    }

    return (
      <table style={{ borderCollapse: 'collapse', width: 220 }}>
        <thead>
          <tr>
            {WEEKDAYS.map((d, i) => (
              <th key={i} style={{ padding: '4px 8px', fontSize: 12, fontWeight: 400, color: '#999', textAlign: 'center' }}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const nextMonth = dpMonth + 1 > 11 ? 0 : dpMonth + 1;
  const nextYear = dpMonth + 1 > 11 ? dpYear + 1 : dpYear;

  const rangeText = tempStart && tempEnd ? `${tempStart} ~ ${tempEnd}` :
    tempStart ? `${tempStart} ~ 请选择结束日期` : '请选择日期范围';

  return (
    <div className="date-range-picker" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
      <label style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>执行时间：</label>
      <input
        type="text"
        readOnly
        value={display}
        placeholder="开始日期 → 结束日期"
        onClick={e => { e.stopPropagation(); setOpen(!open); }}
        className="date-input"
        style={{
          width: 240, cursor: 'pointer', paddingRight: 28,
          padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: 6,
          fontSize: 13, outline: 'none', background: '#fff', color: '#333',
          transition: 'all 0.25s',
        }}
        onFocus={e => { e.target.style.borderColor = '#1890ff'; e.target.style.boxShadow = '0 0 0 3px rgba(24,144,255,0.08)'; }}
        onBlur={e => { e.target.style.borderColor = '#d9d9d9'; e.target.style.boxShadow = 'none'; }}
      />
      <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </span>
      {open && (
        <div
          ref={popupRef}
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: -60, background: '#fff',
            borderRadius: 8, padding: 16, zIndex: 9999, boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            minWidth: 540, pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button onClick={e => { e.stopPropagation(); navigate(-12); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, color: '#666', fontSize: 14, lineHeight: 1 }} onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>«</button>
              <button onClick={e => { e.stopPropagation(); navigate(-1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, color: '#666', fontSize: 14, lineHeight: 1 }} onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>‹</button>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#333', padding: '0 8px' }}>{dpYear}年 {MONTH_NAMES[dpMonth]}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#333', padding: '0 8px' }}>{nextYear}年 {MONTH_NAMES[nextMonth]}</span>
              <button onClick={e => { e.stopPropagation(); navigate(1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, color: '#666', fontSize: 14, lineHeight: 1 }} onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>›</button>
              <button onClick={e => { e.stopPropagation(); navigate(12); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, color: '#666', fontSize: 14, lineHeight: 1 }} onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>»</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>{renderCalendar(dpYear, dpMonth)}</div>
            <div>{renderCalendar(nextYear, nextMonth)}</div>
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#999' }}>{rangeText}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={cancel} className="btn" style={{ padding: '3px 16px', fontSize: 12 }}>取消</button>
              <button onClick={confirm} className="btn btn-primary" style={{ padding: '3px 16px', fontSize: 12 }}>确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Custom Single Select Dropdown =====
const CustomSelect: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  width?: number;
}> = ({ label, value, options, onChange, width = 120 }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (opt: string) => {
    onChange(value === opt ? '' : opt);
    setOpen(false);
  };

  return (
    <div ref={ref} className="filter-dropdown" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
      <label style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>{label}</label>
      <div
        className="dd-trigger"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          padding: '6px 12px', border: `1px solid ${open ? '#1890ff' : '#d9d9d9'}`,
          borderRadius: 6, fontSize: 13, background: '#fff', cursor: 'pointer',
          userSelect: 'none', transition: 'all 0.25s', whiteSpace: 'nowrap', minWidth: width,
          color: value ? '#333' : '#999',
          ...(open ? { borderColor: '#1890ff', boxShadow: '0 0 0 3px rgba(24,144,255,0.08)' } : {}),
        }}
      >
        <span>{value || '请选择'}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{ width: 12, height: 12, color: '#bbb', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && (
        <div className="dd-options" style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          background: '#fff', border: '1px solid #d9d9d9', borderRadius: 6,
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)', zIndex: 200, padding: '6px 0',
          visibility: 'visible', opacity: 1, transform: 'translateY(0)', pointerEvents: 'auto',
          minWidth: width,
        }}>
          {options.map(opt => (
            <div
              key={opt}
              className={`dd-option ${value === opt ? 'selected' : ''}`}
              onClick={() => handleSelect(opt)}
              style={{
                padding: '6px 14px', fontSize: 13, cursor: 'pointer', transition: 'background 0.15s',
                color: value === opt ? '#1890ff' : '#333',
                background: value === opt ? '#e6f7ff' : undefined,
                fontWeight: value === opt ? 500 : 400,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.color = '#1890ff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = value === opt ? '#e6f7ff' : ''; e.currentTarget.style.color = value === opt ? '#1890ff' : ''; }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== Custom Multi Select Dropdown =====
const MultiSelect: React.FC<{
  label: string;
  value: string[];
  options: string[];
  onChange: (val: string[]) => void;
  width?: number;
  minWidth?: number;
}> = ({ label, value, options, onChange, width = 180, minWidth = 220 }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (opt: string) => {
    const idx = value.indexOf(opt);
    if (idx === -1) onChange([...value, opt]);
    else onChange(value.filter(v => v !== opt));
  };

  const selectAll = () => onChange([...options]);
  const clearAll = () => onChange([]);

  const displayText = value.length === 0 ? '请选择' :
    value.length <= 2 ? value.join('、') :
      `${value[0]} 等${value.length}项`;

  return (
    <div ref={ref} className="filter-dropdown" style={{ position: 'relative', overflow: 'visible', display: 'flex', alignItems: 'center', gap: 6 }}>
      <label style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>{label}</label>
      <div
        className="dd-trigger"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          padding: '6px 12px', border: `1px solid ${open ? '#1890ff' : '#d9d9d9'}`,
          borderRadius: 6, fontSize: 13, background: '#fff', cursor: 'pointer',
          userSelect: 'none', transition: 'all 0.25s', whiteSpace: 'nowrap', minWidth: width,
          color: value.length > 0 ? '#333' : '#999',
          ...(open ? { borderColor: '#1890ff', boxShadow: '0 0 0 3px rgba(24,144,255,0.08)' } : {}),
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayText}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{ width: 12, height: 12, color: '#bbb', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && (
        <div className="dd-options" style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          background: '#fff', border: '1px solid #d9d9d9', borderRadius: 6,
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)', zIndex: 200, padding: '6px 0',
          visibility: 'visible', opacity: 1, transform: 'translateY(0)', pointerEvents: 'auto',
          minWidth, maxHeight: 280, overflowY: 'auto',
        }}>
          <div style={{ padding: '4px 12px', display: 'flex', gap: 8, fontSize: 12, borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>
            <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={selectAll}>全选</span>
            <span style={{ color: '#999', cursor: 'pointer' }} onClick={clearAll}>清空</span>
          </div>
          {options.map((opt, i) => (
            <div
              key={opt}
              onClick={() => toggle(opt)}
              style={{
                padding: '6px 14px', fontSize: 13, cursor: 'pointer', transition: 'background 0.15s',
                display: 'flex', alignItems: 'center', gap: 8,
                background: value.includes(opt) ? '#e6f7ff' : undefined,
                color: value.includes(opt) ? '#1890ff' : '#333',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.color = '#1890ff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = value.includes(opt) ? '#e6f7ff' : ''; e.currentTarget.style.color = value.includes(opt) ? '#1890ff' : '#333'; }}
            >
              <input type="checkbox" checked={value.includes(opt)} readOnly style={{ width: 14, height: 14, cursor: 'pointer' }} />
              <label style={{ cursor: 'pointer', flex: 1, userSelect: 'none' }}>{opt}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterBar: React.FC<FilterProps> = ({ onSearch, onReset }) => {
  const [taskId, setTaskId] = useState('');
  const [branch, setBranch] = useState('');
  const [policyNo, setPolicyNo] = useState('');
  const [custNo, setCustNo] = useState('');
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [status, setStatus] = useState('');
  const [reasons, setReasons] = useState<string[]>([]);
  const [rePool, setRePool] = useState(false);

  const handleSearch = () => {
    onSearch({ taskId, branch, policyNo, custNo, dateStart: dateRange[0], dateEnd: dateRange[1], status, reasons, rePool });
  };

  const handleReset = () => {
    setTaskId('');
    setBranch('');
    setPolicyNo('');
    setCustNo('');
    setDateRange(['', '']);
    setStatus('');
    setReasons([]);
    setRePool(false);
    onReset();
  };

  return (
    <div style={{
      background: '#fff', padding: '18px 22px', borderRadius: 8, marginBottom: 16,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      {/* Row 1 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <div className="filter-item" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>任务ID：</label>
          <input
            type="text" value={taskId} onChange={e => setTaskId(e.target.value)}
            placeholder="任务ID"
            style={{ width: 140, padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 13, outline: 'none', transition: 'all 0.25s', background: '#fff', color: '#333' }}
            onFocus={e => { e.target.style.borderColor = '#1890ff'; e.target.style.boxShadow = '0 0 0 3px rgba(24,144,255,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = '#d9d9d9'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        <div className="filter-item" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>分公司-保单号：</label>
          <input
            type="text" value={branch} onChange={e => setBranch(e.target.value)}
            placeholder="分公司"
            style={{ width: 80, padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 13, outline: 'none', transition: 'all 0.25s', background: '#fff', color: '#333' }}
            onFocus={e => { e.target.style.borderColor = '#1890ff'; e.target.style.boxShadow = '0 0 0 3px rgba(24,144,255,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = '#d9d9d9'; e.target.style.boxShadow = 'none'; }}
          />
          <input
            type="text" value={policyNo} onChange={e => setPolicyNo(e.target.value)}
            placeholder="保单号"
            style={{ width: 100, padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 13, outline: 'none', transition: 'all 0.25s', background: '#fff', color: '#333' }}
            onFocus={e => { e.target.style.borderColor = '#1890ff'; e.target.style.boxShadow = '0 0 0 3px rgba(24,144,255,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = '#d9d9d9'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        <div className="filter-item" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>客户号：</label>
          <input
            type="text" value={custNo} onChange={e => setCustNo(e.target.value)}
            placeholder="客户号"
            style={{ width: 120, padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 13, outline: 'none', transition: 'all 0.25s', background: '#fff', color: '#333' }}
            onFocus={e => { e.target.style.borderColor = '#1890ff'; e.target.style.boxShadow = '0 0 0 3px rgba(24,144,255,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = '#d9d9d9'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        <div className="filter-item" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <DateRangePicker value={dateRange} onChange={(s, e) => setDateRange([s, e])} />
        </div>
      </div>
      {/* Row 2 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <CustomSelect label="任务状态：" value={status} options={['处理中', '完成', '失败']} onChange={setStatus} />
        <MultiSelect label="自核未过原因：" value={reasons} options={REASON_OPTIONS} onChange={setReasons} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <label className="radio-wrap" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#333', cursor: 'pointer' }}>
            <input type="radio" name="insuredMode" value="single" style={{ width: 14, height: 14, cursor: 'pointer' }} />
            单被保人
          </label>
          <label className="radio-wrap" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#333', cursor: 'pointer', marginLeft: 12 }}>
            <input type="radio" name="insuredMode" value="multi" style={{ width: 14, height: 14, cursor: 'pointer' }} />
            多被保人
          </label>
          <label className="checkbox-wrap" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#333', cursor: 'pointer', marginLeft: 12 }}>
            <input type="checkbox" checked={rePool} onChange={e => setRePool(e.target.checked)} style={{ width: 14, height: 14, cursor: 'pointer' }} />
            二次入池
          </label>
          <button className="btn btn-primary" onClick={handleSearch} style={{ marginLeft: 12 }}>查询</button>
          <button className="btn" onClick={handleReset}>重置</button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
