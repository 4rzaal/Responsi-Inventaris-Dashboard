import { Edit3, Trash2, Plus, Minus, PackageOpen } from 'lucide-react';
import { formatRupiah, formatDate } from '../utils/inventory.js';
import StatusBadge from './StatusBadge.jsx';

export default function InventoryTable({ items, onEdit, onDelete, onAdjust, compact = false }) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><PackageOpen size={27} /></div>
        <strong>Barang tidak ditemukan</strong>
        <span>Coba ubah kata kunci atau filter yang digunakan.</span>
      </div>
    );
  }

  return (
    <div className="table-responsive inventory-table-wrap">
      <table className="table table-hover inventory-table align-middle mb-0">
        <thead>
          <tr>
            <th>BARANG</th>
            <th>KATEGORI</th>
            <th>STOK</th>
            <th>STATUS</th>
            <th>HARGA BELI / JUAL</th>
            {!compact && <th>UPDATE TERAKHIR</th>}
            <th className="text-end">AKSI</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="product-cell">
                  <div className={`product-thumb thumb-${item.category === 'Packaging' ? 'pack' : item.category === 'Biji Kopi' ? 'bean' : 'ingredient'}`}>
                    <span>{item.name.trim().charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="product-copy">
                    <strong>{item.name}</strong>
                    <span>{item.sku}</span>
                  </div>
                </div>
              </td>
              <td><span className="category-text">{item.category}</span></td>
              <td><div className="stock-number">{item.stock} <span>{item.unit}</span></div><div className="stock-minimum">Min. {item.minStock} {item.unit}</div></td>
              <td><StatusBadge item={item} /></td>
              <td>
                <div className="price-cell"><strong>{formatRupiah(item.buyPrice)}</strong><span>Jual {formatRupiah(item.sellPrice)}</span></div>
              </td>
              {!compact && <td><span className="date-cell">{formatDate(item.updatedAt)}</span></td>}
              <td>
                <div className="table-actions">
                  <button className="quick-adjust" type="button" title="Kurangi 1 stok" aria-label={`Kurangi stok ${item.name}`} onClick={() => onAdjust(item, -1)}><Minus size={13} /></button>
                  <button className="quick-adjust" type="button" title="Tambah 1 stok" aria-label={`Tambah stok ${item.name}`} onClick={() => onAdjust(item, 1)}><Plus size={13} /></button>
                  <button className="action-button" type="button" title="Edit barang" aria-label={`Edit ${item.name}`} onClick={() => onEdit(item)}><Edit3 size={15} /></button>
                  <button className="action-button action-delete" type="button" title="Hapus barang" aria-label={`Hapus ${item.name}`} onClick={() => onDelete(item)}><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
