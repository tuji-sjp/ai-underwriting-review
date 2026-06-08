import React from 'react';

interface TopTabsProps {
  tabs: { key: string; label: string; icon: React.ReactNode }[];
  activeKey: string;
  onTabClick: (key: string) => void;
  onCloseTab?: (key: string) => void;
}

const TopTabs: React.FC<TopTabsProps> = ({ tabs, activeKey, onTabClick, onCloseTab }) => {
  return (
    <div style={{
      height: 44, background: '#fff', borderBottom: '1px solid #e8e8e8',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 0,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      {tabs.map(tab => (
        <div
          key={tab.key}
          onClick={() => onTabClick(tab.key)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            fontSize: 13, cursor: 'pointer', borderRadius: '6px 6px 0 0',
            transition: 'all 0.2s',
            color: tab.key === activeKey ? '#1890ff' : '#666',
            background: tab.key === activeKey ? '#e6f7ff' : 'transparent',
            fontWeight: tab.key === activeKey ? 500 : 400,
          }}
        >
          {tab.icon}
          {tab.label}
          {onCloseTab && (
            <span
              onClick={e => { e.stopPropagation(); onCloseTab(tab.key); }}
              style={{ fontSize: 12, color: '#bbb', marginLeft: 4, cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ff4d4f')}
              onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}
            >
              ×
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TopTabs;
