export default function Empty({ icon = "📭", text }) {
  return (
    <div className="empty">
      <span className="big">{icon}</span>
      {text}
    </div>
  );
}