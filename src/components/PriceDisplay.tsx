import { formatCurrency } from "@/lib/currency";

type PriceDisplayProps = {
  price: number;
  salePrice: number | null;
  size?: "sm" | "lg";
};

export function PriceDisplay({ price, salePrice, size = "sm" }: PriceDisplayProps) {
  const textSize = size === "lg" ? "text-2xl" : "text-base";
  const mutedSize = size === "lg" ? "text-lg" : "text-sm";

  if (salePrice == null) {
    return <span className={`font-semibold ${textSize}`}>{formatCurrency(price)}</span>;
  }

  return (
    <span className="flex items-baseline gap-2">
      <span className={`font-semibold text-accent ${textSize}`}>
        {formatCurrency(salePrice)}
      </span>
      <span className={`text-foreground/50 line-through ${mutedSize}`}>
        {formatCurrency(price)}
      </span>
    </span>
  );
}
