import { Card } from '@/components';

export default function Stats() {
  const stats = [
    { label: 'Total Value Locked', value: '$0' },
    { label: 'Daily Volume', value: '$0' },
    { label: 'Daily Fees', value: '$0' },
  ];

  return (
    <section className="w-full mx-auto flex flex-col md:flex-row justify-center items-center gap-4 px-4 py-12">
      {stats.map(stat => (
        <Card
          key={stat.label}
          variant="neutral"
          className="shadow p-12 flex flex-col gap-4 justify-center items-center w-full md:w-1/4"
        >
          <h3>{stat.label}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
        </Card>
      ))}
    </section>
  );
}
