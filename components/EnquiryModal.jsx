"use client";

import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

// Mock enquiry form — no real message is sent anywhere.
// TODO: replace with real lead-creation API call feeding the dashboard Leads Inbox.
export default function EnquiryModal({ open, onClose, property }) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    property ? `Hi, I'm interested in "${property.title}". Is it still available?` : ""
  );

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const close = () => {
    onClose();
    setTimeout(() => setSent(false), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl p-6">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-black/40 hover:text-black/70"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {sent ? (
          <div className="py-6 text-center">
            <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
            <h3 className="mt-3 font-semibold text-primary-800">Enquiry Sent!</h3>
            <p className="mt-1 text-sm text-black/55">
              The {property?.postedBy?.toLowerCase()} will get back to you shortly.
            </p>
            <button
              onClick={close}
              className="mt-5 w-full rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2.5"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-primary-700">
              Contact {property?.postedBy || "Owner"}
            </h2>
            <p className="text-xs text-black/50 mt-1">
              Regarding: {property?.title}
            </p>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your Phone Number"
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold py-2.5"
              >
                Send Enquiry
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
