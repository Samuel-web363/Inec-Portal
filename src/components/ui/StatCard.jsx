const IconUp = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 2.5V9.5M6 9.5L2.5 6M6 9.5L9.5 6"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function StatCard({
  icon,
  label,
  value,
  change,
  changeDir = 'up',
  colorClass = 'green',
  subtitle,
}) {
  return (
    <div className="stat-card sc-card">
      <div className="stat-card-top sc-top">
        {/* Icon tile */}
        <div className={`stat-card-icon sc-icon ${colorClass}`}>
          {icon}
        </div>

        {/* Change badge */}
        {change && (
          <span className={`stat-card-change sc-change ${changeDir}`}>
            {changeDir === 'up' ? <IconUp /> : <IconDown />}
            {change}
          </span>
        )}
      </div>

      {/* Values */}
      <div className="sc-body">
        <div className="stat-card-value sc-value">{value}</div>
        <div className="stat-card-label sc-label">{label}</div>
        {subtitle && <div className="sc-subtitle">{subtitle}</div>}
      </div>

      {/* Colour accent bar at bottom */}
      <div className={`sc-accent sc-accent--${colorClass}`} />
    </div>
  );
}