import { ImageIcon } from "lucide-react";

// Deterministic "photo" placeholder — no real property photos in this prototype.
// Renders a consistent colored gradient + label per seed so the same property
// always looks the same across pages.
function hashSeed(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function PlaceholderImage({ seed = "default", label, className = "", iconSize = 22 }) {
  const h = hashSeed(seed);
  const hue1 = h % 360;
  const hue2 = (hue1 + 42) % 360;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${hue1} 45% 88%), hsl(${hue2} 55% 78%))`,
      }}
    >
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle,_#000_1px,_transparent_1px)] [background-size:14px_14px]" />
      <div className="relative flex flex-col items-center gap-1.5 text-center px-3">
        <ImageIcon size={iconSize} className="text-black/30" strokeWidth={1.5} />
        {label && (
          <span className="text-[11px] font-medium text-black/40 leading-tight max-w-[10rem] line-clamp-2">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
