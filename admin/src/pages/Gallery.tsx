import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryApi, type GalleryItem } from "@/lib/api";
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
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

const PAGE_SIZE = 12;
const MAX_BULK_FILES = 10;

export function Gallery() {
  const queryClient = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [page, setPage] = useState(1);

  const { data: list = [], isLoading, isError } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => galleryApi.getAll(),
  });

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const paginatedList = useMemo(
    () => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [list, page]
  );

  const bulkUploadMutation = useMutation({
    mutationFn: async (filesToUpload: File[]) => {
      const results = await Promise.all(
        filesToUpload.map((file) => galleryApi.upload(file))
      );
      return results.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success(`${count} image(s) uploaded`);
      setUploadOpen(false);
      setFiles([]);
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => galleryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Image deleted");
      setDeleteTarget(null);
      if (paginatedList.length === 1 && page > 1) setPage((p) => p - 1);
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => {
      const next = [...prev, ...valid].slice(0, MAX_BULK_FILES);
      return next;
    });
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    bulkUploadMutation.mutate(files);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setUploadOpen(true)}>Bulk Upload (max {MAX_BULK_FILES})</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 p-8 text-destructive border border-destructive/20 rounded-lg bg-destructive/5">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">Failed to load gallery. Please refresh the page.</p>
        </div>
      ) : list.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">No gallery images. Use Bulk Upload to add up to {MAX_BULK_FILES} at once.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {paginatedList.map((item) => (
              <div key={item.id} className="border border-border bg-card overflow-hidden">
                <img
                  src={item.imageUrl || item.image}
                  alt={item.title || ""}
                  className="w-full aspect-square object-cover"
                />
                {item.title && <p className="p-2 text-sm border-t border-border">{item.title}</p>}
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => setDeleteTarget(item)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>

          {list.length > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-6 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, list.length)} of {list.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle>Bulk upload (max {MAX_BULK_FILES} images)</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBulkUpload} className="space-y-4 overflow-hidden">
            <div className="min-w-0 overflow-hidden">
              <Label>Select images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="mt-1 border-border"
              />
              {files.length > 0 && (
                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto overflow-x-hidden w-full min-w-0">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm w-full min-w-0">
                      <span
                        className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap block"
                        title={f.name}
                      >
                        {f.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-7 px-2 shrink-0"
                        onClick={() => removeFile(i)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {files.length} / {MAX_BULK_FILES} selected
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={files.length === 0 || bulkUploadMutation.isPending}
              >
                {bulkUploadMutation.isPending ? "Uploading…" : `Upload ${files.length} image(s)`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete image?"
        description="This will remove the image from R2 and the database."
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
