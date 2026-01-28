import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRedemptions() {
  const redemptionsQuery = trpc.redemptions.list.useQuery();
  const fundraisersQuery = trpc.fundraisers.list.useQuery();
  const updateMutation = trpc.redemptions.update.useMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedRedemption, setSelectedRedemption] = useState<any>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "release" | "reject" | null>(null);

  const redemptions = redemptionsQuery.data || [];
  const fundraisers = fundraisersQuery.data || [];

  const filteredRedemptions = redemptions.filter((r: any) => {
    const matchesSearch =
      r.checkName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.checkNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (redemption: any) => {
    setSelectedRedemption(redemption);
    setIsDetailDialogOpen(true);
  };

  const handleAction = async (type: "approve" | "release" | "reject") => {
    if (!selectedRedemption) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedRedemption.id,
        status: type === "approve" ? "approved" : type === "release" ? "released" : "rejected",
      });
      toast.success(`Redemption request ${type}d successfully`);
      setIsActionDialogOpen(false);
      setIsDetailDialogOpen(false);
      redemptionsQuery.refetch();
    } catch (error) {
      toast.error(`Failed to ${type} redemption request`);
    }
  };

  const getFundraiserName = (id: number) => {
    const fundraiser = fundraisers.find((f: any) => f.id === id);
    return fundraiser ? `${fundraiser.firstName} ${fundraiser.lastName}` : "Unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "approved":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "released":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Redemption Requests</h1>
          <p className="text-muted-foreground">Review and process fundraiser redemption requests</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search by check name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-input-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="released">Released</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-foreground">{redemptions.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {redemptions.filter((r: any) => r.status === "pending").length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Released</p>
            <p className="text-2xl font-bold text-green-600">
              {redemptions.filter((r: any) => r.status === "released").length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-foreground">
              ${redemptions.reduce((sum: number, r: any) => {
                const amount = typeof r.amount === "string" ? parseFloat(r.amount) : r.amount;
                return sum + (isNaN(amount) ? 0 : amount);
              }, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fundraiser</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Check</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {redemptionsQuery.isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="px-6 py-4">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      </tr>
                    ))
                ) : filteredRedemptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No redemption requests found
                    </td>
                  </tr>
                ) : (
                  filteredRedemptions.map((redemption: any) => (
                    <tr key={redemption.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {getFundraiserName(redemption.fundraiserId)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        ${typeof redemption.amount === "string" ? redemption.amount : redemption.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {redemption.checkNumber || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(redemption.status)}`}>
                          {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(redemption.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewDetails(redemption)}
                          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Redemption Request Details</DialogTitle>
          </DialogHeader>
          {selectedRedemption && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fundraiser</p>
                  <p className="font-medium text-foreground">
                    {getFundraiserName(selectedRedemption.fundraiserId)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="font-medium text-foreground">
                    ${typeof selectedRedemption.amount === "string" 
                      ? selectedRedemption.amount 
                      : selectedRedemption.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Check Number</p>
                  <p className="font-medium text-foreground">{selectedRedemption.checkNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Check Name</p>
                  <p className="font-medium text-foreground">{selectedRedemption.checkName || "-"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Memo</p>
                <p className="font-medium text-foreground">{selectedRedemption.checkMemo || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="font-medium text-foreground">{selectedRedemption.notes || "-"}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRedemption.status)}`}>
                    {selectedRedemption.status.charAt(0).toUpperCase() + selectedRedemption.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedRedemption.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedRedemption.status === "pending" && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setActionType("approve");
                      setIsActionDialogOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setActionType("reject");
                      setIsActionDialogOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}

              {selectedRedemption.status === "approved" && (
                <button
                  onClick={() => {
                    setActionType("release");
                    setIsActionDialogOpen(true);
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Release Check
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Approve Redemption Request"
                : actionType === "release"
                ? "Release Check"
                : "Reject Redemption Request"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {actionType === "approve"
                ? "Are you sure you want to approve this redemption request?"
                : actionType === "release"
                ? "Are you sure you want to release this check?"
                : "Are you sure you want to reject this redemption request?"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleAction(actionType!)}
                disabled={updateMutation.isPending}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  actionType === "approve"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : actionType === "release"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {updateMutation.isPending ? "Processing..." : "Confirm"}
              </button>
              <button
                onClick={() => setIsActionDialogOpen(false)}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
