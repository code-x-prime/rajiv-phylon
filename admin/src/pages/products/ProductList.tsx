import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, type Product } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useState } from "react";
import { toast } from "sonner";
import { getApiError } from "@/lib/axios";

export function ProductList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "DRAFT" | "PUBLISHED">("all");

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
      setDeleteTarget(null);
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const filtered = statusFilter === "all"
    ? list
    : list.filter((p) => (p.status || "PUBLISHED") === statusFilter);
  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  const columns = [
    {
      id: "image",
      header: "Image",
      cell: (row: Product) => {
        const src = row.images?.[0]?.url;
        return src ? (
          <img src={src} alt={row.name} className="h-12 w-12 object-cover border border-border shrink-0" />
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        );
      },
    },
    { id: "name", header: "Name", sortKey: "name" as const, cell: (row: Product) => row.name },
    { id: "category", header: "Categories", cell: (row: Product) => (row.categories?.length ? row.categories.map((c) => c.name).join(", ") : "—") },
    { id: "subcategory", header: "SubCategories", cell: (row: Product) => (row.subCategories?.length ? row.subCategories.map((s) => s.name).join(", ") : "—") },
    {
      id: "status",
      header: "Status",
      sortKey: "status" as const,
      cell: (row: Product) => {
        const isDraft = (row.status || "PUBLISHED") === "DRAFT";
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isDraft ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
            {isDraft ? "Draft" : "Published"}
          </span>
        );
      },
    },
    {
      id: "createdAt",
      header: "Created",
      sortKey: "createdAt" as const,
      cell: (row: Product) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"),
    },
  ];

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        {(["all", "PUBLISHED", "DRAFT"] as const).map((opt) => (
          <button key={opt} onClick={() => setStatusFilter(opt)}
            className={`px-3 py-1 text-sm rounded border ${statusFilter === opt ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
            {opt === "all" ? "All" : opt === "DRAFT" ? "Drafts" : "Published"}
          </button>
        ))}
      </div>

      <DataTable<Product>
        data={sorted}
        columns={columns}
        searchPlaceholder="Search products..."
        searchKey="name"
        addButton={{ label: "Add Product", onClick: () => navigate("/products/add") }}
        onEdit={(row) => navigate(`/products/edit/${row.id}`)}
        onDelete={(row) => setDeleteTarget(row)}
        isLoading={isLoading}
        initialSortKey="name"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete product?"
        description="This will remove all product images from R2 and delete the product. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
