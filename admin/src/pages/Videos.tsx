import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { videosApi, type Video } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Upload,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Video as VideoIcon,
  Replace,
  X,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

function formatFileSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Videos() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: videosApi.getAll,
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => videosApi.reorder(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Order updated");
    },
    onError: () => toast.error("Failed to reorder"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => videosApi.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => videosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Video deleted");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete video"),
  });

  // Drag and drop reorder
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const reordered = [...videos];
    const [removed] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, removed);

    dragItem.current = null;
    dragOverItem.current = null;

    reorderMutation.mutate(reordered.map((v) => v.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Videos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage home page carousel videos (max 2GB each)
          </p>
        </div>
        <Button onClick={() => { setShowAdd(true); setEditingId(null); }} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Add / Edit Form */}
      {(showAdd || editingId) && (
        <VideoForm
          video={editingId ? videos.find((v) => v.id === editingId) : undefined}
          onSuccess={() => { setShowAdd(false); setEditingId(null); }}
          onCancel={() => { setShowAdd(false); setEditingId(null); }}
        />
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse">
              <div className="aspect-video bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Videos Grid */}
      {!isLoading && videos.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <VideoIcon className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No videos yet</p>
          <p className="text-sm mt-1">Upload your first video to show on the homepage</p>
        </div>
      )}

      {!isLoading && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <div
              key={video.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`group relative rounded-lg border bg-card overflow-hidden transition-all cursor-grab active:cursor-grabbing ${
                dragItem.current === index ? "opacity-50 scale-95" : ""
              }`}
            >
              {/* Drag handle */}
              <div className="absolute top-2 left-2 z-20 bg-black/60 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-white" />
              </div>

              {/* Position badge */}
              <div className="absolute top-2 right-2 z-20 bg-black/60 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>

              {/* Video preview */}
              <div className="aspect-video bg-black relative">
                <video
                  src={video.videoUrlResolved || video.videoUrl}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                {!video.isActive && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">INACTIVE</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{video.title}</h3>
                {video.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{video.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(video.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 p-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleMutation.mutate(video.id)}
                  title={video.isActive ? "Deactivate" : "Activate"}
                >
                  {video.isActive ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setEditingId(video.id); setShowAdd(false); }}
                  title="Edit"
                >
                  <Replace className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(video.id)}
                  title="Delete"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => { if (!o) setDeleteId(null); }}
        title="Delete Video"
        description="This will permanently delete the video from the server and R2 storage."
        onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId); }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

// Video Form (Add / Edit)
function VideoForm({ video, onSuccess, onCancel }: { video?: Video; onSuccess: () => void; onCancel: () => void }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(video?.title ?? "");
  const [description, setDescription] = useState(video?.description ?? "");
  const [isActive, setIsActive] = useState(video?.isActive ?? true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const isEdit = !!video;

  const createMutation = useMutation({
    mutationFn: () => videosApi.create({ title, description, isActive }, videoFile!, (p) => setProgress(p)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Video uploaded");
      onSuccess();
    },
    onError: () => {
      toast.error("Upload failed");
      setProgress(0);
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => videosApi.update(video!.id, { title, description, isActive }, videoFile ?? undefined, (p) => setProgress(p)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Video updated");
      onSuccess();
    },
    onError: () => {
      toast.error("Update failed");
      setProgress(0);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !videoFile) { toast.error("Please select a video file"); return; }
    setProgress(0);
    if (isEdit) updateMutation.mutate();
    else createMutation.mutate();
  };

  const handleFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024 * 1024) {
      toast.error("File too large. Maximum 2GB allowed.");
      return;
    }
    setVideoFile(file);
    // Generate preview
    if (videoPreviewRef.current) {
      videoPreviewRef.current.src = URL.createObjectURL(file);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isEdit ? "Edit Video" : "Upload New Video"}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Video drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-lg min-h-[160px] flex flex-col items-center justify-center gap-2 p-4 transition-all cursor-pointer select-none ${
          drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {videoFile || isEdit ? (
          <div className="w-full max-w-md">
            <video
              ref={videoPreviewRef}
              src={videoFile ? URL.createObjectURL(videoFile) : (video?.videoUrlResolved || video?.videoUrl)}
              className="w-full aspect-video rounded bg-black object-contain"
              controls
              muted
            />
            {videoFile && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                {videoFile.name} ({formatFileSize(videoFile.size)})
              </p>
            )}
            {isEdit && !videoFile && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Current video shown. Drop a new file to replace.
              </p>
            )}
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drop a video here or <span className="text-primary underline">browse</span>
            </p>
            <p className="text-xs text-muted-foreground">MP4, WebM, MOV — Max 2GB</p>
          </>
        )}
      </div>

      {/* Progress bar */}
      {isPending && progress > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video title (optional)"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-border"
        />
        <label htmlFor="isActive" className="text-sm font-medium">Active (show on homepage)</label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? `Uploading... ${progress}%` : isEdit ? "Update Video" : "Upload Video"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
