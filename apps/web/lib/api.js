// Thin client for the BharosaGhar API (apps/api). Everything runs in the browser: the site is a
// static export, so no page can fetch at build time.
import { API_BASE_URL } from "./authConfig";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * fetch() against the API. `query` values may be arrays (sent as repeated params); undefined, null,
 * "" and [] are skipped. `token` adds a bearer header. Returns parsed JSON (or null for an empty body)
 * and throws ApiError with a readable message for non-2xx responses and network failures.
 */
export async function apiFetch(path, { method = "GET", query, body, token, signal } = {}) {
  const url = new URL(path, API_BASE_URL);
  for (const [key, value] of Object.entries(query ?? {})) {
    for (const v of [].concat(value)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.append(key, String(v));
    }
  }

  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError(0, "Can't reach the BharosaGhar server. Check your connection and try again.");
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) throw new ApiError(res.status, messageFor(res.status, data));
  return data;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** A message fit for the UI: the API's own validation messages for 400/409, friendly text otherwise. */
function messageFor(status, data) {
  const apiMessage = Array.isArray(data?.message) ? data.message.join(". ") : data?.message;
  switch (status) {
    case 400:
    case 409:
      return apiMessage || "Some details look invalid. Please check and try again.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return apiMessage && !/forbidden/i.test(apiMessage) ? apiMessage : "You don't have permission to do that.";
    case 404:
      return "Not found. It may have been removed or is no longer available.";
    default:
      return "Something went wrong on our side. Please try again in a moment.";
  }
}

/** Uploads a File straight to Blob Storage with a SAS URL from POST /uploads/sas-token. */
export async function putToBlobStorage(sas, file) {
  let res;
  try {
    res = await fetch(sas.uploadUrl, { method: "PUT", headers: sas.requiredHeaders, body: file });
  } catch {
    throw new ApiError(0, "Upload failed: couldn't reach storage.");
  }
  if (!res.ok) throw new ApiError(res.status, `Upload failed (storage returned ${res.status}).`);
}
