function Card({ title, children, className = "" }) {
  return (
    <section className={`rounded-lg border-2 border-[#58A6FF] bg-[#10192b] p-4 ${className}`}>
      {title && <h3 className="mb-3 font-bold">{title}</h3>}
      {children}
    </section>
  );
}

export default Card;
