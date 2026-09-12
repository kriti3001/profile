"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StepIndicator from "./post-property/StepIndicator";
import Step0Role from "./post-property/Step0Role";
import Step1Basics from "./post-property/Step1Basics";
import Step2Price from "./post-property/Step2Price";
import Step3Photos from "./post-property/Step3Photos";
import Step4Trust from "./post-property/Step4Trust";
import Step5Publish from "./post-property/Step5Publish";
import Confirmation from "./post-property/Confirmation";
import { portals } from "@/data/portals";

const initialData = {
  role: "owner",
  propertyType: "",
  bhk: "",
  area: "",
  furnishing: "",
  locality: "",
  city: "",
  address: "",
  listingCount: "",
  purpose: "rent",
  price: "",
  deposit: "",
  availableFrom: "",
  photos: [],
  idDocument: "",
  generateAgreement: true,
  portals: Object.fromEntries(portals.map((p) => [p.id, true])),
};

export default function PostPropertyWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [publishing, setPublishing] = useState(false);
  const [done, setDone] = useState(false);

  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.propertyType && data.area && data.locality && data.city;
      case 2:
        return data.price && data.availableFrom;
      default:
        return true;
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const publish = () => {
    setPublishing(true);
    // Simulated network delay — TODO: replace with real publish API call.
    setTimeout(() => {
      setPublishing(false);
      setDone(true);
    }, 1200);
  };

  if (done) {
    return (
      <div className="container-page py-14">
        <Confirmation data={data} />
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-800">Post Your Property</h1>
        <p className="mt-1.5 text-sm text-black/55">It&apos;s free, and takes about 3 minutes.</p>
      </div>

      <StepIndicator current={step} />

      <div className="rounded-2xl border border-black/10 p-6 sm:p-8 bg-white">
        {step === 0 && <Step0Role data={data} update={update} />}
        {step === 1 && <Step1Basics data={data} update={update} />}
        {step === 2 && <Step2Price data={data} update={update} />}
        {step === 3 && <Step3Photos data={data} update={update} />}
        {step === 4 && <Step4Trust data={data} update={update} />}
        {step === 5 && (
          <Step5Publish data={data} update={update} onPublish={publish} publishing={publishing} />
        )}

        {step < 5 && (
          <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-5">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm font-medium text-black/55 disabled:opacity-0 hover:text-black/80"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canProceed()}
              className="flex items-center gap-1 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}
        {step === 5 && (
          <button
            type="button"
            onClick={back}
            className="mt-4 flex items-center gap-1 text-sm font-medium text-black/55 hover:text-black/80"
          >
            <ChevronLeft size={16} /> Back
          </button>
        )}
      </div>
    </div>
  );
}
