import React from "react";

export function FuelPelletIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="5 2 13 13"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Two horizontal capsule bars */}
      <rect x="6" y="4" width="8" height="3" rx="1" />
      <rect x="6" y="12" width="8" height="3" rx="1" />
    </svg>
  );
}

export function ShipIcon1({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="5 0 10 10"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wide triangular ship */}
      <path d="M10 2 L14 10 L10 8 L6 10 Z" />
    </svg>
  );
}

export function ShipIcon2({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pointed rocket with small fins */}
      <path d="M10 1 L13 10 L10 8 L7 10 Z" />
      <rect x="9" y="10" width="2" height="6" />
    </svg>
  );
}

export function ShipIcon3({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 4 14 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rounded lander with thrusters */}
      <path d="M7 10 Q10 2 13 10 L13 14 L7 14 Z" />
      <rect x="7" y="14" width="2" height="3" />
      <rect x="11" y="14" width="2" height="3" />
    </svg>
  );
}

export function ShipIcon4({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="5 0 10 10"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Classic angled rocket */}
      <path d="M10 2 L14 8 L10 7 L6 8 Z" />
      <path d="M10 7 L12 12 L10 11 L8 12 Z" />
    </svg>
  );
}

export function AsteriaMoonIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle with crater details */}
      <circle cx="10" cy="10" r="8" />
      <circle cx="7" cy="7" r="2" fill="white" />
      <circle cx="13" cy="11" r="1" fill="white" />
      <circle cx="11" cy="14" r="1" fill="white" />
    </svg>
  );
}
