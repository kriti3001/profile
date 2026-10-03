import { Home, Building2 } from "lucide-react";

// The role comes from the signed-in account (chosen at sign-up and enforced by the API), so it's shown
// here rather than picked. It still tailors the steps below (brokers get a bulk-listing question).
export default function Step0Role({ data }) {
  const card = (role, Icon, title, text) => {
    const selected = data.role === role;
    return (
      <div
        aria-disabled={!selected}
        className={`text-left rounded-2xl border-2 p-6 ${
          selected ? "border-primary-500 bg-primary-50" : "border-black/10 opacity-50"
        }`}
      >
        <Icon size={24} className="text-primary-600" />
        <p className="mt-3 font-semibold text-primary-900">{title}</p>
        <p className="mt-1 text-sm text-black/55">{text}</p>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-800">Who&apos;s listing</h2>
      <p className="text-sm text-black/50 mt-1">
        Your account is registered as {data.role === "broker" ? "a Broker / Agent" : "a Property Owner"}. This changes a
        couple of steps below: brokers get a bulk-listing question, owners get a simpler flow.
      </p>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {card("owner", Home, "I am an Owner", "I want to list my own property — a home I own or rent out directly.")}
        {card(
          "broker",
          Building2,
          "I am a Broker / Agent",
          "I manage multiple listings for clients and want bulk tools and a leads dashboard.",
        )}
      </div>
    </div>
  );
}
