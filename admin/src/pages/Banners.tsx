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
  const [bannerMode, setBannerMode] = useState<"dual" | "single">("dual");
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
      form.append("mode", bannerMode);
      if (desktopFile) {
        form.append("desktopImage", desktopFile);
        if (bannerMode === "single" && !mobileFile) {
          form.append("mobileImage", desktopFile);
        }
      }
      if (bannerMode === "dual" && mobileFile) {
        form.append("mobileImage", mobileFile);
      }
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
      form.append("mode", bannerMode);
      if (desktopFile) {
        form.append("desktopImage", desktopFile);
        if (bannerMode === "single" && !mobileFile) {
          form.append("mobileImage", desktopFile);
        }
      }
      if (bannerMode === "dual" && mobileFile) {
        form.append("mobileImage", mobileFile);
      }
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
    setBannerMode("dual");
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

    const dUrl = b.desktopImageUrl || b.desktopImage;
    const mUrl = b.mobileImageUrl || b.mobileImage;
    if (!mUrl || mUrl === dUrl) {
      setBannerMode("single");
    } else {
      setBannerMode("dual");
    }

    setDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (editing) {
      updateMutation.mutate(editing.id);
    } else {
      if (!desktopFile) {
        toast.error("Desktop image is required");
        return;
      }
      if (bannerMode === "dual" && !mobileFile) {
        toast.error("Mobile image is required for Option 1 (Dual Image mode)");
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
                <div className="w-28 aspect-[1920/900] bg-muted shrink-0 overflow-hidden rounded border border-border">
                  {img(b, false) ? (
                    <img src={img(b, false)!} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center justify-center h-full">Desktop</span>
                  )}
                </div>
                <div className="w-12 aspect-[4/5] bg-muted shrink-0 overflow-hidden rounded border border-border">
                  {img(b, true) ? (
                    <img src={img(b, true)!} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center justify-center h-full">Mobile</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{b.title}</p>
                    {(!img(b, true) || img(b, true) === img(b, false)) ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">Option 2 (Single)</span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">Option 1 (Dual)</span>
                    )}
                  </div>
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{editing ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            {/* Banner Mode Selector */}
            <div className="space-y-2">
              <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                Choose Banner Type / Option *
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Option 1 Button */}
                <button
                  type="button"
                  onClick={() => setBannerMode("dual")}
                  className={`relative p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    bannerMode === "dual"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                      : "border-border bg-card hover:border-border/80 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      bannerMode === "dual" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      Option 1
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      bannerMode === "dual" ? "border-primary bg-primary" : "border-muted-foreground/40"
                    }`}>
                      {bannerMode === "dual" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Desktop + Mobile</div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      2 separate images. Optimized separately for Desktop (1920×900) & Mobile (800×1000).
                    </p>
                  </div>
                </button>

                {/* Option 2 Button */}
                <button
                  type="button"
                  onClick={() => setBannerMode("single")}
                  className={`relative p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    bannerMode === "single"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                      : "border-border bg-card hover:border-border/80 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      bannerMode === "single" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      Option 2
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      bannerMode === "single" ? "border-primary bg-primary" : "border-muted-foreground/40"
                    }`}>
                      {bannerMode === "single" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Single Banner</div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      1 Desktop image only. Automatically scales & fits on both Desktop & Mobile (16:4 / 16:7).
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <Label className="font-medium">Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Summer Collection Offer" className="mt-1.5 border-border" />
            </div>
            <div>
              <Label className="font-medium">Link URL (optional)</Label>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="mt-1.5 border-border" />
            </div>

            {/* Desktop Image */}
            <div className="space-y-1.5">
              <Label className="font-medium">
                Desktop image {editing ? "(leave empty to keep current)" : "*"}
              </Label>
              <p className="text-xs text-muted-foreground">
                Recommended Size: 1920 × 900 px · Ratio: 16:7 · Format: JPG / WEBP
              </p>
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/webp"
                onChange={(e) => setDesktopFile(e.target.files?.[0] ?? null)}
                className="mt-1 border-border"
                required={!editing}
              />
              {editing && (editing.desktopImageUrl || editing.desktopImage) && (
                <div className="mt-2">
                  <p className="text-[11px] font-medium text-muted-foreground mb-1">Current Desktop Image:</p>
                  <img src={editing.desktopImageUrl || editing.desktopImage} alt="Desktop Preview" className="w-full max-w-xs aspect-[1920/900] object-cover rounded-lg border border-border shadow-sm" />
                </div>
              )}
            </div>

            {/* Mobile Image (Option 1 vs Option 2) */}
            {bannerMode === "dual" ? (
              <div className="space-y-1.5">
                <Label className="font-medium">
                  Mobile image {editing ? "(leave empty to keep current)" : "*"}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Recommended Size: 800 × 1000 px · Ratio: 4:5 · Format: JPG / WEBP
                </p>
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/webp"
                  onChange={(e) => setMobileFile(e.target.files?.[0] ?? null)}
                  className="mt-1 border-border"
                  required={!editing}
                />
                {editing && (editing.mobileImageUrl || editing.mobileImage) && (
                  <div className="mt-2">
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Current Mobile Image:</p>
                    <img src={editing.mobileImageUrl || editing.mobileImage} alt="Mobile Preview" className="w-24 aspect-[4/5] object-cover rounded-lg border border-border shadow-sm" />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <span className="text-base shrink-0">✨</span>
                <div>
                  <strong className="font-semibold block mb-0.5">Option 2 (Single Banner) Active</strong>
                  Desktop image will automatically be used for Mobile view as well. No separate mobile upload required.
                </div>
              </div>
            )}
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
