import {
  LayoutDashboard,
  Package,
  Tags,
  BarChart3,
  Coffee,
  X,
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventaris Barang', icon: Package },
  { id: 'categories', label: 'Kategori', icon: Tags },
  { id: 'reports', label: 'Laporan Stok', icon: BarChart3 },
];

export default function Sidebar({ activePage, onNavigate, mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Tutup menu" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Coffee size={22} strokeWidth={2.1} /></div>
          <div>
            <div className="brand-name">COZZE<span>.</span></div>
            <div className="brand-caption">COFFEE INVENTORY</div>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Tutup sidebar"><X size={19} /></button>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Navigasi utama">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-link-custom ${activePage === item.id ? 'active' : ''}`}
                onClick={() => { onNavigate(item.id); onClose(); }}
              >
                <Icon size={18} strokeWidth={1.9} />
                <span>{item.label}</span>
                {item.id === 'inventory' && <span className="nav-live-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="sidebar-note-icon"><Coffee size={17} /></div>
            <div>
              <strong>Keep it fresh.</strong>
              <span>Stok rapi, racikan happy.</span>
            </div>
          </div>
          <div className="sidebar-footer">COZZE INVENTORY <span>v1.0.0</span></div>
        </div>
      </aside>
    </>
  );
}
