export default function Stats() {
  const stats = [
    { label: "Total Value Locked", value: "$0" },
    { label: "Daily Volume", value: "$0" },
    { label: "Daily Fees", value: "$0" },
  ];

  return (
    <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-12">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white shadow rounded-lg p-6 text-center border border-gray-200"
        >
          <h3 className="text-2xl font-bold">{stat.value}</h3>
          <p className="text-gray-600">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
