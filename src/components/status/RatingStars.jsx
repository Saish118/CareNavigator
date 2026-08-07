import React from "react";
import { Star } from "lucide-react";

export const RatingStars = ({
  rating = 4.8,
  maxRating = 5,
  reviewCount,
  size = "sm",
  interactive = false,
  onChange,
}) => {
  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="inline-flex items-center gap-1">
      {[...Array(maxRating)].map((_, i) => {
        const isFilled = i < Math.floor(rating);
        const isHalf = i === Math.floor(rating) && rating % 1 >= 0.5;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange && onChange(i + 1)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          >
            <Star
              className={`${iconSizes[size]} ${
                isFilled || isHalf
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-300"
              }`}
            />
          </button>
        );
      })}
      <span className="text-xs font-bold text-slate-700 ml-1">
        {rating} {reviewCount !== undefined && <span className="text-slate-400">({reviewCount})</span>}
      </span>
    </div>
  );
};
