import { useMemo } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Edit3,
  Minus,
  Package,
  PackageCheck,
  PackageX,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
} from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import StatCard from './StatCard.jsx';
import { formatDate, formatRupiah, getStockStatus } from '../utils/inventory.js';

// Pencarian cerdas: mencakup kecocokan teks langsung dan sinonim umum operasional coffee shop
export function searchInventoryItems(items, query) {
  const keyword = String(query || '').trim().toLowerCase();
  if (!keyword) return [];

  return items.filter((item) => {
    const name = String(item.name || '').toLowerCase();
    const sku = String(item.sku || '').toLowerCase();
    const category = String(item.category || '').toLowerCase();
    const supplier = String(item.supplier || '').toLowerCase();

    // Cocok langsung dengan nama, kode SKU, kategori, atau supplier
    if (name.includes(keyword) || sku.includes(keyword) || category.includes(keyword) || supplier.includes(keyword)) {
      return true;
    }

    // Sinonim operasional coffee shop (misal "susu" mencakup Dairy & Oat Milk)
    if (keyword === 'susu' || keyword === 'milk') {
      if (category.includes('dairy') || name.includes('milk') || name.includes('dairy') || name.includes('oat')) {
        return true;
      }
    }
    if (keyword === 'kopi' || keyword === 'coffee' || keyword === 'bean') {
      if (category.includes('kopi') || name.includes('blend') || name.includes('espresso') || name.includes('coffee')) {
        return true;
      }
    }
    if (keyword === 'gula' || keyword === 'sirup' || keyword === 'syrup' || keyword === 'manis') {
      if (category.includes('sweetener') || category.includes('syrup') || name.includes('aren') || name.includes('vanilla')) {
        return true;
      }
    }
    if (keyword === 'cup' || keyword === 'gelas' || keyword === 'kemasan' || keyword === 'packaging' || keyword === 'tutup') {
      if (category.includes('packaging') || name.includes('cup') || name.includes('bag') || name.includes('lid')) {
        return true;
      }
    }
    if (keyword === 'teh' || keyword === 'tea' || keyword === 'matcha') {
      if (category.includes('tea') || name.includes('matcha') || name.includes('powder')) {
        return true;
      }
    }

    return false;
  });
}

export default function SearchResults({
  items,
  query,
  onSearchSubmit,
  onBack,
  onGoInventory,
  onEdit,
  onDelete,
  onAdjust,
  onAdd,
}) {
  const results = useMemo(() => searchInventoryItems(items, query), [items, query]);

  // Statistik khusus hasil pencarian
  const metrics = useMemo(() => {
    return results.reduce(
      (acc, item) => {
        const status = getStockStatus(item);
        const stock = Number(item.stock) || 0;
        const buyPrice = Number(item.buyPrice) || 0;
        const sellPrice = Number(item.sellPrice) || 0;

        acc.totalUnits += stock;
        acc.totalBuyValue += stock * buyPrice;
        acc.totalSellValue += stock * sellPrice;

        if (status === 'Habis') acc.outOfStock += 1;
        else if (status === 'Menipis') acc.lowStock += 1;
        else acc.safe += 1;

        return acc;
      },
      { totalUnits: 0, totalBuyValue: 0, totalSellValue: 0, outOfStock: 0, lowStock: 0, safe: 0 },
    );
  }, [results]);

  // Barang terkait dari kategori yang sama
  const relatedItems = useMemo(() => {
    if (!results.length) return [];
    const matchedCategories = new Set(results.map((r) => r.category));
    const matchedIds = new Set(results.map((r) => r.id));
    return items
      .filter((item) => matchedCategories.has(item.category) && !matchedIds.has(item.id))
      .slice(0, 3);
  }, [items, results]);

  const urgentItems = results.filter((item) => getStockStatus(item) !== 'Aman');
  const potentialProfit = metrics.totalSellValue - metrics.totalBuyValue;

  return (
    <div className="search-results-page">
      {/* Header bar navigasi dan tombol kembali */}
      <div className="search-top-nav">
        <button type="button" className="search-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>
        <div className="search-nav-meta">
          <span className="search-nav-badge">
            <Search size={13} />
            Kata kunci: <strong>"{query}"</strong>
          </span>
          <button type="button" className="text-link-button" onClick={onGoInventory}>
            Lihat semua di tabel inventaris <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Banner Ringkasan Pencarian */}
      <section className="search-hero-banner">
        <div className="search-hero-content">
          <span className="welcome-kicker">HASIL PENCARIAN INVENTARIS</span>
          <h2>
            Informasi barang <em>"{query}"</em>
          </h2>
          <p>
            {results.length > 0
              ? `Ditemukan ${results.length} jenis barang yang sesuai dengan kata kunci pencarian kamu.`
              : `Tidak ditemukan barang dengan kata kunci "${query}".`}
          </p>
        </div>
        <div className="search-hero-actions">
          <button type="button" className="btn btn-outline-cozze search-hero-btn" onClick={onGoInventory}>
            <Boxes size={15} /> Buka Inventaris
          </button>
          <button type="button" className="btn btn-primary-cozze search-hero-btn" onClick={onAdd}>
            <Plus size={16} /> Tambah Barang
          </button>
        </div>
      </section>

      {/* Jika ada hasil pencarian */}
      {results.length > 0 ? (
        <>
          {/* Kartu Ringkasan Metrik Pencarian */}
          <section className="row g-3 stats-grid search-stats-grid">
            <StatCard
              label="Barang Ditemukan"
              value={results.length}
              note="SKU sesuai pencarian"
              icon={Boxes}
              tone="cream"
            />
            <StatCard
              label="Total Unit Stok"
              value={metrics.totalUnits.toLocaleString('id-ID')}
              note="Akumulasi kuantitas fisik"
              icon={PackageCheck}
              tone="rose"
            />
            <StatCard
              label="Nilai Persediaan"
              value={formatRupiah(metrics.totalBuyValue)}
              note="Berdasarkan harga beli modal"
              icon={CircleDollarSign}
              tone="dark"
              valueClass="stat-value-money"
            />
            <StatCard
              label="Status Persediaan"
              value={
                metrics.outOfStock + metrics.lowStock > 0
                  ? `${metrics.outOfStock + metrics.lowStock} Perlu Restock`
                  : 'Semua Aman'
              }
              note={`${metrics.lowStock} menipis · ${metrics.outOfStock} habis · ${metrics.safe} aman`}
              icon={metrics.outOfStock > 0 ? PackageX : metrics.lowStock > 0 ? AlertTriangle : CheckCircle2}
              tone={metrics.outOfStock > 0 ? 'rose' : metrics.lowStock > 0 ? 'sand' : 'cream'}
            />
          </section>

          {/* Alert Restock jika ada barang habis atau menipis */}
          {urgentItems.length > 0 && (
            <div className="search-alert-banner">
              <div className="search-alert-icon">
                <AlertTriangle size={20} />
              </div>
              <div className="search-alert-copy">
                <strong>Perhatian: Butuh Tindakan Restock Segera!</strong>
                <p>
                  Terdapat {urgentItems.length} barang dalam pencarian ini yang perlu diperhatikan:{' '}
                  {urgentItems.map((u, idx) => (
                    <span key={u.id} className="urgent-name-tag">
                      {u.name} ({getStockStatus(u)}){idx < urgentItems.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  . Silakan hubungi supplier terkait untuk pemesanan bahan baku baru.
                </p>
              </div>
            </div>
          )}

          {/* Grid Informasi Lengkap Setiap Barang */}
          <div className="search-items-header">
            <div>
              <span className="section-kicker">INFORMASI LENGKAP PRODUK</span>
              <h3>Daftar Detail Barang</h3>
            </div>
            <span className="search-count-pill">{results.length} barang ditampilkan</span>
          </div>

          <div className="search-cards-grid">
            {results.map((item) => {
              const status = getStockStatus(item);
              const marginRp = (Number(item.sellPrice) || 0) - (Number(item.buyPrice) || 0);
              const marginPercent = item.buyPrice > 0 ? Math.round((marginRp / item.buyPrice) * 100) : 0;
              const totalBuyValue = (Number(item.stock) || 0) * (Number(item.buyPrice) || 0);
              const totalSellValue = (Number(item.stock) || 0) * (Number(item.sellPrice) || 0);
              const stockRatio = item.minStock > 0 ? Math.min(100, Math.round((item.stock / item.minStock) * 100)) : 100;

              return (
                <article className="surface-card search-product-card" key={item.id}>
                  {/* Bagian Header Kartu Barang */}
                  <div className="product-card-head">
                    <div className="product-avatar-wrap">
                      <div className="product-letter-avatar">{item.name.charAt(0)}</div>
                      <div className="product-identity">
                        <h4>{item.name}</h4>
                        <div className="product-badges">
                          <span className="product-sku-pill">
                            <Tag size={11} /> {item.sku}
                          </span>
                          <span className="product-category-pill">{item.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="product-status-wrap">
                      <StatusBadge item={item} />
                    </div>
                  </div>

                  {/* Highlight Kondisi Stok */}
                  <div className="product-stock-highlight">
                    <div className="stock-highlight-left">
                      <span className="highlight-label">Stok Fisik Saat Ini</span>
                      <div className="highlight-quantity">
                        <strong>{item.stock}</strong>
                        <span className="unit-label">{item.unit}</span>
                      </div>
                      <span className="min-stock-hint">Batas minimum: {item.minStock} {item.unit}</span>
                    </div>

                    <div className="stock-stepper-control">
                      <span className="stepper-label">Atur Cepat Stok:</span>
                      <div className="stepper-buttons">
                        <button
                          type="button"
                          className="stepper-btn stepper-minus"
                          onClick={() => onAdjust(item, -1)}
                          disabled={Number(item.stock) <= 0}
                          title={`Kurangi 1 ${item.unit}`}
                          aria-label={`Kurangi stok ${item.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="stepper-current">{item.stock}</span>
                        <button
                          type="button"
                          className="stepper-btn stepper-plus"
                          onClick={() => onAdjust(item, 1)}
                          title={`Tambah 1 ${item.unit}`}
                          aria-label={`Tambah stok ${item.name}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bar visual rasio stok */}
                  <div className="stock-meter-wrap">
                    <div className="stock-meter-bar">
                      <span
                        className={`meter-fill meter-${status.toLowerCase()}`}
                        style={{ width: `${Math.max(5, Math.min(100, stockRatio))}%` }}
                      />
                    </div>
                    <div className="stock-meter-labels">
                      <span>Kondisi Stok: {status}</span>
                      <span>{stockRatio}% dari batas min</span>
                    </div>
                  </div>

                  {/* Grid Informasi Finansial & Harga */}
                  <div className="product-financial-grid">
                    <div className="fin-box">
                      <span className="fin-label">Harga Beli (Modal)</span>
                      <strong className="fin-value">{formatRupiah(item.buyPrice)}</strong>
                      <span className="fin-sub">per {item.unit}</span>
                    </div>
                    <div className="fin-box">
                      <span className="fin-label">Harga Jual</span>
                      <strong className="fin-value">{formatRupiah(item.sellPrice)}</strong>
                      <span className="fin-sub">per {item.unit}</span>
                    </div>
                    <div className="fin-box">
                      <span className="fin-label">Estimasi Margin</span>
                      <strong className="fin-value fin-profit">
                        +{formatRupiah(marginRp)}
                      </strong>
                      <span className="fin-sub profit-sub">+{marginPercent}% margin</span>
                    </div>
                    <div className="fin-box">
                      <span className="fin-label">Total Nilai Stok</span>
                      <strong className="fin-value">{formatRupiah(totalBuyValue)}</strong>
                      <span className="fin-sub">{item.stock} {item.unit} × beli</span>
                    </div>
                  </div>

                  {/* Detail Tambahan Operasional */}
                  <div className="product-extra-meta">
                    <div className="extra-meta-item">
                      <Truck size={14} />
                      <div>
                        <span className="meta-caption">Supplier / Pemasok</span>
                        <strong>{item.supplier || 'Belum ditentukan'}</strong>
                      </div>
                    </div>
                    <div className="extra-meta-item">
                      <Calendar size={14} />
                      <div>
                        <span className="meta-caption">Pembaruan Terakhir</span>
                        <strong>{formatDate(item.updatedAt)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Rekomendasi Khusus Berdasarkan Status */}
                  <div className={`product-recommendation rec-${status.toLowerCase()}`}>
                    {status === 'Habis' && (
                      <p>
                        <strong>Tindakan Segera:</strong> Stok habis! Segera hubungi {item.supplier} untuk memesan minimal{' '}
                        {item.minStock} {item.unit} agar menu berbasis bahan ini tetap bisa disajikan.
                      </p>
                    )}
                    {status === 'Menipis' && (
                      <p>
                        <strong>Perlu Pengadaan:</strong> Stok tersisa {item.stock} {item.unit} (di bawah batas minimum {item.minStock} {item.unit}). Siapkan PO pembelian ke {item.supplier}.
                      </p>
                    )}
                    {status === 'Aman' && (
                      <p>
                        <strong>Stok Terjaga:</strong> Persediaan cukup untuk operasional harian. Melebihi batas minimum sebesar{' '}
                        {item.stock - item.minStock} {item.unit}.
                      </p>
                    )}
                  </div>

                  {/* Footer Aksi Edit & Hapus */}
                  <div className="product-card-footer">
                    <button
                      type="button"
                      className="btn-card-action btn-edit-action"
                      onClick={() => onEdit(item)}
                    >
                      <Edit3 size={14} /> Edit Data Barang
                    </button>
                    <button
                      type="button"
                      className="btn-card-action btn-delete-action"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Rekomendasi Barang Terkait dari Kategori yang Sama */}
          {relatedItems.length > 0 && (
            <section className="search-related-section">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">REKOMENDASI TERKAIT</span>
                  <h3>Barang lain dalam kategori serupa</h3>
                  <p>Mungkin kamu juga ingin mengecek stok bahan atau perlengkapan ini.</p>
                </div>
              </div>
              <div className="related-cards-grid">
                {relatedItems.map((rel) => (
                  <div className="surface-card related-card" key={rel.id}>
                    <div className="related-card-content">
                      <div className="related-title-row">
                        <strong>{rel.name}</strong>
                        <StatusBadge item={rel} />
                      </div>
                      <span className="related-sub">{rel.sku} · {rel.category}</span>
                      <div className="related-stock-row">
                        <span>Stok: <strong>{rel.stock} {rel.unit}</strong></span>
                        <span>{formatRupiah(rel.sellPrice)}</span>
                      </div>
                    </div>
                    <div className="related-actions">
                      <button
                        type="button"
                        className="btn-link-action"
                        onClick={() => onSearchSubmit(rel.name)}
                      >
                        Detail <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        /* Empty State jika tidak ada barang yang cocok */
        <div className="surface-card search-empty-card">
          <div className="empty-icon-bubble">
            <PackageX size={38} />
          </div>
          <h3>Tidak ada barang untuk kata kunci "{query}"</h3>
          <p>
            Pastikan ejaan kata kunci sudah benar, atau coba cari berdasarkan nama bahan, kode SKU, atau kategori barang.
          </p>

          <div className="search-suggestions-box">
            <span>Saran kata kunci populer di COZZE:</span>
            <div className="suggestion-pills">
              {['Susu', 'Espresso Blend', 'Oat Milk', 'Gula Aren', 'Cup PET', 'Matcha', 'Vanilla'].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    className="suggestion-pill"
                    onClick={() => onSearchSubmit(term)}
                  >
                    <Search size={11} /> {term}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="empty-actions-row">
            <button type="button" className="btn btn-outline-cozze" onClick={onBack}>
              <ArrowLeft size={15} /> Kembali ke Halaman Utama
            </button>
            <button type="button" className="btn btn-primary-cozze" onClick={onAdd}>
              <Plus size={16} /> Tambah "{query}" sebagai Barang Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
