"use client";

import { useRef } from "react";
import { UploadCloud, FileCheck2 } from "lucide-react";
import VerifiedBadge from "../VerifiedBadge";

// Mock ID upload — no document is actually processed or stored.
// TODO: replace with real ID verification pipeline before granting the Verified badge.
export default function Step4Trust({ data, update }) {
  const inputRef = useRef(null);

  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-800">Trust & Verification</h2>
      <p className="text-sm text-black/50 mt-1">
        Verified listings get priority placement and build tenant confidence.
      </p>

      <div className="mt-6">
        <p className="text-sm font-medium text-black/70 mb-1.5">Government ID (for verification)</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/50 hover:bg-primary-50 py-6 flex items-center justify-center gap-2.5 transition-colors"
        >
          {data.idDocument ? (
            <>
              <FileCheck2 size={20} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">{data.idDocument}</span>
            </>
          ) : (
            <>
              <UploadCloud size={20} className="text-primary-500" />
              <span className="text-sm font-medium text-primary-700">Upload Aadhaar / PAN (demo only)</span>
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && update({ idDocument: e.target.files[0].name })}
        />
      </div>

      <label className="mt-6 flex items-start gap-3 rounded-xl border border-black/10 p-4 cursor-pointer">
        <input
          type="checkbox"
          checked={data.generateAgreement}
          onChange={(e) => update({ generateAgreement: e.target.checked })}
          className="mt-0.5 accent-primary-500 w-4 h-4"
        />
        <span>
          <span className="block text-sm font-medium text-primary-900">
            Generate a rental agreement automatically
          </span>
          <span className="block text-xs text-black/50 mt-0.5">
            We&apos;ll pre-fill a standard rent agreement template with your listing details once a tenant is confirmed.
          </span>
        </span>
      </label>

      <div className="mt-6 rounded-xl bg-primary-50 border border-primary-100 p-4 flex items-center gap-3">
        <VerifiedBadge size="md" />
        <p className="text-xs text-primary-700">
          This is how your listing will look once verification is complete (usually within 24 hours).
        </p>
      </div>
    </div>
  );
}
