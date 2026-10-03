"use client";

import { useState } from "react";
import PlaceholderImage from "./PlaceholderImage";

// A listing photo from Blob Storage, falling back to the generated placeholder when the listing
// has no photos or the image fails to load.
export default function PropertyImage({ src, seed, label, alt, className = "", iconSize }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <PlaceholderImage seed={seed} label={label} className={className} iconSize={iconSize} />;
  }
  return (
    // Plain <img>: the static export has no image optimizer (images.unoptimized).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? label ?? ""}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
