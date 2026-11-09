export default function StatCard({ label, value, note, icon: Icon, tone = 'cream', valueClass = '' }) {
  return (
    <div className="col-6 col-xl-3">
    <article className={`stat-card card shadow-sm rounded-3 stat-${tone}`}>
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon"><Icon size={19} strokeWidth={1.8} /></span>
      </div>
      <div className={`stat-value ${valueClass}`}>{value}</div>
      <div className="stat-note">{note}</div>
    </article>
    </div>
  );
}
