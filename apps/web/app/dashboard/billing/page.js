import PricingTable from "@/components/PricingTable";

export default function BillingPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-primary-800">Plans & Billing</h1>
      <p className="text-sm text-black/50 mt-1">Manage your subscription and view usage.</p>

      <div className="mt-8">
        <PricingTable currentPlan="growth" />
      </div>
    </div>
  );
}
