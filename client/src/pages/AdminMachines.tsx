import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Edit2, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminMachines() {
  const machinesQuery = trpc.machines.list.useQuery();
  const fundraisersQuery = trpc.fundraisers.list.useQuery();
  const locationsQuery = trpc.machineLocations.list.useQuery();
  const createMutation = trpc.machines.create.useMutation();
  const updateMutation = trpc.machines.update.useMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fundraiserId: undefined as number | undefined,
    machineName: "",
    machineNumber: "",
    batchNumber: "",
    locationId: undefined as number | undefined,
    status: "available" as const,
  });

  const machines = machinesQuery.data || [];
  const fundraisers = fundraisersQuery.data || [];
  const locations = locationsQuery.data || [];

  const filteredMachines = machines.filter(
    (m: any) =>
      m.machineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.machineNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (machine?: any) => {
    if (machine) {
      setEditingId(machine.id);
      setFormData({
        fundraiserId: machine.fundraiserId,
        machineName: machine.machineName,
        machineNumber: machine.machineNumber,
        batchNumber: machine.batchNumber || "",
        locationId: machine.locationId,
        status: machine.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        fundraiserId: undefined,
        machineName: "",
        machineNumber: "",
        batchNumber: "",
        locationId: undefined,
        status: "available",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData });
        toast.success("Machine updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Machine created successfully");
      }
      setIsDialogOpen(false);
      machinesQuery.refetch();
    } catch (error) {
      toast.error("Failed to save machine");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "fundraiserId" || name === "locationId" 
        ? value ? parseInt(value) : undefined 
        : value,
    }));
  };

  const getFundraiserName = (id?: number) => {
    if (!id) return "Unassigned";
    const fundraiser = fundraisers.find((f: any) => f.id === id);
    return fundraiser ? `${fundraiser.firstName} ${fundraiser.lastName}` : "Unknown";
  };

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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Credit Card Machines</h1>
            <p className="text-muted-foreground">Manage machine inventory and assignments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => handleOpenDialog()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Plus size={18} /> Add Machine
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Machine" : "Add New Machine"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Machine Name
                    </label>
                    <input
                      type="text"
                      name="machineName"
                      value={formData.machineName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Machine Number
                    </label>
                    <input
                      type="text"
                      name="machineNumber"
                      value={formData.machineNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Assign to Fundraiser
                    </label>
                    <select
                      name="fundraiserId"
                      value={formData.fundraiserId || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Unassigned</option>
                      {fundraisers.map((f: any) => (
                        <option key={f.id} value={f.id}>
                          {f.firstName} {f.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Location
                    </label>
                    <select
                      name="locationId"
                      value={formData.locationId || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select Location</option>
                      {locations.map((l: any) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="available">Available</option>
                      <option value="assigned">Assigned</option>
                      <option value="returned">Returned</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {editingId ? "Update" : "Create"}
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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search by name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-input-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Machine Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Assigned To</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {machinesQuery.isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="px-6 py-4">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      </tr>
                    ))
                ) : filteredMachines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No machines found
                    </td>
                  </tr>
                ) : (
                  filteredMachines.map((machine: any) => (
                    <tr key={machine.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{machine.machineName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{machine.machineNumber}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {getFundraiserName(machine.fundraiserId)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {getLocationName(machine.locationId)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.status)}`}>
                          {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenDialog(machine)}
                          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                        >
                          <Edit2 size={16} />
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
    </AdminLayout>
  );
}
