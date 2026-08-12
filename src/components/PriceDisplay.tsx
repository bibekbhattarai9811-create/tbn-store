const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type PriceDisplayProps = {
  price: number;
  salePrice: number | null;
  size?: "sm" | "lg";
};

export function PriceDisplay({ price, salePrice, size = "sm" }: PriceDisplayProps) {
  const textSize = size === "lg" ? "text-2xl" : "text-base";
  const mutedSize = size === "lg" ? "text-lg" : "text-sm";

  if (salePrice == null) {
    return <span className={`font-semibold ${textSize}`}>{currencyFormatter.format(price)}</span>;
  }

  return (
    <span className="flex items-baseline gap-2">
      <span className={`font-semibold text-accent ${textSize}`}>
        {currencyFormatter.format(salePrice)}
      </span>
      <span className={`text-foreground/50 line-through ${mutedSize}`}>
        {currencyFormatter.format(price)}
      </span>
    </span>
  );
}
