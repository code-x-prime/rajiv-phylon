import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bannersApi, type Banner } from "@/lib/api";
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
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { getApiError } from "@/lib/axios";
import { ChevronUp, ChevronDown, Pencil, Plus, AlertCircle } from "lucide-react";

export function Banners() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  const { data: list = [], isLoading, isError } = useQuery({
    queryKey: ["banners"],
    queryFn: () => bannersApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("link", link.trim());
      form.append("isActive", String(isActive));
      form.append("order", String(order));
      if (desktopFile) form.append("desktopImage", desktopFile);
      if (mobileFile) form.append("mobileImage", mobileFile);
      return bannersApi.create(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner created");
      setDialogOpen(false);
      resetForm();
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("link", link.trim());
      form.append("isActive", String(isActive));
      form.append("order", String(order));
      if (desktopFile) form.append("desktopImage", desktopFile);
      if (mobileFile) form.append("mobileImage", mobileFile);
      return bannersApi.update(id, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner updated");
      setDialogOpen(false);
      resetForm();
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => bannersApi.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Status updated");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => bannersApi.reorder(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Order updated");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bannersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setDeleteTarget(null);
      toast.success("Banner deleted");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  function resetForm() {
    setEditing(null);
    setTitle("");
    setLink("");
    setIsActive(true);
    setOrder(list.length);
    setDesktopFile(null);
    setMobileFile(null);
  }

  function openAdd() {
    resetForm();
    setOrder(list.length);
    setDialogOpen(true);
  }

  function openEdit(b: Banner) {
    setEditing(b);
    setTitle(b.title);
    setLink(b.link || "");
    setIsActive(b.isActive);
    setOrder(b.order);
    setDesktopFile(null);
    setMobileFile(null);
    setDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (editing) {
      updateMutation.mutate(editing.id);
    } else {
      if (!desktopFile || !mobileFile) {
        toast.error("Desktop and mobile images are required");
        return;
      }
      createMutation.mutate();
    }
  }

  function moveUp(index: number) {
    if (index <= 0) return;
    const next = [...list];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    reorderMutation.mutate(next.map((b) => b.id));
  }

  function moveDown(index: number) {
    if (index >= list.length - 1) return;
    const next = [...list];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    reorderMutation.mutate(next.map((b) => b.id));
  }

  const img = (b: Banner, mobile: boolean) => {
    const url = mobile ? (b.mobileImageUrl || b.mobileImage) : (b.desktopImageUrl || b.desktopImage);
    return url?.startsWith("http") ? url : null;
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <div className="border border-border bg-card">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-border rounded animate-pulse">
                <div className="w-8 h-16 bg-muted rounded" />
                <div className="w-24 h-14 bg-muted rounded" />
                <div className="w-16 h-14 bg-muted rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center gap-3 p-6 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">Failed to load banners. Please refresh the page.</p>
          </div>
        ) : list.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">No banners. Add one to show on the home page.</p>
        ) : (
          <ul className="divide-y divide-border">
            {list.map((b, index) => (
              <li key={b.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveUp(index)}
                    disabled={index === 0 || reorderMutation.isPending}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveDown(index)}
                    disabled={index === list.length - 1 || reorderMutation.isPending}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-24 h-14 bg-muted shrink-0 overflow-hidden">
                  {img(b, false) ? (
                    <img src={img(b, false)!} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center justify-center h-full">Desktop</span>
                  )}
                </div>
                <div className="w-16 h-14 bg-muted shrink-0 overflow-hidden">
                  {img(b, true) ? (
                    <img src={img(b, true)!} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center justify-center h-full">Mobile</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{b.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Order: {b.order} · {b.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toggleMutation.mutate(b.id)} disabled={toggleMutation.isPending}>
                  {b.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEdit(b)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(b)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Add"} Banner</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 border-border" />
            </div>
            <div>
              <Label>Link (optional)</Label>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="mt-1 border-border" />
            </div>
            <div>
              <Label>Desktop image {editing ? "(leave empty to keep current)" : "*"}</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-1">
                Size: 1920 × 900 px · Ratio: 16:7 · Format: JPG / WEBP · Safe area: center
              </p>
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/webp"
                onChange={(e) => setDesktopFile(e.target.files?.[0] ?? null)}
                className="mt-1 border-border"
                required={!editing}
              />
              {editing && (editing.desktopImageUrl || editing.desktopImage) && (
                <img src={editing.desktopImageUrl || editing.desktopImage} alt="" className="mt-2 h-20 object-cover border border-border" />
              )}
            </div>
            <div>
              <Label>Mobile image {editing ? "(leave empty to keep current)" : "*"}</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-1">
                Size: 800 × 1000 px · Ratio: 4:5 · Format: JPG / WEBP · Safe area: center
              </p>
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/webp"
                onChange={(e) => setMobileFile(e.target.files?.[0] ?? null)}
                className="mt-1 border-border"
                required={!editing}
              />
              {editing && (editing.mobileImageUrl || editing.mobileImage) && (
                <img src={editing.mobileImageUrl || editing.mobileImage} alt="" className="mt-2 h-20 object-cover border border-border w-20" />
              )}
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)} min={0} className="mt-1 border-border w-24" />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <span className="text-sm">Active</span>
            </label>
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
        title="Delete banner?"
        description="Images will be removed from R2. This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id); }}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
