
export function Card({ children, className }) {
  return <div className={`p-4 rounded-xl bg-white shadow ${className}`}>{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}
