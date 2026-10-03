"use client";

import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

// Sends an enquiry with POST /properties/:id/enquiries. Public: no account needed.
export default function EnquiryModal({ open, onClose, property }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    property ? `Hi, I'm interested in "${property.title}". Is it still available?` : ""
  );

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await apiFetch(`/properties/${encodeURIComponent(property.id)}/enquiries`, {
        method: "POST",
        body: { tenantName: name.trim(), tenantContact: phone.trim(), message: message.trim() || undefined },
      });
      setSent(true);
    } catch (err) {
      setError(
        err.status === 404
          ? "This listing is no longer available for enquiries."
          : err.message
      );
    } finally {
      setSending(false);
    }
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setSent(false);
      setError(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl p-6" role="dialog" aria-modal="true" aria-label="Send enquiry">
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
              The lister will get back to you shortly.
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
            <h2 className="text-lg font-semibold text-primary-700">Contact the lister</h2>
            <p className="text-xs text-black/50 mt-1">
              Regarding: {property?.title}
            </p>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <input
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                aria-label="Your Name"
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <input
                type="tel"
                required
                maxLength={150}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your Phone Number"
                aria-label="Your Phone Number"
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <textarea
                rows={3}
                maxLength={2000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-label="Message"
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              />
              {error && (
                <p role="alert" className="text-xs text-red-600">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-lg bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5"
              >
                {sending ? "Sending…" : "Send Enquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
