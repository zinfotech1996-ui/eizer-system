import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Users, Zap, CheckSquare, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const fundraisersQuery = trpc.fundraisers.list.useQuery();
  const machinesQuery = trpc.machines.list.useQuery();
  const redemptionsQuery = trpc.redemptions.list.useQuery();

  const isLoading = fundraisersQuery.isLoading || machinesQuery.isLoading || redemptionsQuery.isLoading;

  const fundraisers = fundraisersQuery.data || [];
  const machines = machinesQuery.data || [];
  const redemptions = redemptionsQuery.data || [];

  const activeFundraisers = fundraisers.filter((f: any) => f.status === "active").length;
  const assignedMachines = machines.filter((m: any) => m.status === "assigned").length;
  const pendingRedemptions = redemptions.filter((r: any) => r.status === "pending").length;
  const totalRedemptionAmount = redemptions.reduce((sum: number, r: any) => {
    const amount = typeof r.amount === "string" ? parseFloat(r.amount) : r.amount;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const stats = [
    {
      label: "Active Fundraisers",
      value: isLoading ? <Skeleton className="h-8 w-16" /> : activeFundraisers,
      icon: <Users className="w-6 h-6 text-primary" />,
      onClick: () => navigate("/admin/fundraisers"),
    },
    {
      label: "Assigned Machines",
      value: isLoading ? <Skeleton className="h-8 w-16" /> : assignedMachines,
      icon: <Zap className="w-6 h-6 text-primary" />,
      onClick: () => navigate("/admin/machines"),
    },
    {
      label: "Pending Redemptions",
      value: isLoading ? <Skeleton className="h-8 w-16" /> : pendingRedemptions,
      icon: <CheckSquare className="w-6 h-6 text-primary" />,
      onClick: () => navigate("/admin/redemptions"),
    },
    {
      label: "Total Redemption Amount",
      value: isLoading ? <Skeleton className="h-8 w-24" /> : `$${totalRedemptionAmount.toFixed(2)}`,
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      onClick: () => navigate("/admin/redemptions"),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name || "Admin"}</h1>
          <p className="text-muted-foreground">Here's an overview of your fundraising platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <button
              key={idx}
              onClick={stat.onClick}
              className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">{stat.icon}</div>
              </div>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-card border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/admin/fundraisers")}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-left"
              >
                Manage Fundraisers
              </button>
              <button
                onClick={() => navigate("/admin/machines")}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors text-left"
              >
                Manage Machines
              </button>
              <button
                onClick={() => navigate("/admin/redemptions")}
                className="w-full px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors text-left"
              >
                Process Redemptions
              </button>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Database</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">API</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Authentication</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-lg bg-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Redemption Requests</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : redemptions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No redemption requests yet</p>
          ) : (
            <div className="space-y-2">
              {redemptions.slice(0, 5).map((redemption: any) => (
                <div
                  key={redemption.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      ${typeof redemption.amount === "string" ? redemption.amount : redemption.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(redemption.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      redemption.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : redemption.status === "approved"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : redemption.status === "released"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
