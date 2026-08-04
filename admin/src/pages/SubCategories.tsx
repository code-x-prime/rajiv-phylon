import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, subCategoriesApi, type SubCategory } from "@/lib/api";
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
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {};

const COLOR_PALETTE = [
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-pink-100 text-pink-700 border-pink-200",
];

function getCategoryColor(id: string, index: number): string {
  if (!CATEGORY_COLORS[id]) {
    CATEGORY_COLORS[id] = COLOR_PALETTE[index % COLOR_PALETTE.length];
  }
  return CATEGORY_COLORS[id];
}

export function SubCategories() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SubCategory | null>(null);
  const [name, setName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubCategory | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: allSubCategories = [], isLoading } = useQuery({
    queryKey: ["subcategories", "all"],
    queryFn: () => subCategoriesApi.getAll(),
  });

  const grouped = useMemo(() => {
    const map = new Map<string, SubCategory[]>();
    for (const cat of categories) {
      map.set(cat.id, []);
    }
    for (const sub of allSubCategories) {
      const arr = map.get(sub.categoryId);
      if (arr) arr.push(sub);
    }
    return map;
  }, [categories, allSubCategories]);

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

  const openAdd = (catId?: string) => {
    resetForm();
    setFormCategoryId(catId || categories[0]?.id || "");
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

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">SubCategories</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {allSubCategories.length} subcategories across {categories.length} categories
            </p>
          </div>
          <Button onClick={() => openAdd()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add SubCategory
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-9 bg-gray-100 rounded-full w-24" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No categories found. Create categories first.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {categories.map((cat, catIndex) => {
              const subs = grouped.get(cat.id) || [];
              const colorClass = getCategoryColor(cat.id, catIndex);
              return (
                <div
                  key={cat.id}
                  className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Category header */}
                  <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50/80 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[13px] font-heading font-bold border ${colorClass}`}>
                        {cat.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {subs.length} subcategories
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => openAdd(cat.id)}
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>

                  {/* Subcategories */}
                  <div className="p-4">
                    {subs.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-2">
                        No subcategories yet
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {subs.map((sub) => (
                          <div
                            key={sub.id}
                            className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                          >
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-heading font-semibold border ${colorClass}`}>
                              {sub.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {sub.slug}
                            </span>
                            <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEdit(sub)}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(sub)}
                                className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
