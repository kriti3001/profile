"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ChevronLeft, ChevronRight, LogIn } from "lucide-react";
import StepIndicator from "./post-property/StepIndicator";
import Step0Role from "./post-property/Step0Role";
import Step1Basics from "./post-property/Step1Basics";
import Step2Price from "./post-property/Step2Price";
import Step3Photos, { PHOTO_TYPES } from "./post-property/Step3Photos";
import Step4Trust from "./post-property/Step4Trust";
import Step5Publish from "./post-property/Step5Publish";
import Confirmation from "./post-property/Confirmation";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, putToBlobStorage } from "@/lib/api";
import { portals } from "@/data/portals";
import { suggestedTitle, toCreateBody } from "@/lib/postProperty";

const initialData = {
  role: "owner",
  propertyType: "",
  bhk: "",
  area: "",
  furnishing: "",
  locality: "",
  city: "",
  address: "",
  title: "",
  description: "",
  facing: "",
  floorNumber: "",
  totalFloors: "",
  amenities: [],
  listingCount: "",
  purpose: "rent",
  price: "",
  deposit: "",
  availableFrom: "",
  photos: [], // { id, file, previewUrl, status: "pending" | "uploaded" | "failed", error? }
  idDocument: "",
  generateAgreement: true,
  portals: Object.fromEntries(portals.map((p) => [p.id, true])),
};

export default function PostPropertyWizard() {
  const { user, ready, getAccessToken } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [publishing, setPublishing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [propertyId, setPropertyId] = useState(null); // set once created, so retries never duplicate it
  const [done, setDone] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // The account's role drives step 0.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "owner" || user?.role === "broker") setData((d) => ({ ...d, role: user.role }));
  }, [user?.role]);

  // Free photo preview URLs when leaving the wizard.
  const photosRef = useRef(data.photos);
  useEffect(() => {
    photosRef.current = data.photos;
  }, [data.photos]);
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl)), []);

  const update = (patch) => setData((d) => ({ ...d, ...patch }));
  const setPhoto = (id, patch) =>
    setData((d) => ({ ...d, photos: d.photos.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));

  const canProceed = () => {
    switch (step) {
      case 1: {
        const floorsOk =
          data.floorNumber === "" || data.totalFloors === "" || Number(data.floorNumber) <= Number(data.totalFloors);
        return (
          data.propertyType && data.furnishing && Number(data.area) > 0 && data.locality.trim() && data.city.trim() &&
          (data.title.trim() || suggestedTitle(data)) && data.description.trim() && floorsOk
        );
      }
      case 2:
        return Number(data.price) > 0 && data.availableFrom;
      default:
        return true;
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  /**
   * 1. POST /properties (DRAFT)  2. per photo: SAS token -> PUT to Blob Storage -> record it
   * 3. PATCH status PUBLISHED. Photos need the property to exist (the SAS is scoped to a property you
   * own), and drafting first keeps a half-finished listing out of public view. A retry resumes: the
   * property is created once and uploaded photos are skipped. `skipFailed` publishes without them.
   */
  const publish = async ({ skipFailed = false } = {}) => {
    setPublishing(true);
    setPublishError(null);
    let id = propertyId;
    try {
      const token = await getAccessToken();
      if (!id) {
        setProgress("Creating your listing…");
        id = (await apiFetch("/properties", { method: "POST", token, body: toCreateBody(data) })).id;
        setPropertyId(id);
      } else {
        // Retry after going Back to edit: apply the current details to the draft created earlier.
        setProgress("Saving your changes…");
        const { status, ...details } = toCreateBody(data);
        await apiFetch(`/properties/${id}`, { method: "PATCH", token, body: details });
      }

      const toUpload = data.photos.filter((p) => p.status !== "uploaded" && !(skipFailed && p.status === "failed"));
      let failed = 0;
      for (const [i, photo] of toUpload.entries()) {
        setProgress(`Uploading photo ${i + 1} of ${toUpload.length}…`);
        try {
          const sas = await apiFetch("/uploads/sas-token", {
            method: "POST",
            token,
            body: {
              target: "property-photos",
              propertyId: id,
              fileName: `photo.${PHOTO_TYPES[photo.file.type]}`, // extension must match the type
              contentType: photo.file.type,
              size: photo.file.size,
            },
          });
          await putToBlobStorage(sas, photo.file);
          await apiFetch(`/properties/${id}/photos`, { method: "POST", token, body: { blobUrl: sas.blobUrl } });
          setPhoto(photo.id, { status: "uploaded", error: null });
        } catch (err) {
          if (err.status === 401) throw err; // session expired: stop, nothing else will work
          failed++;
          setPhoto(photo.id, { status: "failed", error: err.message });
        }
      }
      if (failed > 0) {
        setPublishError({
          photos: true,
          message: `${failed} photo${failed === 1 ? "" : "s"} couldn't be uploaded. Your listing is saved as a draft.`,
        });
        return;
      }

      setProgress("Publishing…");
      await apiFetch(`/properties/${id}`, { method: "PATCH", token, body: { status: "PUBLISHED" } });
      setDone(true);
    } catch (err) {
      setPublishError({
        message: err.status === 403 && !id ? "Only owner and broker accounts can post properties." : err.message,
      });
    } finally {
      setPublishing(false);
      setProgress(null);
    }
  };

  if (!ready) return <div className="container-page py-24" aria-busy="true" />;

  if (!user) {
    return (
      <div className="container-page py-24 text-center">
        <div className="max-w-sm mx-auto">
          <h1 className="text-xl font-semibold text-primary-800">Login to post your property</h1>
          <p className="mt-2 text-sm text-black/55">
            Posting is free. Sign in or create an owner or broker account to continue.
          </p>
          <button
            onClick={() => setAuthOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5"
          >
            <LogIn size={16} /> Login / Signup
          </button>
        </div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  if (user.role === "tenant") {
    return (
      <div className="container-page py-24 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-semibold text-primary-800">Posting needs an owner or broker account</h1>
          <p className="mt-2 text-sm text-black/55">
            You&apos;re signed in with a tenant account, which can browse and enquire but not list properties.
          </p>
          <Link href="/rent" className="mt-6 inline-block rounded-lg border border-black/15 text-sm font-medium px-5 py-2.5 hover:bg-black/5">
            Browse rentals
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="container-page py-14">
        <Confirmation data={data} propertyId={propertyId} />
      </div>
    );
  }

  const failedPhotos = data.photos.filter((p) => p.status === "failed");

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
          <Step5Publish data={data} update={update} onPublish={() => publish()} publishing={publishing} />
        )}

        {step === 5 && progress && (
          <p className="mt-3 text-center text-sm text-primary-700" aria-live="polite">
            {progress}
          </p>
        )}

        {step === 5 && publishError && !publishing && (
          <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
            <p className="flex items-start gap-2 font-medium text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {publishError.message}
            </p>
            {publishError.photos && (
              <>
                <ul className="mt-2 ml-6 list-disc text-xs text-red-600 space-y-0.5">
                  {failedPhotos.map((p) => (
                    <li key={p.id}>
                      {p.file.name}: {p.error}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => publish()}
                    className="rounded-lg bg-white border border-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 hover:bg-red-100"
                  >
                    Retry failed photos
                  </button>
                  <button
                    onClick={() => publish({ skipFailed: true })}
                    className="rounded-lg bg-white border border-black/15 text-black/70 text-xs font-semibold px-3 py-1.5 hover:bg-black/5"
                  >
                    Publish without them
                  </button>
                </div>
              </>
            )}
            {propertyId && !publishError.photos && (
              <p className="mt-1 ml-6 text-xs text-red-600">
                Your listing is saved as a draft. Click publish to try again, or find it in your{" "}
                <Link href="/dashboard" className="underline">dashboard</Link>.
              </p>
            )}
          </div>
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
            disabled={publishing}
            className="mt-4 flex items-center gap-1 text-sm font-medium text-black/55 hover:text-black/80 disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Back
          </button>
        )}
      </div>
    </div>
  );
}
