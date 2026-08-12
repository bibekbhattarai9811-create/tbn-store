import { Star } from "lucide-react";

type RatingProps = {
  value: number;
  reviewCount?: number;
};

export function Rating({ value, reviewCount }: RatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < Math.round(value);
          return (
            <Star
              key={index}
              size={14}
              className={filled ? "fill-foreground text-foreground" : "text-border-subtle"}
            />
          );
        })}
      </div>
      <span className="sr-only">{value.toFixed(1)} out of 5 stars</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-foreground/60">({reviewCount})</span>
      )}
    </div>
  );
}
