"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

export const PHOTO_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
export const MAX_PHOTOS = 20;

// Picks photos and previews them locally. They're uploaded to Blob Storage when the listing is
// published (PostPropertyWizard), because uploads need the property to exist first.
export default function Step3Photos({ data, update }) {
  const inputRef = useRef(null);
  const [rejected, setRejected] = useState([]);
  // Preview URLs are revoked when removed here, and by PostPropertyWizard when it unmounts
  // (not on this step's unmount: going Back to this step must still show them).

  const onFiles = (fileList) => {
    const problems = [];
    const accepted = [];
    for (const file of Array.from(fileList)) {
      if (!PHOTO_TYPES[file.type]) problems.push(`${file.name}: only JPG, PNG or WebP images`);
      else if (file.size > MAX_PHOTO_BYTES) problems.push(`${file.name}: larger than 10 MB`);
      else if (data.photos.length + accepted.length >= MAX_PHOTOS) problems.push(`${file.name}: a listing can have at most ${MAX_PHOTOS} photos`);
      else accepted.push({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file), status: "pending" });
    }
    setRejected(problems);
    if (accepted.length) update({ photos: [...data.photos, ...accepted] });
  };

  const removeAt = (i) => {
    URL.revokeObjectURL(data.photos[i].previewUrl);
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
        <p className="text-sm font-medium text-primary-700">Click to add photos</p>
        <p className="text-xs text-black/40">
          JPG, PNG or WebP, up to 10 MB each, max {MAX_PHOTOS}. Uploaded when you publish.
        </p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={Object.keys(PHOTO_TYPES).join(",")}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onFiles(e.target.files);
          e.target.value = ""; // allow picking the same file again after removing it
        }}
      />

      {rejected.length > 0 && (
        <ul role="alert" className="mt-3 text-xs text-red-600 space-y-0.5">
          {rejected.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      {data.photos.length > 0 && (
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {data.photos.map((photo, i) => (
            <div key={photo.id} className="relative rounded-lg overflow-hidden border border-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview */}
              <img src={photo.previewUrl} alt={photo.file.name} className="h-20 w-full object-cover" />
              <p className="text-[10px] text-black/50 px-1.5 py-1 truncate bg-white">{photo.file.name}</p>
              {photo.status !== "uploaded" && (
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                  aria-label={`Remove ${photo.file.name}`}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
