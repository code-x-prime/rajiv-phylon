import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

type ImageUploadZoneProps = {
  value: File[];
  onChange: (files: File[]) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
};

export function ImageUploadZone({ value, onChange, max = 4, disabled, className }: ImageUploadZoneProps) {
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
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && document.getElementById("image-zone-input")?.click()}
        className={cn(
          "border-2 border-dashed min-h-[160px] flex flex-col items-center justify-center gap-2 p-4 transition-colors cursor-pointer",
          drag ? "border-primary bg-muted/50" : "border-border hover:border-primary/50 hover:bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          Drag & drop images here or click to upload (max {max})
        </p>
        <input
          id="image-zone-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((file, i) => (
            <div key={i} className="relative border border-border w-20 h-20">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-destructive text-primary-foreground text-xs w-5 h-5 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(i);
                  }}
                >
                  ×
                </button>
              )}
              <span className="absolute bottom-0 left-0 bg-black/60 text-white text-xs px-1">#{i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
