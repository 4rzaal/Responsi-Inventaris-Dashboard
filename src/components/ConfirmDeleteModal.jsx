import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDeleteModal({ item, onCancel, onConfirm }) {
  if (!item) return null;
  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
        <button className="modal-close" type="button" onClick={onCancel} aria-label="Tutup modal"><X size={19} /></button>
        <div className="delete-icon"><AlertTriangle size={24} /></div>
        <h2 id="delete-title">Hapus barang ini?</h2>
        <p>Data <strong>{item.name}</strong> ({item.sku}) akan dihapus dari daftar inventaris COZZE.</p>
        <div className="confirm-actions">
          <button type="button" className="btn btn-cancel" onClick={onCancel}>Batalkan</button>
          <button type="button" className="btn btn-danger-cozze" onClick={() => onConfirm(item)}>Ya, hapus barang</button>
        </div>
      </section>
    </div>
  );
}
