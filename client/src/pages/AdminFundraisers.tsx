import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminFundraisers() {
  const fundraisersQuery = trpc.fundraisers.list.useQuery();
  const createMutation = trpc.fundraisers.create.useMutation();
  const updateMutation = trpc.fundraisers.update.useMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    userId: 0,
    customerPhoneId: "",
    firstName: "",
    lastName: "",
    isFoundation: false,
    isCompany: false,
    hebrewName: "",
    email: "",
    address2: "",
    address3: "",
    address4: "",
    status: "active" as const,
  });

  const fundraisers = fundraisersQuery.data || [];
  const filteredFundraisers = fundraisers.filter(
    (f: any) =>
      f.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (fundraiser?: any) => {
    if (fundraiser) {
      setEditingId(fundraiser.id);
      setFormData(fundraiser);
    } else {
      setEditingId(null);
      setFormData({
        userId: 0,
        customerPhoneId: "",
        firstName: "",
        lastName: "",
        isFoundation: false,
        isCompany: false,
        hebrewName: "",
        email: "",
        address2: "",
        address3: "",
        address4: "",
        status: "active",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData });
        toast.success("Fundraiser updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Fundraiser created successfully");
      }
      setIsDialogOpen(false);
      fundraisersQuery.refetch();
    } catch (error) {
      toast.error("Failed to save fundraiser");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fundraisers</h1>
            <p className="text-muted-foreground">Manage all fundraisers in the system</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => handleOpenDialog()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Plus size={18} /> Add Fundraiser
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Fundraiser" : "Add New Fundraiser"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Customer Phone ID
                  </label>
                  <input
                    type="text"
                    name="customerPhoneId"
                    value={formData.customerPhoneId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Hebrew Name
                  </label>
                  <input
                    type="text"
                    name="hebrewName"
                    value={formData.hebrewName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFoundation"
                      checked={formData.isFoundation}
                      onChange={handleInputChange}
                      className="rounded border-border"
                    />
                    <span className="text-sm font-medium text-foreground">Foundation</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isCompany"
                      checked={formData.isCompany}
                      onChange={handleInputChange}
                      className="rounded border-border"
                    />
                    <span className="text-sm font-medium text-foreground">Company</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Address 2
                    </label>
                    <input
                      type="text"
                      name="address2"
                      value={formData.address2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Address 3
                    </label>
                    <input
                      type="text"
                      name="address3"
                      value={formData.address3}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address 4
                  </label>
                  <input
                    type="text"
                    name="address4"
                    value={formData.address4}
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
            placeholder="Search by name or email..."
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fundraisersQuery.isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-6 py-4">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      </tr>
                    ))
                ) : filteredFundraisers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No fundraisers found
                    </td>
                  </tr>
                ) : (
                  filteredFundraisers.map((fundraiser: any) => (
                    <tr key={fundraiser.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {fundraiser.firstName} {fundraiser.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{fundraiser.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {fundraiser.isFoundation && "Foundation"}
                        {fundraiser.isCompany && "Company"}
                        {!fundraiser.isFoundation && !fundraiser.isCompany && "Individual"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            fundraiser.status === "active"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}
                        >
                          {fundraiser.status.charAt(0).toUpperCase() + fundraiser.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenDialog(fundraiser)}
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
