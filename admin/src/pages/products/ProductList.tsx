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

  const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

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
      id: "createdAt",
      header: "Created",
      sortKey: "createdAt" as const,
      cell: (row: Product) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"),
    },
  ];

  return (
    <>
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
