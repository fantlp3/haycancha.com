import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Star, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedPhoto {
  id: string;
  file: File;
  url: string;
  isCover: boolean;
  oversize: boolean;
}

interface Props {
  photos: UploadedPhoto[];
  onChange: (next: UploadedPhoto[]) => void;
  max?: number;
  maxSizeMb?: number;
}

const ACCEPT = "image/jpeg,image/png,image/webp";

export const PhotoUploader = ({ photos, onChange, max = 8, maxSizeMb = 5 }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // Cleanup object URLs
  useEffect(() => {
    return () => photos.forEach((p) => URL.revokeObjectURL(p.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files).filter((f) =>
        ["image/jpeg", "image/png", "image/webp"].includes(f.type)
      );
      const slots = Math.max(0, max - photos.length);
      const take = incoming.slice(0, slots).map((f) => ({
        id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
        file: f,
        url: URL.createObjectURL(f),
        isCover: false,
        oversize: f.size > maxSizeMb * 1024 * 1024,
      }));
      const next = [...photos, ...take];
      // Ensure exactly one cover (first photo by default)
      if (next.length > 0 && !next.some((p) => p.isCover)) next[0].isCover = true;
      onChange(next);
    },
    [photos, onChange, max, maxSizeMb]
  );

  const removePhoto = (id: string) => {
    const target = photos.find((p) => p.id === id);
    if (target) URL.revokeObjectURL(target.url);
    let next = photos.filter((p) => p.id !== id);
    if (next.length > 0 && !next.some((p) => p.isCover)) next[0].isCover = true;
    onChange(next);
  };

  const setCover = (id: string) => {
    onChange(photos.map((p) => ({ ...p, isCover: p.id === id })));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const remainingSlots = max - photos.length;

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed bg-light/50 px-6 py-10 text-center transition-colors",
          dragging ? "border-orange bg-orange/5" : "border-border hover:border-orange/50",
          photos.length >= max && "opacity-50 pointer-events-none"
        )}
        role="button"
        tabIndex={0}
        aria-label="Agregar fotos del complejo"
      >
        <ImagePlus size={28} className="mx-auto text-orange mb-2" />
        <p className="text-[14px] font-semibold text-dark">
          Arrastrá las fotos acá o <span className="text-orange underline">elegilas desde tu equipo</span>
        </p>
        <p className="text-[12px] text-gray mt-1">
          JPG, PNG o WEBP · máx {maxSizeMb}MB cada una · hasta {max} fotos ({remainingSlots} disponibles)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((p) => (
            <div
              key={p.id}
              className={cn(
                "relative group rounded-lg overflow-hidden border bg-white",
                p.isCover ? "border-orange shadow-card-hover" : "border-border",
                p.oversize && "ring-2 ring-destructive"
              )}
            >
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img src={p.url} alt={p.file.name} className="w-full h-full object-cover" />
              </div>
              {p.isCover && (
                <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-orange text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  <Star size={10} fill="currentColor" /> Portada
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(p.id);
                }}
                aria-label={`Eliminar ${p.file.name}`}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-destructive hover:text-white flex items-center justify-center text-dark transition"
              >
                <Trash2 size={13} />
              </button>
              <div className="p-2 flex items-center justify-between gap-2 bg-white">
                <label className="flex items-center gap-1.5 text-[11px] cursor-pointer select-none">
                  <input
                    type="radio"
                    name="cover-photo"
                    checked={p.isCover}
                    onChange={() => setCover(p.id)}
                    className="accent-orange"
                  />
                  Portada
                </label>
                <span className="text-[10px] text-gray truncate max-w-[80px]" title={p.file.name}>
                  {(p.file.size / 1024 / 1024).toFixed(1)}MB
                </span>
              </div>
              {p.oversize && (
                <div className="bg-destructive/10 text-destructive text-[10px] font-medium px-2 py-1 flex items-center gap-1">
                  <AlertTriangle size={10} /> Supera {maxSizeMb}MB
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
