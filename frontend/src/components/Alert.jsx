export default function Alert({ message, error }) {
  if (!message && !error) return null;
  return <div className={`msg ${error ? "err" : "ok"}`}>{error || message}</div>;
}