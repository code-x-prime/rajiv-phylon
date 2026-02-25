import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, subCategoriesApi, type SubCategory } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getApiError } from "@/lib/axios";

export function SubCategories() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SubCategory | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("__all__");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubCategory | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  // Fetch ALL subcategories (new endpoint)
  const { data: allSubCategories = [], isLoading } = useQuery({
    queryKey: ["subcategories", "all"],
    queryFn: () => subCategoriesApi.getAll(),
  });

  // Client-side filter by selected category
  const list = useMemo(() => {
    if (categoryId === "__all__") return allSubCategories;
    return allSubCategories.filter((s) => s.categoryId === categoryId);
  }, [allSubCategories, categoryId]);

  const createMutation = useMutation({
    mutationFn: () => subCategoriesApi.create(name.trim(), formCategoryId, image ?? undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast.success("SubCategory created");
      setDialogOpen(false);
      resetForm();
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const updateMutation = useMutation({
    mutationFn: () => subCategoriesApi.update(editing!.id, { name: name.trim() }, image ?? undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast.success("SubCategory updated");
      setDialogOpen(false);
      resetForm();
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => subCategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast.success("SubCategory deleted");
      setDeleteTarget(null);
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  function resetForm() {
    setEditing(null);
    setName("");
    setImage(null);
  }

  const openAdd = () => {
    resetForm();
    setFormCategoryId(categoryId !== "__all__" ? categoryId : (categories[0]?.id ?? ""));
    setDialogOpen(true);
  };
  const openEdit = (row: SubCategory) => {
    setEditing(row);
    setName(row.name);
    setFormCategoryId(row.categoryId);
    setImage(null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !formCategoryId) {
      toast.error("Name and category are required");
      return;
    }
    if (editing) updateMutation.mutate();
    else createMutation.mutate();
  };

  const columns = [
    {
      id: "image",
      header: "Image",
      cell: (row: SubCategory) =>
        row.imageUrl ? (
          <img src={row.imageUrl} alt={row.name} className="h-10 w-10 object-cover border border-border rounded" />
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    { id: "name", header: "Name", sortKey: "name" as const, cell: (row: SubCategory) => row.name },
    { id: "slug", header: "Slug", sortKey: "slug" as const, cell: (row: SubCategory) => row.slug },
    {
      id: "category",
      header: "Category",
      cell: (row: SubCategory) =>
        row.category?.name ?? categories.find((c) => c.id === row.categoryId)?.name ?? "—",
    },
  ];

  return (
    <>
      <div className="space-y-4">
        {/* Category filter (client-side) */}
        <div className="flex gap-4 items-center">
          <div className="w-64">
            <Label>Filter by Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="border-border mt-1">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All categories ({allSubCategories.length})</SelectItem>
                {categories.map((c) => {
                  const count = allSubCategories.filter((s) => s.categoryId === c.id).length;
                  return (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({count})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable<SubCategory>
          data={list}
          columns={columns}
          searchPlaceholder="Search subcategories..."
          searchKey="name"
          addButton={{ label: "Add SubCategory", onClick: openAdd }}
          onEdit={openEdit}
          onDelete={(row) => setDeleteTarget(row)}
          isLoading={isLoading}
          emptyMessage={
            categoryId === "__all__"
              ? "No subcategories yet. Click 'Add SubCategory' to create one."
              : "No subcategories in this category."
          }
          initialSortKey="name"
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Add"} SubCategory</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Category *</Label>
              <Select
                value={formCategoryId}
                onValueChange={setFormCategoryId}
                required
                disabled={!!editing}
              >
                <SelectTrigger className="border-border mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editing && (
                <p className="text-xs text-muted-foreground mt-1">Category cannot be changed after creation.</p>
              )}
            </div>
            <div>
              <Label>Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="SubCategory name"
                required
                className="mt-1 border-border"
              />
            </div>
            <div>
              <Label>Image (optional)</Label>
              {editing?.imageUrl && (
                <div className="mt-1 mb-2">
                  <p className="text-xs text-muted-foreground mb-1">Current image</p>
                  <img
                    src={editing.imageUrl}
                    alt={editing.name}
                    className="h-20 w-20 object-cover border border-border rounded"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="mt-1 border-border"
              />
              {editing?.imageUrl && (
                <p className="text-xs text-muted-foreground mt-1">Choose a new file to replace the current image.</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving…"
                  : editing
                  ? "Update"
                  : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete subcategory?"
        description={`"${deleteTarget?.name}" will be removed and products will be unlinked. This cannot be undone.`}
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
