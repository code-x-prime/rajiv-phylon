import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import JoditEditor from "jodit-react";
import { categoriesApi, subCategoriesApi, productsApi, type Product, type ProductImage, type ProductFeatureTag } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadZone } from "@/components/ImageUploadZone";
import { toast } from "sonner";
import { getApiError } from "@/lib/axios";
import { ChevronDown, ChevronRight, Plus, Trash2, Wand2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ── Jodit config ─────────────────────────────────────── */
const JODIT_CONFIG = {
  height: 450,
  minHeight: 350,
  width: "100%",
  toolbar: true,
  toolbarButtonSize: "middle" as const,
  toolbarSticky: false,
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  allowResizeX: false,
  allowResizeY: true,
  resizeMinHeight: 350,
  buttons: [
    "source", "|",
    "bold", "italic", "underline", "strikethrough", "|",
    "superscript", "subscript", "|",
    "ul", "ol", "|",
    "font", "fontsize", "brush", "|",
    "align", "indent", "outdent", "|",
    "link", "image", "table", "hr", "|",
    "undo", "redo", "|",
    "eraser", "copyformat", "|",
    "paragraph", "lineHeight",
  ],
  pasteFromWordRemoveFontStyles: true,
  pasteFromWordRemoveStyles: true,
  uploader: { insertImageAsBase64URI: true },
  style: { fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "15px", lineHeight: 1.7 },
};

/* ── MOQ presets ──────────────────────────────────────── */
const MOQ_PRESETS = [
  "100 Pieces", "500 Pieces", "1000 Pieces", "2000 Pieces", "5000 Pieces", "10000 Pieces",
  "100 Pairs", "500 Pairs", "1000 Pairs", "2000 Pairs", "5000 Pairs",
  "50 Kg", "100 Kg", "500 Kg", "1000 Kg",
  "1 Box", "10 Boxes", "50 Boxes", "100 Boxes",
  "1 Container", "Custom...",
];

/* ── Spec templates ───────────────────────────────────── */
const SPEC_TEMPLATES = [
  { label: "Footwear / Shoes", rows: ["Material", "Technique", "Color", "Size", "Brand", "Packaging Type", "Country of Origin"] },
  { label: "Textile / Fabric", rows: ["Material", "Color", "Pattern", "Width", "Weight (GSM)", "Finish", "Country of Origin"] },
  { label: "Plastic / Rubber", rows: ["Material", "Color", "Grade", "Hardness", "Thickness", "Application"] },
  { label: "Metal / Hardware", rows: ["Material", "Finish", "Size", "Weight", "Grade", "Surface Treatment"] },
  { label: "General Product", rows: ["Material", "Color", "Size", "Brand", "Model Number", "Weight", "Packaging Type", "Country of Origin"] },
];

const TRADE_DEFAULTS = [
  "Payment Terms", "Supply Ability", "Delivery Time",
  "Sample Available", "Sample Policy", "Main Export Market(s)", "Main Domestic Market",
];

/* ── Helpers ──────────────────────────────────────────── */
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
const VALID_TAGS = ["NEW_ARRIVAL", "TRENDING", "BEST_SELLER"] as const;
type ValidTag = typeof VALID_TAGS[number];
function normalizeTag(val: unknown): ProductFeatureTag {
  if (!val) return null;
  const up = String(val).toUpperCase() as ValidTag;
  return VALID_TAGS.includes(up) ? up : null;
}
type KVPair = { key: string; value: string };
function objToKVPairs(obj: Record<string, string> | null | undefined): KVPair[] {
  if (!obj) return [];
  return Object.entries(obj).map(([key, value]) => ({ key, value: String(value) }));
}
function kvPairsToObj(pairs: KVPair[]): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const { key, value } of pairs) {
    if (key.trim()) obj[key.trim()] = value;
  }
  return obj;
}

/* ── CheckboxRow ──────────────────────────────────────── */
function CheckboxRow({ label, checked, onChange, description }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer" />
      <div>
        <span className="text-sm font-medium group-hover:text-primary transition-colors">{label}</span>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

/* ── KV Editor ────────────────────────────────────────── */
function KVEditor({ label, description, pairs, onChange, templates }: {
  label: string; description?: string; pairs: KVPair[]; onChange: (pairs: KVPair[]) => void;
  templates?: { label: string; rows: string[] }[];
}) {
  const [templateOpen, setTemplateOpen] = useState(false);
  const addRow = () => onChange([...pairs, { key: "", value: "" }]);
  const removeRow = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: "key" | "value", val: string) => {
    const next = [...pairs];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const applyTemplate = (rows: string[]) => {
    const existingKeys = new Set(pairs.map((p) => p.key));
    const newRows = rows.filter((r) => !existingKeys.has(r)).map((r) => ({ key: r, value: "" }));
    onChange([...pairs, ...newRows]);
    setTemplateOpen(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 justify-between mb-2">
        <div>
          <Label>{label}</Label>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <div className="flex gap-2">
          {templates && (
            <div className="relative">
              <Button type="button" variant="outline" size="sm" onClick={() => setTemplateOpen((o) => !o)} className="gap-1.5 text-xs">
                <Wand2 className="h-3.5 w-3.5" /> Templates
              </Button>
              {templateOpen && (
                <div className="absolute left-0 top-full mt-1 z-50 bg-popover border border-border bg-white rounded-lg shadow-xl w-64 py-1">
                  <p className="px-3 pt-1 pb-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border mb-1">Choose a template</p>
                  {templates.map((t) => (
                    <button key={t.label} type="button" onClick={() => applyTemplate(t.rows)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Row
          </Button>
        </div>
      </div>
      {pairs.length === 0 ? (
        <div className="border border-dashed border-border rounded p-4 text-center text-sm text-muted-foreground">
          No rows yet. Click &quot;Add Row&quot; or choose a template.
        </div>
      ) : (
        <div className="border border-border rounded overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_auto] text-xs font-medium bg-muted/50 px-3 py-2 border-b border-border">
            <span>Property / Label</span><span>Value</span><span />
          </div>
          <div className="divide-y divide-border">
            {pairs.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center">
                <input type="text" value={row.key} onChange={(e) => updateRow(i, "key", e.target.value)}
                  placeholder="e.g. Material"
                  className="px-3 py-2 text-sm bg-transparent border-r border-border outline-none focus:bg-primary/5" />
                <input type="text" value={row.value} onChange={(e) => updateRow(i, "value", e.target.value)}
                  placeholder="e.g. TPR"
                  className="px-3 py-2 text-sm bg-transparent border-r border-border outline-none focus:bg-primary/5" />
                <button type="button" onClick={() => removeRow(i)}
                  className="px-3 py-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── MOQ Input ────────────────────────────────────────── */
function MoqInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const isPreset = MOQ_PRESETS.slice(0, -1).includes(value);
  const [showCustom, setShowCustom] = useState(!isPreset && value !== "");

  const handleSelect = (v: string) => {
    if (v === "Custom...") {
      setShowCustom(true);
      onChange("");
    } else if (v === "__none__") {
      setShowCustom(false);
      onChange("");
    } else {
      setShowCustom(false);
      onChange(v);
    }
  };

  const selectValue = showCustom ? "Custom..." : (value || "__none__");

  return (
    <div className="space-y-2">
      <Select value={selectValue} onValueChange={handleSelect}>
        <SelectTrigger className="border-border w-full">
          <SelectValue placeholder="Select MOQ or choose Custom..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">— No MOQ set —</SelectItem>
          {MOQ_PRESETS.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showCustom && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type custom MOQ e.g. 1200-2400 Pairs"
          className="border-border"
          autoFocus
        />
      )}
      {!showCustom && value && (
        <p className="text-xs text-muted-foreground">Selected: <span className="font-medium text-foreground">{value}</span></p>
      )}
    </div>
  );
}

/* ── Form state helper ────────────────────────────────── */
function getInitialFormState(product: Product) {
  const tag = normalizeTag(product.featureTag);
  const auto = product.seoAutoGenerated ?? {};
  const existingTradePairs = objToKVPairs(product.tradeInfo);
  return {
    name: product.name,
    moq: product.moq ?? "",
    description: product.description || "",
    categoryIds: product.categories?.map((c) => c.id) ?? [],
    subCategoryIds: product.subCategories?.map((s) => s.id) ?? [],
    existingImages: product.images || [],
    specPairs: objToKVPairs(product.specifications),
    tradePairs: existingTradePairs.length
      ? existingTradePairs
      : TRADE_DEFAULTS.map((k) => ({ key: k, value: "" })),
    featureTag: tag,
    isNewArrival: tag === "NEW_ARRIVAL" ? true : (product.isNewArrival ?? false),
    isFeatured: tag === "BEST_SELLER" ? true : (product.isFeatured ?? false),
    isHighDemand: tag === "TRENDING" ? true : (product.isHighDemand ?? false),
    showOnHome: product.showOnHome ?? false,
    isActive: product.isActive ?? true,
    metaTitle: product.metaTitle ?? product.name,
    metaDescription: product.metaDescription ?? stripHtml(product.description || "").slice(0, 160),
    metaKeywords:
      product.metaKeywords ??
      [product.name, ...(product.categories?.map((c) => c.name) ?? []), ...(product.subCategories?.map((s) => s.name) ?? [])]
        .filter(Boolean).join(", "),
    seoAuto: { metaTitle: !!auto.metaTitle, metaDescription: !!auto.metaDescription, metaKeywords: !!auto.metaKeywords },
  };
}

/* ── ProductEditForm ──────────────────────────────────── */
function ProductEditForm({ product, id }: { product: Product; id: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initial = getInitialFormState(product);

  const [name, setName] = useState(initial.name);
  const [moq, setMoq] = useState(initial.moq);
  const [description, setDescription] = useState(initial.description);
  const [categoryIds, setCategoryIds] = useState<string[]>(initial.categoryIds);
  const [subCategoryIds, setSubCategoryIds] = useState<string[]>(initial.subCategoryIds);
  const [existingImages, setExistingImages] = useState<ProductImage[]>(initial.existingImages);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [specPairs, setSpecPairs] = useState<KVPair[]>(initial.specPairs);
  const [tradePairs, setTradePairs] = useState<KVPair[]>(initial.tradePairs);
  const [featureTag, setFeatureTag] = useState<ProductFeatureTag>(initial.featureTag);
  const [isFeatured, setIsFeatured] = useState(initial.isFeatured);
  const [isNewArrival, setIsNewArrival] = useState(initial.isNewArrival);
  const [isHighDemand, setIsHighDemand] = useState(initial.isHighDemand);
  const [showOnHome, setShowOnHome] = useState(initial.showOnHome);
  const [isActive, setIsActive] = useState(initial.isActive);
  const [seoOpen, setSeoOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState(initial.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState(initial.metaKeywords);
  const [seoAuto, setSeoAuto] = useState(initial.seoAuto);

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: () => categoriesApi.getAll() });
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

  const removeImageMutation = useMutation({
    mutationFn: (imageId: string) => productsApi.deleteImage(id!, imageId),
    onSuccess: (_data, imageId) => {
      setExistingImages((prev) => prev.filter((i) => i.id !== imageId));
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Image removed");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const handleCategoryToggle = (catId: string) => {
    setCategoryIds((prev) => prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]);
    setSubCategoryIds((prev) =>
      prev.filter((sid) => { const sub = subCategories.find((s) => s.id === sid); return !sub || sub.categoryId !== catId; })
    );
  };
  const handleSubCategoryToggle = (subId: string) =>
    setSubCategoryIds((prev) => prev.includes(subId) ? prev.filter((s) => s !== subId) : [...prev, subId]);

  const updateMutation = useMutation({
    mutationFn: () => {
      const specsObj = kvPairsToObj(specPairs);
      const tradeObj = kvPairsToObj(tradePairs);
      return productsApi.update(
        id!,
        {
          name: name.trim(),
          description: description || "",
          moq: moq.trim() || "",
          specifications: Object.keys(specsObj).length ? specsObj : undefined,
          tradeInfo: Object.keys(tradeObj).length ? tradeObj : undefined,
          categoryIds,
          subCategoryIds,
          featureTag,
          isFeatured, isNewArrival, isHighDemand, showOnHome, isActive,
          metaTitle: metaTitle.trim() || "",
          metaDescription: metaDescription.trim() || "",
          metaKeywords: metaKeywords.trim() || "",
          images: existingImages.map((img, idx) => ({ id: img.id, url: img.url, position: idx })),
        },
        newImages.length ? newImages : undefined
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      navigate("/products");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (!categoryIds.length) { toast.error("Select at least one category"); return; }
    updateMutation.mutate();
  };

  const slotsLeft = Math.max(0, 4 - existingImages.length);

  return (
    <div className="max-w-4xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Basic Info ── */}
        <section className="border border-border bg-card p-6 rounded-lg space-y-5">
          <h2 className="font-semibold text-base border-b border-border pb-3">Basic Information</h2>
          <div>
            <Label>Product Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required className="mt-1" />
          </div>
          <div>
            <Label>Minimum Order Quantity (MOQ)</Label>
            <p className="text-xs text-muted-foreground mb-2">Choose a preset or type a custom value — shown as a badge on the product page</p>
            <MoqInput value={moq} onChange={setMoq} />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label>Categories *</Label>
              <div className="mt-2 border border-border rounded p-3 max-h-48 overflow-y-auto space-y-2">
                {categories.length === 0
                  ? <p className="text-sm text-muted-foreground">No categories found.</p>
                  : categories.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-1">
                      <input type="checkbox" checked={categoryIds.includes(c.id)} onChange={() => handleCategoryToggle(c.id)} className="rounded border-border h-4 w-4 accent-primary" />
                      <span className="text-sm">{c.name}</span>
                    </label>
                  ))}
              </div>
            </div>
            <div>
              <Label>SubCategories (optional)</Label>
              <div className="mt-2 border border-border rounded p-3 max-h-48 overflow-y-auto space-y-2">
                {categoryIds.length === 0
                  ? <p className="text-sm text-muted-foreground">Select a category first.</p>
                  : subCategories.length === 0
                    ? <p className="text-sm text-muted-foreground">No subcategories for selected categories.</p>
                    : subCategories.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-1">
                        <input type="checkbox" checked={subCategoryIds.includes(s.id)} onChange={() => handleSubCategoryToggle(s.id)} className="rounded border-border h-4 w-4 accent-primary" />
                        <span className="text-sm">{s.name}</span>
                      </label>
                    ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Description ── */}
        <section className="border border-border bg-card p-6 rounded-lg space-y-3">
          <h2 className="font-semibold text-base border-b border-border pb-3">Product Description</h2>
          <p className="text-xs text-muted-foreground">Full rich text editor — write about product features, uses, and benefits.</p>
          <div className="w-full border border-border overflow-hidden rounded">
            <JoditEditor value={description} onChange={(v) => setDescription(v)} onBlur={(v) => setDescription(v)} config={JODIT_CONFIG} />
          </div>
        </section>

        {/* ── Specifications ── */}
        <section className="border border-border bg-card p-6 rounded-lg space-y-3">
          <h2 className="font-semibold text-base border-b border-border pb-3">Product Specifications</h2>
          <KVEditor
            label="Specifications"
            description="Key specs shown as a table on the product page. Use Templates to quickly populate common fields."
            pairs={specPairs}
            onChange={setSpecPairs}
            templates={SPEC_TEMPLATES}
          />
        </section>

        {/* ── Trade Info ── */}
        <section className="border border-border bg-card p-6 rounded-lg space-y-3">
          <h2 className="font-semibold text-base border-b border-border pb-3">Trade Information</h2>
          <KVEditor
            label="Trade Details"
            description="Business & export details. Pre-filled with common trade fields — just fill in the values."
            pairs={tradePairs}
            onChange={setTradePairs}
          />
        </section>

        {/* ── Images ── */}
        <section className="border border-border bg-card p-6 rounded-lg space-y-4">
          <h2 className="font-semibold text-base border-b border-border pb-3">Product Images</h2>
          {existingImages.length > 0 && (
            <div>
              <Label>Current Images</Label>
              <p className="text-xs text-muted-foreground mb-3">Click Remove to permanently delete an image.</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, idx) => (
                  <div key={img.id} className="border border-border rounded-lg overflow-hidden shadow-sm">
                    <img src={img.url} alt="" className="w-28 h-28 object-contain bg-muted/10 block" />
                    <div className="bg-muted/30 px-1 py-0.5 text-center text-xs text-muted-foreground">#{idx + 1}</div>
                    <Button type="button" variant="destructive" size="sm" className="w-full rounded-none text-xs"
                      onClick={() => removeImageMutation.mutate(img.id)}
                      disabled={removeImageMutation.isPending}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <Label>{existingImages.length > 0 ? `Upload More (${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} remaining)` : "Upload Images (max 4)"}</Label>
            <p className="text-xs text-muted-foreground mb-2">Images uploaded in original HD quality — no compression applied.</p>
            <ImageUploadZone value={newImages} onChange={setNewImages} max={slotsLeft} className="mt-1" disabled={slotsLeft <= 0} />
          </div>
        </section>

        {/* ── Flags ── */}
        <section className="border border-border bg-card p-6 rounded-lg space-y-5">
          <h2 className="font-semibold text-base border-b border-border pb-3">Home Page & Visibility</h2>
          <div>
            <Label>Feature Tag (Home Sections)</Label>
            <Select value={featureTag ?? "__none__"} onValueChange={handleFeatureTagChange}>
              <SelectTrigger className="mt-2 border-border w-full max-w-xs">
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
          <div className="grid sm:grid-cols-2 gap-3">
            <CheckboxRow label="New Arrival" checked={isNewArrival}
              onChange={(v) => { setIsNewArrival(v); if (v) { setFeatureTag("NEW_ARRIVAL"); setIsFeatured(false); setIsHighDemand(false); } else if (featureTag === "NEW_ARRIVAL") setFeatureTag(null); }}
              description="Shows in New Arrivals section on home" />
            <CheckboxRow label="High Demand / Trending" checked={isHighDemand}
              onChange={(v) => { setIsHighDemand(v); if (v) { setFeatureTag("TRENDING"); setIsFeatured(false); setIsNewArrival(false); } else if (featureTag === "TRENDING") setFeatureTag(null); }}
              description="Shows in Trending section on home" />
            <CheckboxRow label="Featured / Best Seller" checked={isFeatured}
              onChange={(v) => { setIsFeatured(v); if (v) { setFeatureTag("BEST_SELLER"); setIsNewArrival(false); setIsHighDemand(false); } else if (featureTag === "BEST_SELLER") setFeatureTag(null); }}
              description="Shows in Featured Products section" />
            <CheckboxRow label="Show on Home" checked={showOnHome} onChange={setShowOnHome} description="Pinned to home page listing" />
            <CheckboxRow label="Active" checked={isActive} onChange={setIsActive} description="Inactive products are hidden from the website" />
          </div>
        </section>

        {/* ── SEO ── */}
        <section className="border border-border bg-card rounded-lg">
          <button type="button" onClick={() => setSeoOpen((o) => !o)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors rounded-lg">
            <span className="font-semibold text-base">SEO Settings</span>
            {seoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {seoOpen && (
            <div className="border-t border-border p-5 space-y-4 bg-muted/20">
              <p className="text-xs text-muted-foreground">Leave empty to auto-generate.</p>
              <div>
                <Label className="flex items-center gap-2">
                  Meta Title {seoAuto.metaTitle && <span className="text-xs font-normal text-muted-foreground">(Auto)</span>}
                </Label>
                <Input value={metaTitle} onChange={(e) => { setMetaTitle(e.target.value); setSeoAuto((a) => ({ ...a, metaTitle: false })); }} className="mt-1" />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  Meta Description {seoAuto.metaDescription && <span className="text-xs font-normal text-muted-foreground">(Auto)</span>}
                </Label>
                <Input value={metaDescription} onChange={(e) => { setMetaDescription(e.target.value); setSeoAuto((a) => ({ ...a, metaDescription: false })); }} className="mt-1" />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  Meta Keywords {seoAuto.metaKeywords && <span className="text-xs font-normal text-muted-foreground">(Auto)</span>}
                </Label>
                <Input value={metaKeywords} onChange={(e) => { setMetaKeywords(e.target.value); setSeoAuto((a) => ({ ...a, metaKeywords: false })); }} className="mt-1" />
              </div>
            </div>
          )}
        </section>

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-2 pb-8">
          <Button type="button" variant="outline" onClick={() => navigate("/products")}>Cancel</Button>
          <Button type="submit" disabled={updateMutation.isPending || !categoryIds.length} className="min-w-[140px]">
            {updateMutation.isPending ? "Saving..." : "Update Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ── ProductEdit (outer wrapper) ──────────────────────── */
export function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
  });

  if (!id) return <p className="text-muted-foreground">Product ID missing.</p>;

  if (isError) {
    return (
      <div className="space-y-3 max-w-4xl">
        <p className="text-destructive font-medium">Failed to load product.</p>
        <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : "Check connection."}</p>
        <Button type="button" variant="outline" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="space-y-6 max-w-4xl">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-border rounded-lg p-6 space-y-4">
            <div className="h-5 bg-muted animate-pulse w-48 rounded" />
            <div className="h-10 bg-muted animate-pulse w-full rounded" />
            <div className="h-10 bg-muted animate-pulse w-2/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return <ProductEditForm key={product.id} product={product} id={id} />;
}
