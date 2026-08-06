import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fullScreenVideoApi, type Video } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Replace,
  X,
  Tv,
  CheckCircle2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

function formatFileSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function FullScreenVideo() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: video, isLoading } = useQuery({
    queryKey: ["admin-fullscreen-video"],
    queryFn: fullScreenVideoApi.getAdmin,
  });

  const toggleMutation = useMutation({
    mutationFn: () => fullScreenVideoApi.toggleActive(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fullscreen-video"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => fullScreenVideoApi.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fullscreen-video"] });
      toast.success("Video deleted permanently from Cloudflare R2");
      setShowDeleteConfirm(false);
    },
    onError: () => toast.error("Failed to delete video"),
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Full Screen Video Banner</h2>
            {video && (
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  video.isActive ? "bg-green-500/15 text-green-600 border border-green-500/30" : "bg-red-500/15 text-red-600 border border-red-500/30"
                }`}
              >
                {video.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload & manage a single full-screen HD video (Max 1.5GB) displayed below Featured Videos on homepage
          </p>
        </div>

        {video && !showForm && (
          <div className="flex items-center gap-2">
            <Button
              variant={video.isActive ? "outline" : "default"}
              size="sm"
              onClick={() => toggleMutation.mutate()}
              disabled={toggleMutation.isPending}
              className="gap-2"
            >
              {video.isActive ? (
                <>
                  <EyeOff className="h-4 w-4" /> Deactivate
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" /> Activate
                </>
              )}
            </Button>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Replace className="h-4 w-4" /> Replace Video
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="rounded-xl border border-border bg-card p-6 animate-pulse space-y-4">
          <div className="aspect-video bg-muted rounded-lg w-full" />
          <div className="h-5 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !video && !showForm && (
        <div className="rounded-xl border-2 border-dashed border-border bg-card p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Tv className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Full Screen Video Uploaded</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Upload a single high-definition video (Max 1.5GB). It will be saved directly to Cloudflare R2 and displayed full screen on your homepage.
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Upload className="h-4 w-4" /> Upload Video (Max 1.5GB)
          </Button>
        </div>
      )}

      {/* Video Preview Card */}
      {!isLoading && video && !showForm && (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="aspect-video bg-black relative">
            <video
              src={video.videoUrlResolved || video.videoUrl}
              className="w-full h-full object-cover"
              controls
              muted
              preload="metadata"
            />
            {!video.isActive && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-white">
                <span className="bg-red-600 font-bold text-xs tracking-wider px-3 py-1 rounded-full uppercase">
                  INACTIVE ON HOMEPAGE
                </span>
                <p className="text-xs text-white/70">Click Activate to display this video on the website</p>
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border bg-card">
            <div>
              <h3 className="font-bold text-lg">{video.title || "Full Screen Video"}</h3>
              {video.description && (
                <p className="text-sm text-muted-foreground mt-1">{video.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                <span>Uploaded: {new Date(video.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Stored in Cloudflare R2
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="gap-2">
                <Replace className="h-4 w-4" /> Replace
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)} className="gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Form (Upload / Replace) */}
      {(showForm || (!video && showForm)) && (
        <FullScreenVideoForm
          existingVideo={video || undefined}
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Full Screen Video?"
        description="This will permanently delete the video file from Cloudflare R2 storage and remove it from the homepage. This action cannot be undone."
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

// Full Screen Video Form Component
function FullScreenVideoForm({
  existingVideo,
  onSuccess,
  onCancel,
}: {
  existingVideo?: Video;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(existingVideo?.title ?? "");
  const [description, setDescription] = useState(existingVideo?.description ?? "");
  const [isActive, setIsActive] = useState(existingVideo?.isActive ?? true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const saveMutation = useMutation({
    mutationFn: () =>
      fullScreenVideoApi.save(
        { title, description, isActive },
        videoFile ?? undefined,
        (pct) => setProgress(pct)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fullscreen-video"] });
      toast.success(existingVideo ? "Full screen video updated" : "Full screen video uploaded successfully");
      onSuccess();
    },
    onError: () => {
      toast.error("Upload failed. Please check file size & network connection.");
      setProgress(0);
    },
  });

  const handleFile = (file: File) => {
    if (file.size > 1.5 * 1024 * 1024 * 1024) {
      toast.error("File too large. Maximum 1.5GB allowed.");
      return;
    }
    setVideoFile(file);
    if (videoPreviewRef.current) {
      videoPreviewRef.current.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingVideo && !videoFile) {
      toast.error("Please select a video file to upload");
      return;
    }
    setProgress(0);
    saveMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-lg font-semibold">
          {existingVideo ? "Replace / Edit Full Screen Video" : "Upload New Full Screen Video (Max 1.5GB)"}
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Video drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl min-h-[220px] flex flex-col items-center justify-center gap-3 p-6 transition-all cursor-pointer select-none ${
          drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-muted/20"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v,video/avi,video/x-matroska"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {videoFile || existingVideo ? (
          <div className="w-full max-w-xl text-center space-y-3">
            <video
              ref={videoPreviewRef}
              src={videoFile ? URL.createObjectURL(videoFile) : (existingVideo?.videoUrlResolved || existingVideo?.videoUrl)}
              className="w-full aspect-video rounded-lg bg-black object-contain shadow-md"
              controls
              muted
            />
            {videoFile && (
              <p className="text-xs font-semibold text-primary">
                Selected: {videoFile.name} ({formatFileSize(videoFile.size)})
              </p>
            )}
            {existingVideo && !videoFile && (
              <p className="text-xs text-muted-foreground">
                Showing current video. Drop a new video file here to replace it.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Upload className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                Drop your video here or <span className="text-primary underline">browse file</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">MP4, WebM, MOV, AVI — Maximum 1.5GB</p>
            </div>
          </>
        )}
      </div>

      {/* Live Upload Progress */}
      {saveMutation.isPending && (
        <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-primary animate-pulse">Uploading to Cloudflare R2...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title (Optional)</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Master Production Showcase"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description (Optional)</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional subtitle or description"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="isActiveFullScreen"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-border h-4 w-4 text-primary focus:ring-primary"
        />
        <label htmlFor="isActiveFullScreen" className="text-sm font-medium cursor-pointer">
          Active (Display full screen on website homepage)
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? `Uploading... ${progress}%` : existingVideo ? "Save Changes" : "Upload Full Screen Video"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saveMutation.isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
