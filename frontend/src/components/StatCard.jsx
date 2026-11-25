function StatCard({ label, value, valueClassName = '' }) {
  return (
    <article className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-gray-500">{label}</h2>
      <p className={`text-3xl font-bold mt-3 ${valueClassName}`}>{value}</p>
    </article>
  )
}

export default StatCard