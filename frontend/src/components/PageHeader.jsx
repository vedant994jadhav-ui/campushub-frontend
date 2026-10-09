export default function PageHeader({ icon, title, subtitle, from, to }) {
  return (
    <div className="page-header" style={{ "--h1": from, "--h2": to }}>
      <div className="ph-icon">{icon}</div>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}