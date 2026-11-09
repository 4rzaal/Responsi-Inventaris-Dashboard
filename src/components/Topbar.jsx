import { useEffect, useRef } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';

export default function Topbar({
  search,
  onSearch,
  onSearchSubmit,
  onClearSearch,
  onAlerts,
  onMenu,
  activePage,
}) {
  const inputRef = useRef(null);

  // Shortcut ⌘K / Ctrl+K untuk fokus langsung ke kolom pencarian
  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(search);
    }
  }

  function handleClear() {
    onSearch('');
    if (onClearSearch) {
      onClearSearch();
    }
    inputRef.current?.focus();
  }

  return (
    <header className="topbar navbar">
      <div className="topbar-left">
        <button className="mobile-menu-button" onClick={onMenu} aria-label="Buka menu"><Menu size={21} /></button>
        <div className="breadcrumb"><span>COZZE</span><i>/</i><strong>{activePage}</strong></div>
      </div>
      <div className="topbar-actions">
        <form className="global-search" role="search" onSubmit={handleSubmit}>
          <button
            type="submit"
            className="global-search-submit"
            title="Cari barang (Tekan Enter)"
            aria-label="Cari barang"
          >
            <Search size={17} />
          </button>
          <input
            ref={inputRef}
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Cari barang atau SKU... (Enter)"
            aria-label="Cari barang atau SKU"
          />
          {search && (
            <button
              type="button"
              className="global-search-clear"
              onClick={handleClear}
              title="Hapus pencarian"
              aria-label="Hapus pencarian"
            >
              <X size={14} />
            </button>
          )}
          <kbd title="Tekan ⌘K untuk mencari">⌘ K</kbd>
        </form>
        <button className="topbar-icon-button" type="button" title="Lihat laporan stok" aria-label="Lihat laporan stok" onClick={onAlerts}><Bell size={18} /></button>
        <div className="user-profile">
          <div className="avatar">A</div>
          <div className="user-profile-copy"><strong>Admin COZZE</strong><span>Inventory Manager</span></div>
        </div>
      </div>
    </header>
  );
}
