import { Leaf, Wheat, Fish, Sparkles } from "lucide-react";
import type { Diet } from "@/lib/meals-data";

export function DietBadge({ diet }: { diet: Diet }) {
  const map: Record<Diet, { icon: React.ElementType; className: string }> = {
    Végétarien: { icon: Leaf, className: "text-secondary bg-secondary/10 border-secondary/20" },
    Vegan: { icon: Leaf, className: "text-secondary bg-secondary/10 border-secondary/20" },
    "Sans gluten": { icon: Wheat, className: "text-primary bg-primary/10 border-primary/20" },
    Halal: { icon: Sparkles, className: "text-foreground bg-highlight/40 border-highlight" },
    "Sans lactose": { icon: Sparkles, className: "text-foreground bg-muted border-border" },
    Poisson: { icon: Fish, className: "text-secondary bg-secondary/10 border-secondary/20" },
  };
  const { icon: Icon, className } = map[diet];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${className}`}
    >
      <Icon className="w-3 h-3" />
      {diet}
    </span>
  );
}
