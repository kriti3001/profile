import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata = { title: "Dashboard | BharosaGhar" };

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
