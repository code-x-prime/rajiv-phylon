import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, type Category } from "@/lib/api";
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
import { toast } from "sonner";
import { getApiError } from "@/lib/axios";

export function Categories() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [showOnHome, setShowOnHome] = useState(false);
  const [homeOrder, setHomeOrder] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: () => categoriesApi.create(name.trim(), image ?? undefined, showOnHome, homeOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
      setDialogOpen(false);
      resetForm();
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const updateMutation = useMutation({
    mutationFn: () => categoriesApi.update(editing!.id, name.trim(), image ?? undefined, showOnHome, homeOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
      setDialogOpen(false);
      resetForm();
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
      setDeleteTarget(null);
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  function resetForm() {
    setEditing(null);
    setName("");
    setImage(null);
    setShowOnHome(false);
    setHomeOrder(0);
  }

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };
  const openEdit = (row: Category) => {
    setEditing(row);
    setName(row.name);
    setImage(null);
    setShowOnHome(row.showOnHome ?? false);
    setHomeOrder(row.homeOrder ?? 0);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editing) updateMutation.mutate();
    else createMutation.mutate();
  };

  const columns = [
    {
      id: "image",
      header: "Image",
      cell: (row: Category) =>
        row.imageUrl ? (
          <img src={row.imageUrl} alt={row.name} className="h-10 w-10 object-cover border border-border" />
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    { id: "name", header: "Name", sortKey: "name" as const, cell: (row: Category) => row.name },
    { id: "slug", header: "Slug", sortKey: "slug" as const, cell: (row: Category) => row.slug },
    {
      id: "home",
      header: "On Home",
      cell: (row: Category) =>
        row.showOnHome ? (
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Yes (order: {row.homeOrder ?? 0})</span>
        ) : (
          <span className="text-muted-foreground text-xs">No</span>
        ),
    },
  ];

  return (
    <>
      <DataTable<Category>
        data={list}
        columns={columns}
        searchPlaceholder="Search categories..."
        searchKey="name"
        addButton={{ label: "Add Category", onClick: openAdd }}
        onEdit={openEdit}
        onDelete={(row) => setDeleteTarget(row)}
        isLoading={isLoading}
        initialSortKey="name"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Add"} Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" required className="mt-1 border-border" />
            </div>
            <div>
              <Label>Image (optional)</Label>
              {editing?.imageUrl && (
                <div className="mt-1 mb-2">
                  <p className="text-xs text-muted-foreground mb-1">Current image</p>
                  <img src={editing.imageUrl} alt={editing.name} className="h-20 w-20 object-cover border border-border" />
                </div>
              )}
              <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="mt-1 border-border" />
              {editing?.imageUrl && <p className="text-xs text-muted-foreground mt-1">Choose a new file to replace</p>}
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showOnHome} onChange={(e) => setShowOnHome(e.target.checked)} className="border-border" />
                <span className="text-sm">Show on Home page</span>
              </label>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Home order</Label>
                <Input type="number" value={homeOrder} onChange={(e) => setHomeOrder(parseInt(e.target.value, 10) || 0)} min={0} className="w-20 border-border" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete category?"
        description="This will delete subcategories and unlink products. This action cannot be undone."
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
