import FundraiserLayout from "@/components/FundraiserLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function FundraiserRedemptions() {
  const { user } = useAuth();

  const fundraiserQuery = trpc.fundraisers.getByUserId.useQuery({ userId: user?.id || 0 });
  const redemptionsQuery = trpc.redemptions.getByFundraiserId.useQuery(
    { fundraiserId: fundraiserQuery.data?.id || 0 },
    { enabled: !!fundraiserQuery.data?.id }
  );
  const createMutation = trpc.redemptions.create.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    notes: "",
  });

  const redemptions = redemptionsQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !fundraiserQuery.data?.id) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        fundraiserId: fundraiserQuery.data.id,
        amount: formData.amount,
        notes: formData.notes || undefined,
      });
      toast.success("Redemption request submitted successfully");
      setFormData({ amount: "", notes: "" });
      setIsDialogOpen(false);
      redemptionsQuery.refetch();
    } catch (error) {
      toast.error("Failed to submit redemption request");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <FundraiserLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Redemption Requests</h1>
            <p className="text-muted-foreground">Submit and track your redemption requests</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors flex items-center gap-2">
                <Plus size={18} /> New Request
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Redemption Request</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Amount *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 text-foreground">$</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-input text-input-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                  />
                </div>

                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-sm text-muted-foreground">
                    Your request will be submitted with a <strong>Pending</strong> status. An administrator will review and process it.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Submitting..." : "Submit Request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-foreground">
              {redemptionsQuery.isLoading ? <Skeleton className="h-8 w-16" /> : redemptions.length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {redemptionsQuery.isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                redemptions.filter((r: any) => r.status === "pending").length
              )}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Released</p>
            <p className="text-2xl font-bold text-green-600">
              {redemptionsQuery.isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                redemptions.filter((r: any) => r.status === "released").length
              )}
            </p>
          </div>
        </div>

        {/* Redemption History */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Check</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Submitted</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {redemptionsQuery.isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-6 py-4">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      </tr>
                    ))
                ) : redemptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No redemption requests yet
                    </td>
                  </tr>
                ) : (
                  redemptions.map((redemption: any) => (
                    <tr key={redemption.id} className="hover:bg-muted/50 transition-colors">
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
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {redemption.notes ? (
                          <span title={redemption.notes} className="truncate max-w-xs">
                            {redemption.notes}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Guide */}
        <div className="p-6 rounded-lg bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-4">Request Status Guide</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 whitespace-nowrap">
                Pending
              </span>
              <p className="text-sm text-muted-foreground">Awaiting admin review</p>
            </div>
            <div className="flex gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 whitespace-nowrap">
                Approved
              </span>
              <p className="text-sm text-muted-foreground">Admin has approved</p>
            </div>
            <div className="flex gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 whitespace-nowrap">
                Released
              </span>
              <p className="text-sm text-muted-foreground">Check has been released</p>
            </div>
            <div className="flex gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 whitespace-nowrap">
                Rejected
              </span>
              <p className="text-sm text-muted-foreground">Request was denied</p>
            </div>
          </div>
        </div>
      </div>
    </FundraiserLayout>
  );
}
