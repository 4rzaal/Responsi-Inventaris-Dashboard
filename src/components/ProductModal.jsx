import { useEffect, useState } from 'react';
import { X, PackagePlus } from 'lucide-react';
import { inventoryCategories } from '../data/initialInventory.js';

const emptyForm = {
  sku: '', name: '', category: 'Biji Kopi', stock: 0, minStock: 1,
  unit: 'pcs', buyPrice: 0, sellPrice: 0, supplier: '',
};

export default function ProductModal({ open, product, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;
    setForm(product ? { ...product } : emptyForm);
  }, [open, product]);

  if (!open) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: ['stock', 'minStock', 'buyPrice', 'sellPrice'].includes(name) ? Number(value) : value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      sku: form.sku.trim().toUpperCase(),
      name: form.name.trim(),
      supplier: form.supplier.trim() || 'Belum ditentukan',
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
        <div className="modal-heading">
          <div className="modal-title-icon"><PackagePlus size={20} /></div>
          <div><h2 id="product-modal-title">{product ? 'Edit data barang' : 'Tambah barang baru'}</h2><p>Lengkapi informasi inventaris COZZE.</p></div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Tutup modal"><X size={20} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="modal-form-grid">
            <div className="form-field">
              <label htmlFor="sku">SKU / Kode Barang</label>
              <input id="sku" name="sku" className="form-control" value={form.sku} onChange={updateField} placeholder="Contoh: ING-013" required maxLength={18} />
            </div>
            <div className="form-field">
              <label htmlFor="name">Nama Barang</label>
              <input id="name" name="name" className="form-control" value={form.name} onChange={updateField} placeholder="Nama bahan atau perlengkapan" required maxLength={60} />
            </div>
            <div className="form-field">
              <label htmlFor="category">Kategori</label>
              <select id="category" name="category" className="form-select" value={form.category} onChange={updateField}>
                {inventoryCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="supplier">Supplier</label>
              <input id="supplier" name="supplier" className="form-control" value={form.supplier} onChange={updateField} placeholder="Nama pemasok" maxLength={60} />
            </div>
            <div className="form-field">
              <label htmlFor="stock">Jumlah Stok</label>
              <input id="stock" name="stock" type="number" min="0" step="0.01" className="form-control" value={form.stock} onChange={updateField} required />
            </div>
            <div className="form-field">
              <label htmlFor="minStock">Batas Minimum Stok</label>
              <input id="minStock" name="minStock" type="number" min="0" step="0.01" className="form-control" value={form.minStock} onChange={updateField} required />
            </div>
            <div className="form-field">
              <label htmlFor="unit">Satuan</label>
              <select id="unit" name="unit" className="form-select" value={form.unit} onChange={updateField}>
                {['pcs', 'kg', 'gram', 'liter', 'ml', 'pack', 'botol', 'box', 'sachet'].map((unit) => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="buyPrice">Harga Beli (Rp)</label>
              <input id="buyPrice" name="buyPrice" type="number" min="0" className="form-control" value={form.buyPrice} onChange={updateField} required />
            </div>
            <div className="form-field form-field-wide">
              <label htmlFor="sellPrice">Harga Jual (Rp)</label>
              <input id="sellPrice" name="sellPrice" type="number" min="0" className="form-control" value={form.sellPrice} onChange={updateField} required />
            </div>
          </div>
          <div className="modal-footer-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary-cozze">{product ? 'Simpan Perubahan' : 'Simpan Barang'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
