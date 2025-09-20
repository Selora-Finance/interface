import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  text: string;
  Icon?: LucideIcon;
}

export default function Card({ title, text, Icon }: CardProps) {
  return (
    <div className="bg-orange-600 text-white p-6 rounded-lg shadow hover:scale-105 transition">
      {Icon && <Icon className="w-8 h-8 mb-3" />}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm">{text}</p>
    </div>
  );
}
