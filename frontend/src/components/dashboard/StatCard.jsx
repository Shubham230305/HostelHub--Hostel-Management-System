import './DashboardComponents.css';

export default function StatCard({
  label,
  value,
  icon: Icon,
  description,
  tone = 'blue',
}) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span>{label}</span>

        <div className={`stat-icon ${tone}`}>
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      <strong className="stat-value">{value ?? 0}</strong>

      <p className="stat-description">{description}</p>
    </article>
  );
}