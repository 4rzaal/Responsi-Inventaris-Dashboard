import { getStockStatus } from '../utils/inventory.js';

export default function StatusBadge({ item }) {
  const status = getStockStatus(item);
  const className = status === 'Aman' ? 'status-safe' : status === 'Menipis' ? 'status-low' : 'status-empty';
  return <span className={`status-badge ${className}`}><i />{status}</span>;
}
