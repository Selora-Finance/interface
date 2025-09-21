import { Button } from '../../components/Button';

export default function Hero() {
  return (
    <section className="text-center py-20 relative overflow-hidden w-full">
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-1/4 w-64 h-64 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <h1 className="text-3xl md:text-5xl font-extrabold max-w-3xl mx-auto">
        The Central Trading & Liquidity Marketplace on Fluent
      </h1>
      <p className="mt-4 text-lg text-[#fff] max-w-2xl mx-auto">
        Selora is a ve(3,3) AMM powering sustainable liquidity, governance, and incentives on Fluent network.
      </p>

      <div className="mt-6 flex justify-center gap-4">
        <Button>Join Waitlist</Button>
        <Button>Read Docs</Button>
      </div>
    </section>
  );
}
