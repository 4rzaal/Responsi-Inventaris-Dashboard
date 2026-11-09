import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  BarChart3,
  CircleDollarSign,
  Coffee,
  PackageCheck,
  PackageX,
  Plus,
  RefreshCw,
  Tags,
  TrendingUp,
} from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import StatCard from './components/StatCard.jsx';
import InventoryTable from './components/InventoryTable.jsx';
import ProductModal from './components/ProductModal.jsx';
import ConfirmDeleteModal from './components/ConfirmDeleteModal.jsx';
import StatusBadge from './components/StatusBadge.jsx';
import SearchResults from './components/SearchResults.jsx';
import { inventoryCategories } from './data/initialInventory.js';
import {
  createCsv,
  formatRupiah,
  getInventorySummary,
  getStockStatus,
  loadInventory,
  saveInventory,
} from './utils/inventory.js';
import { notify } from './utils/notify.js';

const pageMeta = {
  overview: { title: 'Good day, COZZE!', subtitle: 'Pantau stok dan kebutuhan operasional coffee shop kamu hari ini.' },
  inventory: { title: 'Inventaris Barang', subtitle: 'Kelola bahan baku dan perlengkapan operasional COZZE.' },
  categories: { title: 'Kategori Inventaris', subtitle: 'Lihat komposisi barang berdasarkan kelompok kebutuhan.' },
  reports: { title: 'Laporan Stok', subtitle: 'Ringkasan kondisi persediaan dan nilai inventaris saat ini.' },
  search: { title: 'Hasil Pencarian', subtitle: 'Informasi lengkap barang berdasarkan kata kunci pencarian.' },
};

function App() {
  const [items, setItems] = useState(loadInventory);
  const [activePage, setActivePage] = useState('overview');
  const [previousPage, setPreviousPage] = useState('overview');
  const [search, setSearch] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => saveInventory(items), [items]);

  const summary = useMemo(() => getInventorySummary(items), [items]);
  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items
      .filter((item) => {
        const matchesSearch = !keyword || [item.name, item.sku, item.category, item.supplier].some((value) => String(value).toLowerCase().includes(keyword));
        const matchesCategory = categoryFilter === 'Semua Kategori' || item.category === categoryFilter;
        const matchesStatus = statusFilter === 'Semua Status' || getStockStatus(item) === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'id'));
  }, [items, search, categoryFilter, statusFilter]);

  const lowStockItems = useMemo(
    () => items.filter((item) => getStockStatus(item) !== 'Aman').sort((a, b) => a.stock - b.stock),
    [items],
  );

  const openAddModal = () => { setEditingItem(null); setModalOpen(true); };
  const openEditModal = (item) => { setEditingItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingItem(null); };

  function handleSaveProduct(formData) {
    const duplicateSku = items.some((item) => item.sku.toLowerCase() === formData.sku.toLowerCase() && item.id !== editingItem?.id);
    if (duplicateSku) {
      notify('SKU sudah digunakan. Gunakan kode barang yang berbeda.', 'danger');
      return;
    }

    if (editingItem) {
      setItems((current) => current.map((item) => item.id === editingItem.id ? { ...item, ...formData } : item));
      notify(`${formData.name} berhasil diperbarui.`);
    } else {
      setItems((current) => [{ ...formData, id: Date.now() }, ...current]);
      notify(`${formData.name} berhasil ditambahkan.`);
    }
    closeModal();
  }

  function handleDeleteProduct(item) {
    setItems((current) => current.filter((product) => product.id !== item.id));
    setDeleteTarget(null);
    notify(`${item.name} berhasil dihapus.`);
  }

  function handleAdjustStock(item, amount) {
    if (amount < 0 && Number(item.stock) <= 0) {
      notify('Stok barang sudah habis dan tidak bisa dikurangi lagi.', 'danger');
      return;
    }
    setItems((current) => current.map((product) => product.id === item.id
      ? { ...product, stock: Math.max(0, Number(product.stock) + amount), updatedAt: new Date().toISOString().slice(0, 10) }
      : product));
    notify(`Stok ${item.name} ${amount > 0 ? 'ditambah' : 'dikurangi'} 1 ${item.unit}.`);
  }

  function handleExport() {
    const csvContent = `\uFEFF${createCsv(filteredItems)}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cozze-inventory.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify('File inventaris berhasil diekspor ke CSV.');
  }

  function handleSearchSubmit(query) {
    const keyword = (query !== undefined ? query : search).trim();
    if (!keyword) {
      notify('Ketik kata kunci terlebih dahulu untuk mencari.', 'danger');
      return;
    }
    setPreviousPage((curr) => (curr === 'search' ? previousPage : activePage));
    setSubmittedQuery(keyword);
    setSearch(keyword);
    setActivePage('search');
  }

  function handleClearSearch() {
    setSearch('');
    if (activePage === 'search') {
      setActivePage(previousPage || 'overview');
    }
  }

  const dateLabel = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="main-shell">
        <Topbar
          search={search}
          onSearch={setSearch}
          onSearchSubmit={handleSearchSubmit}
          onClearSearch={handleClearSearch}
          onAlerts={() => setActivePage('reports')}
          onMenu={() => setMobileOpen(true)}
          activePage={
            activePage === 'search'
              ? `Pencarian: "${submittedQuery}"`
              : activePage === 'overview'
              ? 'Overview'
              : pageMeta[activePage]?.title || activePage
          }
        />
        <div className="page-content container-fluid">
          <div className="page-heading-row">
            <div>
              <div className="eyebrow-date"><span className="live-dot" />{dateLabel}</div>
              <h1>{activePage === 'search' ? `Pencarian: "${submittedQuery}"` : pageMeta[activePage].title}</h1>
              <p>{activePage === 'search' ? `Ditemukan informasi barang sesuai kata kunci "${submittedQuery}".` : pageMeta[activePage].subtitle}</p>
            </div>
            <div className="page-heading-actions">
              {activePage === 'search' && (
                <button className="btn btn-outline-cozze" onClick={() => setActivePage(previousPage || 'overview')}>
                  <ArrowLeft size={16} /> Kembali
                </button>
              )}
              {activePage !== 'overview' && activePage !== 'search' && <button className="btn btn-outline-cozze" onClick={handleExport}><ArrowDownRight size={16} /> Unduh data</button>}
              <button className="btn btn-primary-cozze" onClick={openAddModal}><Plus size={17} /> Tambah Barang</button>
            </div>
          </div>

          {activePage === 'overview' && (
            <Overview
              items={items}
              summary={summary}
              lowStockItems={lowStockItems}
              onGoInventory={() => setActivePage('inventory')}
              onEdit={openEditModal}
              onDelete={setDeleteTarget}
              onAdjust={handleAdjustStock}
              onAdd={openAddModal}
            />
          )}

          {activePage === 'inventory' && (
            <InventoryPage
              items={filteredItems}
              allCount={items.length}
              search={search}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              onCategoryChange={setCategoryFilter}
              onStatusChange={setStatusFilter}
              onReset={() => { setSearch(''); setCategoryFilter('Semua Kategori'); setStatusFilter('Semua Status'); }}
              onEdit={openEditModal}
              onDelete={setDeleteTarget}
              onAdjust={handleAdjustStock}
              onAdd={openAddModal}
            />
          )}

          {activePage === 'categories' && <CategoriesPage items={items} onFilter={(category) => { setCategoryFilter(category); setActivePage('inventory'); }} />}
          {activePage === 'reports' && <ReportsPage items={items} summary={summary} lowStockItems={lowStockItems} />}

          {activePage === 'search' && (
            <SearchResults
              items={items}
              query={submittedQuery}
              onSearchSubmit={handleSearchSubmit}
              onBack={() => setActivePage(previousPage || 'overview')}
              onGoInventory={() => setActivePage('inventory')}
              onEdit={openEditModal}
              onDelete={setDeleteTarget}
              onAdjust={handleAdjustStock}
              onAdd={openAddModal}
            />
          )}
        </div>
        <footer className="page-footer"><span>© 2026 COZZE Coffee Inventory</span><span>Built for better stock, better coffee <Coffee size={13} /></span></footer>
      </main>

      <ProductModal open={modalOpen} product={editingItem} onClose={closeModal} onSubmit={handleSaveProduct} />
      <ConfirmDeleteModal item={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteProduct} />
    </div>
  );
}

function Overview({ items, summary, lowStockItems, onGoInventory, onEdit, onDelete, onAdjust, onAdd }) {
  const latestItems = [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  return (
    <>
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="welcome-kicker">YOUR DAILY STOCK BRIEFING</span>
          <h2>Fresh stock,<br /><em>freshly brewed.</em></h2>
          <p>Pastikan setiap bahan selalu siap untuk jadi sajian terbaik COZZE.</p>
          <button className="welcome-button" onClick={onGoInventory}>Lihat inventaris <ArrowUpRight size={16} /></button>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="coffee-stamp"><Coffee size={62} strokeWidth={1.15} /><span>BREW<br />WITH<br />CARE</span></div>
          <div className="art-bean bean-one" /><div className="art-bean bean-two" /><div className="art-bean bean-three" />
        </div>
        <div className="banner-bottom-note"><span>COZZE</span><i /> INVENTORY MANAGEMENT</div>
      </section>

      <section className="row g-3 stats-grid">
        <StatCard label="Total Jenis Barang" value={summary.totalItems} note="SKU terdaftar di inventaris" icon={Boxes} tone="cream" />
        <StatCard label="Perlu Restock" value={summary.needsRestock} note={`${summary.lowStock} menipis · ${summary.outOfStock} habis`} icon={AlertCircle} tone="rose" />
        <StatCard label="Stok Habis" value={summary.outOfStock} note="Barang perlu segera dibeli" icon={PackageX} tone="sand" />
        <StatCard label="Nilai Persediaan" value={formatRupiah(summary.stockValue)} note="Estimasi berdasarkan harga beli" icon={CircleDollarSign} tone="dark" valueClass="stat-value-money" />
      </section>

      <section className="overview-grid">
        <div className="surface-card card shadow-sm rounded-3 overview-main-card">
          <div className="section-heading">
            <div><span className="section-kicker">NEEDS ATTENTION</span><h2>Perlu perhatian</h2><p>Barang yang sudah mencapai batas minimum stok.</p></div>
            <button className="text-link-button" onClick={onGoInventory}>Lihat semua <ArrowUpRight size={15} /></button>
          </div>
          {lowStockItems.length ? (
            <div className="attention-list">
              {lowStockItems.slice(0, 4).map((item) => (
                <div className="attention-item" key={item.id}>
                  <div className="attention-product-icon"><span>{item.name.charAt(0)}</span></div>
                  <div className="attention-copy"><strong>{item.name}</strong><span>{item.sku} · {item.category}</span></div>
                  <div className="attention-stock"><strong>{item.stock} <small>{item.unit}</small></strong><span>Min. {item.minStock}</span></div>
                  <StatusBadge item={item} />
                  <button className="small-edit-button" onClick={() => onEdit(item)} aria-label={`Edit ${item.name}`}>Atur</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="all-safe-state"><PackageCheck size={24} /><strong>Semua stok aman.</strong><span>Belum ada barang yang perlu direstock.</span></div>
          )}
        </div>

        <div className="surface-card card shadow-sm rounded-3 stock-health-card">
          <div className="section-heading section-heading-compact"><div><span className="section-kicker">STOCK HEALTH</span><h2>Kondisi stok</h2></div><span className="round-icon-muted"><TrendingUp size={17} /></span></div>
          <div className="health-total"><strong>{summary.totalItems ? Math.round((items.filter((item) => getStockStatus(item) === 'Aman').length / summary.totalItems) * 100) : 0}%</strong><span>barang dalam kondisi aman</span></div>
          <div className="health-bar"><span className="health-safe" style={{ width: `${summary.totalItems ? (items.filter((item) => getStockStatus(item) === 'Aman').length / summary.totalItems) * 100 : 0}%` }} /><span className="health-low" style={{ width: `${summary.totalItems ? (summary.lowStock / summary.totalItems) * 100 : 0}%` }} /><span className="health-empty" style={{ width: `${summary.totalItems ? (summary.outOfStock / summary.totalItems) * 100 : 0}%` }} /></div>
          <div className="health-legend">
            <div><i className="legend-safe" /><span>Aman</span><strong>{items.filter((item) => getStockStatus(item) === 'Aman').length}</strong></div>
            <div><i className="legend-low" /><span>Menipis</span><strong>{summary.lowStock}</strong></div>
            <div><i className="legend-empty" /><span>Habis</span><strong>{summary.outOfStock}</strong></div>
          </div>
          <button className="health-add-button" onClick={onAdd}><Plus size={15} /> Tambah barang baru</button>
        </div>
      </section>

      <section className="surface-card card shadow-sm rounded-3 recent-card">
        <div className="section-heading">
          <div><span className="section-kicker">INVENTORY SNAPSHOT</span><h2>Barang diperbarui</h2><p>Ringkasan barang dengan pembaruan terakhir.</p></div>
          <button className="text-link-button" onClick={onGoInventory}>Buka inventaris <ArrowUpRight size={15} /></button>
        </div>
        <InventoryTable items={latestItems} onEdit={onEdit} onDelete={onDelete} onAdjust={onAdjust} compact />
      </section>
    </>
  );
}

function InventoryPage({ items, allCount, search, categoryFilter, statusFilter, onCategoryChange, onStatusChange, onReset, onEdit, onDelete, onAdjust, onAdd }) {
  const hasFilter = Boolean(search || categoryFilter !== 'Semua Kategori' || statusFilter !== 'Semua Status');
  return (
    <section className="surface-card card shadow-sm rounded-3 inventory-page-card">
      <div className="inventory-toolbar">
        <div><span className="section-kicker">STOCK DATABASE</span><h2>Daftar inventaris <span>{items.length}</span></h2><p>Menampilkan {items.length} dari {allCount} barang terdaftar.</p></div>
        <div className="table-filter-group">
          <label className="select-filter"><Tags size={15} /><select value={categoryFilter} onChange={(event) => onCategoryChange(event.target.value)} aria-label="Filter kategori"><option>Semua Kategori</option>{inventoryCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="select-filter"><RefreshCw size={15} /><select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)} aria-label="Filter status"><option>Semua Status</option><option>Aman</option><option>Menipis</option><option>Habis</option></select></label>
          {hasFilter && <button className="reset-filter" onClick={onReset}>Reset</button>}
        </div>
      </div>
      <InventoryTable items={items} onEdit={onEdit} onDelete={onDelete} onAdjust={onAdjust} />
      <div className="table-bottom-note"><span><i /> Data tersimpan otomatis di browser ini</span><span>{items.length} data ditampilkan</span></div>
      {!items.length && <div className="empty-add-row"><button className="btn btn-primary-cozze" onClick={onAdd}><Plus size={16} /> Tambah barang</button></div>}
    </section>
  );
}

function CategoriesPage({ items, onFilter }) {
  const colors = ['#6d333d', '#b78463', '#7b9274', '#bf9e55', '#9a776e', '#8b7770', '#a4a08b'];
  const counts = inventoryCategories.map((category, index) => ({ category, count: items.filter((item) => item.category === category).length, color: colors[index] }));
  return (
    <section className="category-grid">
      {counts.map((entry) => (
        <article className="surface-card card shadow-sm rounded-3 category-card" key={entry.category}>
          <div className="category-card-top"><div className="category-art" style={{ '--category-color': entry.color }}><Tags size={20} /></div><span className="category-count">{entry.count} item</span></div>
          <h2>{entry.category}</h2>
          <p>{entry.count ? 'Kategori memiliki barang terdaftar di inventaris.' : 'Belum ada barang pada kategori ini.'}</p>
          <button className="text-link-button" onClick={() => onFilter(entry.category)}>Lihat barang <ArrowUpRight size={15} /></button>
        </article>
      ))}
    </section>
  );
}

function ReportsPage({ items, summary, lowStockItems }) {
  const categoryData = inventoryCategories.map((category) => ({ category, count: items.filter((item) => item.category === category).length })).filter((entry) => entry.count > 0).sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...categoryData.map((entry) => entry.count));
  const safeCount = items.filter((item) => getStockStatus(item) === 'Aman').length;
  return (
    <div className="reports-layout">
      <section className="row g-3 stats-grid reports-stats">
        <StatCard label="Total SKU" value={summary.totalItems} note="Jumlah jenis barang" icon={Boxes} tone="cream" />
        <StatCard label="Total Unit Stok" value={summary.totalUnits.toLocaleString('id-ID')} note="Akumulasi kuantitas semua barang" icon={PackageCheck} tone="rose" />
        <StatCard label="Nilai Persediaan" value={formatRupiah(summary.stockValue)} note="Harga beli × jumlah stok" icon={CircleDollarSign} tone="dark" valueClass="stat-value-money" />
        <StatCard label="Rasio Stok Aman" value={`${items.length ? Math.round((safeCount / items.length) * 100) : 0}%`} note={`${safeCount} dari ${items.length} jenis barang`} icon={BarChart3} tone="sand" />
      </section>
      <section className="reports-grid">
        <div className="surface-card card shadow-sm rounded-3 report-card">
          <div className="section-heading"><div><span className="section-kicker">CATEGORY BREAKDOWN</span><h2>Barang per kategori</h2><p>Distribusi jumlah SKU pada setiap kategori.</p></div></div>
          <div className="category-bars">
            {categoryData.map((entry, index) => (
              <div className="category-bar-row" key={entry.category}>
                <div className="category-bar-label"><span>{entry.category}</span><strong>{entry.count}</strong></div>
                <div className="category-bar-track"><span style={{ width: `${(entry.count / maxCount) * 100}%`, animationDelay: `${index * 70}ms` }} /></div>
              </div>
            ))}
            {!categoryData.length && <div className="empty-state"><strong>Belum ada data kategori.</strong></div>}
          </div>
        </div>
        <div className="surface-card card shadow-sm rounded-3 report-card report-alert-card">
          <div className="section-heading"><div><span className="section-kicker">RESTOCK LIST</span><h2>Prioritas pembelian</h2><p>Barang habis dan menipis.</p></div></div>
          {lowStockItems.length ? lowStockItems.map((item) => (
            <div className="report-alert-row" key={item.id}><div><strong>{item.name}</strong><span>{item.sku}</span></div><div className="report-alert-stock"><strong>{item.stock} {item.unit}</strong><StatusBadge item={item} /></div></div>
          )) : <div className="all-safe-state"><PackageCheck size={24} /><strong>Stok terkendali.</strong><span>Tidak ada barang dalam daftar restock.</span></div>}
        </div>
      </section>
      <div className="report-footnote"><AlertCircle size={16} /><span>Laporan dihitung langsung dari data inventaris di browser. Nilai persediaan menggunakan harga beli dan tidak termasuk biaya operasional lain.</span></div>
    </div>
  );
}

export default App;
