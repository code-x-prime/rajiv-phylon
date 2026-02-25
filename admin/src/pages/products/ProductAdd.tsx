import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import JoditEditor from "jodit-react";
import { categoriesApi, subCategoriesApi, productsApi, type ProductFeatureTag } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadZone } from "@/components/ImageUploadZone";
import { toast } from "sonner";
import { getApiError } from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";

const JODIT_CONFIG = {
  height: 400,
  minHeight: 400,
  width: "100%",
  toolbar: true,
  toolbarButtonSize: "middle" as const,
  toolbarSticky: false,
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  allowResizeX: false,
  allowResizeY: true,
  resizeMinHeight: 400,
  buttons: [
    "source", "|",
    "bold", "italic", "underline", "strikethrough", "|",
    "ul", "ol", "|",
    "font", "fontsize", "brush", "|",
    "align", "|",
    "link", "image", "table", "|",
    "undo", "redo", "|",
    "hr", "eraser", "copyformat", "|",
    "paragraph", "lineHeight",
  ],
  buttonsMD: ["bold", "italic", "underline", "ul", "ol", "link", "image"],
  buttonsSM: ["bold", "italic", "ul", "link"],
  pasteFromWordRemoveFontStyles: true,
  pasteFromWordRemoveStyles: true,
  uploader: { insertImageAsBase64URI: true },
  style: { fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "16px", lineHeight: 1.6 },
};

function CheckboxRow({ label, checked, onChange, description }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer"
      />
      <div>
        <span className="text-sm font-medium group-hover:text-primary transition-colors">{label}</span>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

export function ProductAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [subCategoryIds, setSubCategoryIds] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [featureTag, setFeatureTag] = useState<ProductFeatureTag>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isHighDemand, setIsHighDemand] = useState(false);
  const [showOnHome, setShowOnHome] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [seoOpen, setSeoOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: subCategories = [] } = useQuery({
    queryKey: ["subcategories", categoryIds],
    queryFn: () => subCategoriesApi.getByCategories(categoryIds),
    enabled: categoryIds.length > 0,
  });

  const handleFeatureTagChange = (v: string) => {
    const tag = v === "__none__" ? null : (v as ProductFeatureTag);
    setFeatureTag(tag);
    setIsNewArrival(tag === "NEW_ARRIVAL");
    setIsFeatured(tag === "BEST_SELLER");
    setIsHighDemand(tag === "TRENDING");
  };

  const createMutation = useMutation({
    mutationFn: () =>
      productsApi.create(
        {
          name: name.trim(),
          description: description || "",
          categoryIds,
          subCategoryIds: subCategoryIds.length ? subCategoryIds : [],
          featureTag: featureTag || undefined,
          isFeatured,
          isNewArrival,
          isHighDemand,
          showOnHome,
          isActive,
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          metaKeywords: metaKeywords.trim() || undefined,
        },
        images.length ? images : undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
      navigate("/products");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const handleCategoryToggle = (id: string) => {
    setCategoryIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
    setSubCategoryIds((prev) => prev.filter((sid) => {
      const sub = subCategories.find((s) => s.id === sid);
      return sub && sub.categoryId !== id;
    }));
  };

  const handleSubCategoryToggle = (id: string) => {
    setSubCategoryIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (!categoryIds.length) { toast.error("Select at least one category"); return; }
    createMutation.mutate();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6 border border-border bg-card p-6 rounded-lg">
        {/* Name */}
        <div>
          <Label>Name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required className="mt-1 border-border" />
        </div>

        {/* Categories */}
        <div className="w-full">
          <Label>Categories * (select at least one)</Label>
          <div className="mt-2 w-full border border-border rounded p-3 max-h-48 overflow-y-auto space-y-2">
            {categories.length === 0
              ? <p className="text-sm text-muted-foreground">No categories. Add categories first.</p>
              : categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={categoryIds.includes(c.id)} onChange={() => handleCategoryToggle(c.id)} className="rounded border-border h-4 w-4" />
                  <span className="text-sm">{c.name}</span>
                </label>
              ))
            }
          </div>
        </div>

        {/* SubCategories */}
        <div className="w-full">
          <Label>SubCategories (optional)</Label>
          <div className="mt-2 w-full border border-border rounded p-3 max-h-48 overflow-y-auto space-y-2">
            {categoryIds.length === 0
              ? <p className="text-sm text-muted-foreground">Select a category first.</p>
              : subCategories.length === 0
                ? <p className="text-sm text-muted-foreground">No subcategories for selected categories.</p>
                : subCategories.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={subCategoryIds.includes(s.id)} onChange={() => handleSubCategoryToggle(s.id)} className="rounded border-border h-4 w-4" />
                    <span className="text-sm">{s.name}</span>
                  </label>
                ))
            }
          </div>
        </div>

        {/* Feature Tag */}
        <div>
          <Label>Feature tag (home sections)</Label>
          <p className="text-xs text-muted-foreground mb-2">Choosing a tag will auto-set the related flags below.</p>
          <Select value={featureTag ?? "__none__"} onValueChange={handleFeatureTagChange}>
            <SelectTrigger className="mt-1 border-border w-full max-w-xs">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              <SelectItem value="NEW_ARRIVAL">New Arrival</SelectItem>
              <SelectItem value="TRENDING">Trending (High Demand)</SelectItem>
              <SelectItem value="BEST_SELLER">Best Seller (Featured)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Boolean flags */}
        <div className="border border-border rounded p-4 space-y-3 bg-muted/20">
          <p className="text-sm font-medium mb-1">Product flags</p>
          <CheckboxRow
            label="New Arrival"
            checked={isNewArrival}
            onChange={(v) => { setIsNewArrival(v); if (v) { setFeatureTag("NEW_ARRIVAL"); setIsFeatured(false); setIsHighDemand(false); } else if (featureTag === "NEW_ARRIVAL") setFeatureTag(null); }}
            description="Shows in New Arrivals section on home page"
          />
          <CheckboxRow
            label="High Demand / Trending"
            checked={isHighDemand}
            onChange={(v) => { setIsHighDemand(v); if (v) { setFeatureTag("TRENDING"); setIsFeatured(false); setIsNewArrival(false); } else if (featureTag === "TRENDING") setFeatureTag(null); }}
            description="Shows in High Demand section on home page"
          />
          <CheckboxRow
            label="Featured / Best Seller"
            checked={isFeatured}
            onChange={(v) => { setIsFeatured(v); if (v) { setFeatureTag("BEST_SELLER"); setIsNewArrival(false); setIsHighDemand(false); } else if (featureTag === "BEST_SELLER") setFeatureTag(null); }}
            description="Shows in Featured Products section on home page"
          />
          <CheckboxRow
            label="Show on Home"
            checked={showOnHome}
            onChange={setShowOnHome}
            description="Pinned to home page listing"
          />
          <CheckboxRow
            label="Active"
            checked={isActive}
            onChange={setIsActive}
            description="Inactive products are hidden from the website"
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <div className="mt-1 w-full border border-border overflow-hidden rounded">
            <JoditEditor
              value={description}
              onChange={(v) => setDescription(v)}
              onBlur={(v) => setDescription(v)}
              config={JODIT_CONFIG}
            />
          </div>
        </div>

        {/* SEO */}
        <div className="border border-border rounded">
          <button
            type="button"
            onClick={() => setSeoOpen((o) => !o)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium text-sm">SEO Settings (optional)</span>
            {seoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {seoOpen && (
            <div className="border-t border-border p-4 space-y-3 bg-muted/20">
              <p className="text-xs text-muted-foreground">Leave empty to auto-generate from product name & description.</p>
              <div>
                <Label className="text-sm">Meta Title</Label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Auto from product name" className="mt-1 border-border" />
              </div>
              <div>
                <Label className="text-sm">Meta Description</Label>
                <Input value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Auto from description" className="mt-1 border-border" />
              </div>
              <div>
                <Label className="text-sm">Meta Keywords</Label>
                <Input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} placeholder="Auto from name + categories" className="mt-1 border-border" />
              </div>
            </div>
          )}
        </div>

        {/* Images */}
        <div>
          <Label>Images (max 4)</Label>
          <ImageUploadZone value={images} onChange={setImages} max={4} className="mt-2" />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate("/products")}>Cancel</Button>
          <Button type="submit" disabled={createMutation.isPending || !categoryIds.length} className="min-w-[120px]">
            {createMutation.isPending ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
