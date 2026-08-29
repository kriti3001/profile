"use client";

import { useRef } from "react";
import { UploadCloud, X, ImageIcon } from "lucide-react";

// Mock upload UI — files are only read for their name, nothing is actually
// uploaded anywhere. TODO: replace with real storage upload (e.g. S3/GCS).
export default function Step3Photos({ data, update }) {
  const inputRef = useRef(null);

  const onFiles = (fileList) => {
    const names = Array.from(fileList).map((f) => f.name);
    update({ photos: [...data.photos, ...names] });
  };

  const removeAt = (i) => {
    update({ photos: data.photos.filter((_, idx) => idx !== i) });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-800">Photos</h2>
      <p className="text-sm text-black/50 mt-1">
        Add a few photos of your property. Listings with photos get 3x more enquiries.
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-6 w-full rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 hover:bg-primary-50 py-10 flex flex-col items-center gap-2 transition-colors"
      >
        <UploadCloud size={28} className="text-primary-500" />
        <p className="text-sm font-medium text-primary-700">Click to upload photos</p>
        <p className="text-xs text-black/40">JPG or PNG, up to 10 photos (demo — nothing is actually uploaded)</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />

      {data.photos.length > 0 && (
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {data.photos.map((name, i) => (
            <div key={`${name}-${i}`} className="relative rounded-lg overflow-hidden border border-black/10">
              <div className="h-20 w-full bg-primary-100 flex items-center justify-center">
                <ImageIcon size={18} className="text-primary-400" />
              </div>
              <p className="text-[10px] text-black/50 px-1.5 py-1 truncate bg-white">{name}</p>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
