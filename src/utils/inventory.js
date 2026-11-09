import { initialInventory } from '../data/initialInventory.js';

const STORAGE_KEY = 'cozze-inventory-v1';

export function loadInventory() {
  try {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    if (!savedItems) return initialInventory;
    const parsedItems = JSON.parse(savedItems);
    return Array.isArray(parsedItems) ? parsedItems : initialInventory;
  } catch (error) {
    console.warn('Data COZZE tidak dapat dibaca, memakai data awal.', error);
    return initialInventory;
  }
}

export function saveInventory(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Data COZZE tidak dapat disimpan di browser.', error);
  }
}

// Kondisi stok mengikuti batas minimum yang ditentukan pada tiap barang.
export function getStockStatus(item) {
  if (Number(item.stock) <= 0) return 'Habis';
  if (Number(item.stock) <= Number(item.minStock)) return 'Menipis';
  return 'Aman';
}

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

export function getInventorySummary(items) {
  const summary = items.reduce(
    (result, item) => {
      const status = getStockStatus(item);
      result.totalUnits += Number(item.stock) || 0;
      result.stockValue += (Number(item.stock) || 0) * (Number(item.buyPrice) || 0);
      if (status === 'Menipis') result.lowStock += 1;
      if (status === 'Habis') result.outOfStock += 1;
      return result;
    },
    { totalUnits: 0, stockValue: 0, lowStock: 0, outOfStock: 0 },
  );

  return { ...summary, totalItems: items.length, needsRestock: summary.lowStock + summary.outOfStock };
}

export function createCsv(items) {
  const headers = ['SKU', 'Nama Barang', 'Kategori', 'Stok', 'Stok Minimum', 'Satuan', 'Harga Beli', 'Harga Jual', 'Status', 'Supplier'];
  const rows = items.map((item) => [
    item.sku,
    item.name,
    item.category,
    item.stock,
    item.minStock,
    item.unit,
    item.buyPrice,
    item.sellPrice,
    getStockStatus(item),
    item.supplier,
  ]);
  const escapeCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');
}
