import { useCallback, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, ImageIcon } from "lucide-react";

type ImageUploadZoneProps = {
  value: File[];
  onChange: (files: File[]) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
};

export function ImageUploadZone({ value, onChange, max = 4, disabled, className }: ImageUploadZoneProps) {
  const uid = useId();
  const inputId = `image-zone-${uid}`;
  const [drag, setDrag] = useState(false);

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      const next = [...value];
      for (let i = 0; i < files.length && next.length < max; i++) {
        const f = files[i];
        if (f.type.startsWith("image/")) next.push(f);
      }
      onChange(next.slice(0, max));
    },
    [value, onChange, max]
  );

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const slotsLeft = max - value.length;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop zone — only show when slots available */}
      {slotsLeft > 0 && !disabled && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          onClick={() => document.getElementById(inputId)?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg min-h-[120px] flex flex-col items-center justify-center gap-2 p-4 transition-all cursor-pointer select-none",
            drag
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
          )}
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop images here or <span className="text-primary underline">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              PNG, JPG, WEBP — original HD quality, no compression ({slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} remaining)
            </p>
          </div>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
      )}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {value.map((file, i) => (
            <div
              key={i}
              className="relative group rounded-lg border border-border overflow-hidden bg-muted/20"
              style={{ aspectRatio: "1/1" }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${i + 1}`}
                className="w-full h-full object-contain"
              />
              {/* File info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 flex items-center gap-1.5">
                <ImageIcon className="h-2.5 w-2.5 text-white/70 shrink-0" />
                <span className="text-[10px] text-white/80 truncate">{file.name.split(".")[0]}</span>
                <span className="text-[10px] text-white/50 shrink-0 ml-auto">
                  {(file.size / 1024 / 1024).toFixed(1)}MB
                </span>
              </div>
              {/* Remove button */}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); remove(i); }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 z-10"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              {/* Position badge */}
              <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/50 text-white text-[10px] font-bold flex items-center justify-center z-10">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length >= max && (
        <p className="text-xs text-muted-foreground">Maximum {max} images reached. Remove one to add more.</p>
      )}
    </div>
  );
}
