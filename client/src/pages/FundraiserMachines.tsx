import FundraiserLayout from "@/components/FundraiserLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

export default function FundraiserMachines() {
  const { user } = useAuth();

  const fundraiserQuery = trpc.fundraisers.getByUserId.useQuery({ userId: user?.id || 0 });
  const machinesQuery = trpc.machines.getByFundraiserId.useQuery(
    { fundraiserId: fundraiserQuery.data?.id || 0 },
    { enabled: !!fundraiserQuery.data?.id }
  );
  const locationsQuery = trpc.machineLocations.list.useQuery();

  const isLoading = fundraiserQuery.isLoading || machinesQuery.isLoading;
  const machines = machinesQuery.data || [];
  const locations = locationsQuery.data || [];

  const getLocationName = (id?: number) => {
    if (!id) return "-";
    const location = locations.find((l: any) => l.id === id);
    return location ? location.name : "-";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "assigned":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "returned":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "inactive":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "";
    }
  };

  return (
    <FundraiserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Credit Card Machines</h1>
          <p className="text-muted-foreground">View your assigned machines and their details</p>
        </div>

        {/* Machines Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : machines.length === 0 ? (
          <div className="p-12 rounded-lg bg-card border border-border text-center">
            <p className="text-lg text-muted-foreground mb-4">No machines assigned yet</p>
            <p className="text-sm text-muted-foreground">
              Contact your administrator to request a credit card machine assignment.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine: any) => (
              <div key={machine.id} className="p-6 rounded-lg bg-card border border-border hover:border-secondary/50 transition-colors">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Machine Name</p>
                    <p className="text-lg font-semibold text-foreground">{machine.machineName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Machine Number</p>
                    <p className="font-mono text-foreground">{machine.machineNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(machine.status)}`}>
                      {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-foreground">{getLocationName(machine.locationId)}</p>
                  </div>

                  {machine.batchNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Batch Number</p>
                      <p className="font-mono text-foreground">{machine.batchNumber}</p>
                    </div>
                  )}

                  {machine.batchDate && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Batch Date</p>
                      <p className="text-foreground">
                        {new Date(machine.batchDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Information Box */}
        <div className="p-6 rounded-lg bg-secondary/10 border border-secondary/20">
          <h3 className="font-semibold text-foreground mb-2">About Your Machines</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Assigned:</strong> Machine is currently assigned to you</li>
            <li>• <strong>Returned:</strong> Machine has been returned and processed</li>
            <li>• <strong>Batch Number:</strong> Unique identifier for transaction batches</li>
            <li>• <strong>Location:</strong> Physical location where the machine is deployed</li>
          </ul>
        </div>
      </div>
    </FundraiserLayout>
  );
}
