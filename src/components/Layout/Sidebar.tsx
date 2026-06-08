import React from 'react';

const menuItems = [
  { icon: 'home', label: '首页', active: false },
  { icon: 'file', label: '新契约', active: false, expanded: true, children: [
    { icon: 'help', label: '审核助手' },
    { icon: 'activity', label: '健康类', active: true },
    { icon: 'shield', label: '核保质检' },
    { icon: 'grid', label: '任务调度中心' },
  ]},
  { icon: 'settings', label: '系统管理', active: false, mt: true },
];

const icons: Record<string, React.ReactNode> = {
  home: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  ),
  file: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  help: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  activity: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  shield: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  grid: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  settings: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
};

const Sidebar: React.FC = () => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: 200, height: '100vh',
      background: 'linear-gradient(180deg, #001529 0%, #002140 100%)',
      overflowY: 'auto', zIndex: 10,
    }}>
      <div style={{
        height: 52, background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 16, fontWeight: 600, letterSpacing: 1,
        boxShadow: '0 2px 8px rgba(24,144,255,0.3)',
      }}>
        AI核保审核
      </div>
      <div style={{ padding: '12px 0' }}>
        {menuItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <a
              href="#"
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '0 24px', height: 40,
                color: item.active ? '#fff' : (item.expanded ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.55)'),
                background: item.active ? 'linear-gradient(90deg, rgba(24,144,255,0.15) 0%, transparent 100%)' :
                  (item.expanded ? 'rgba(255,255,255,0.04)' : 'transparent'),
                textDecoration: 'none', fontSize: 14, transition: 'all 0.25s ease',
                position: 'relative', marginTop: item.mt ? 8 : 0,
              }}
              onClick={e => e.preventDefault()}
            >
              <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {icons[item.icon]}
              </span>
              {item.label}
              {item.active && (
                <span style={{
                  position: 'absolute', left: 0, top: 8, bottom: 8, width: 3,
                  background: '#1890ff', borderRadius: '0 3px 3px 0',
                }} />
              )}
            </a>
            {item.expanded && item.children && (
              <div style={{ display: 'block' }}>
                {item.children.map((child, cIdx) => (
                  <a
                    key={cIdx}
                    href="#"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '0 24px 0 48px', height: 36,
                      color: child.active ? '#fff' : 'rgba(255,255,255,0.55)',
                      background: child.active ? 'linear-gradient(90deg, rgba(24,144,255,0.15) 0%, transparent 100%)' : 'transparent',
                      textDecoration: 'none', fontSize: 13, transition: 'all 0.25s ease',
                      position: 'relative',
                    }}
                    onClick={e => e.preventDefault()}
                  >
                    <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      {icons[child.icon]}
                    </span>
                    {child.label}
                    {child.active && (
                      <span style={{
                        position: 'absolute', left: 0, top: 8, bottom: 8, width: 3,
                        background: '#1890ff', borderRadius: '0 3px 3px 0',
                      }} />
                    )}
                  </a>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
