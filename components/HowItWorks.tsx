import Card from "./Card";
import { ArrowLeftRight, PiggyBank, Vote } from "lucide-react";

export default function HowItWorks() {
  const items = [
    { title: "Trade", text: "Swap any asset with low fees & deep liquidity.", icon: ArrowLeftRight },
    { title: "Earn", text: "Provide liquidity, lock $SELO, earn trading fees + emissions.", icon: PiggyBank },
    { title: "Govern", text: "Vote with veSELO, direct emissions, earn bribes.", icon: Vote },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">How it Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.title} title={item.title} text={item.text} Icon={item.icon} />
        ))}
      </div>
    </section>
  );
}
