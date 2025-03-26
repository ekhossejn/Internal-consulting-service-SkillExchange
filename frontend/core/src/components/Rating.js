import React from "react";

function Star({ filled, halfFilled, color }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      {halfFilled && (
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77"
          fill={color}
        />
      )}
    </svg>
  );
}

function Rating({ value, color = "#FFD700" }) {
  return (
    <div className="rating" style={{ display: "flex", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          filled={value >= star}
          halfFilled={value >= star - 0.5 && value < star}
          color={color}
        />
      ))}
    </div>
  );
}

export default Rating;
