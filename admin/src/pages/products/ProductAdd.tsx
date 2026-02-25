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
import { ChevronDown, ChevronRight, Plus, Trash2, Wand2 } from "lucide-react";

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

/* ── Spec & Trade templates ───────────────────────────── */
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
type KVPair = { key: string; value: string };

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
          No rows yet. Click &quot;Add Row&quot; or choose a template to get started.
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

function kvPairsToObj(pairs: KVPair[]): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const { key, value } of pairs) {
    if (key.trim()) obj[key.trim()] = value;
  }
  return obj;
}

/* ── MOQ Input ────────────────────────────────────────── */
function MoqInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const isCustom = !MOQ_PRESETS.slice(0, -1).includes(value) && value !== "";
  const [showCustom, setShowCustom] = useState(isCustom);

  const handleSelect = (v: string) => {
    if (v === "Custom...") {
      setShowCustom(true);
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

/* ── ProductAdd ───────────────────────────────────────── */
export function ProductAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [moq, setMoq] = useState("");
  const [description, setDescription] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [subCategoryIds, setSubCategoryIds] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [specPairs, setSpecPairs] = useState<KVPair[]>([]);
  const [tradePairs, setTradePairs] = useState<KVPair[]>(
    TRADE_DEFAULTS.map((k) => ({ key: k, value: "" }))
  );
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

  const createMutation = useMutation({
    mutationFn: () => {
      const specsObj = kvPairsToObj(specPairs);
      const tradeObj = kvPairsToObj(tradePairs);
      return productsApi.create(
        {
          name: name.trim(),
          description: description || "",
          moq: moq.trim() || undefined,
          specifications: Object.keys(specsObj).length ? specsObj : undefined,
          tradeInfo: Object.keys(tradeObj).length ? tradeObj : undefined,
          categoryIds,
          subCategoryIds: subCategoryIds.length ? subCategoryIds : [],
          featureTag: featureTag || undefined,
          isFeatured, isNewArrival, isHighDemand, showOnHome, isActive,
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          metaKeywords: metaKeywords.trim() || undefined,
        },
        images.length ? images : undefined
      );
    },
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
  const handleSubCategoryToggle = (id: string) =>
    setSubCategoryIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (!categoryIds.length) { toast.error("Select at least one category"); return; }
    createMutation.mutate();
  };

  return (
    <div className="max-w-4xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Basic Info ── */}
        <section className="border border-border bg-card p-6 rounded-lg space-y-5">
          <h2 className="font-semibold text-base border-b border-border pb-3">Basic Information</h2>
          <div>
            <Label>Product Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Exo Shoes TPR Sole" required className="mt-1" />
          </div>
          <div>
            <Label>Minimum Order Quantity (MOQ)</Label>
            <p className="text-xs text-muted-foreground mb-2">Choose a preset or type a custom value — shown as a badge on the product page</p>
            <MoqInput value={moq} onChange={setMoq} />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label>Categories * (select at least one)</Label>
              <div className="mt-2 border border-border rounded p-3 max-h-48 overflow-y-auto space-y-2">
                {categories.length === 0
                  ? <p className="text-sm text-muted-foreground">No categories. Add categories first.</p>
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
          <p className="text-xs text-muted-foreground">Write a detailed description — features, uses, benefits. Full rich text supported.</p>
          <div className="w-full border border-border overflow-hidden rounded">
            <JoditEditor value={description} onChange={(v) => setDescription(v)} onBlur={(v) => setDescription(v)} config={JODIT_CONFIG} />
          </div>
        </section>

        {/* ── Specifications ── */}
        <section className="border border-border bg-card p-6 rounded-lg space-y-3">
          <h2 className="font-semibold text-base border-b border-border pb-3">Product Specifications</h2>
          <KVEditor
            label="Specifications"
            description="Key specs shown as a table on the product page (Material, Color, Size, etc.). Use templates to quickly add common fields."
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
            description="Business & export details shown on the product page. Pre-filled with common trade fields — just enter the values."
            pairs={tradePairs}
            onChange={setTradePairs}
          />
        </section>

        {/* ── Images ── */}
        <section className="border border-border bg-card p-6 rounded-lg space-y-3">
          <h2 className="font-semibold text-base border-b border-border pb-3">Product Images (max 4)</h2>
          <p className="text-xs text-muted-foreground">Upload up to 4 images. Uploaded in original HD quality — no compression applied. First image is the main display image.</p>
          <ImageUploadZone value={images} onChange={setImages} max={4} className="mt-2" />
        </section>

        {/* ── Flags ── */}
        <section className="border border-border bg-card p-6 rounded-lg space-y-5">
          <h2 className="font-semibold text-base border-b border-border pb-3">Home Page & Visibility</h2>
          <div>
            <Label>Feature Tag (Home Sections)</Label>
            <p className="text-xs text-muted-foreground mb-2">Sets the section this product appears in on the home page.</p>
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
            <span className="font-semibold text-base">SEO Settings (optional)</span>
            {seoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {seoOpen && (
            <div className="border-t border-border p-5 space-y-4 bg-muted/20">
              <p className="text-xs text-muted-foreground">Leave empty to auto-generate from product name & description.</p>
              <div><Label>Meta Title</Label><Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Auto from product name" className="mt-1" /></div>
              <div><Label>Meta Description</Label><Input value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Auto from description" className="mt-1" /></div>
              <div><Label>Meta Keywords</Label><Input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} placeholder="Auto from name + categories" className="mt-1" /></div>
            </div>
          )}
        </section>

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-2 pb-8">
          <Button type="button" variant="outline" onClick={() => navigate("/products")}>Cancel</Button>
          <Button type="submit" disabled={createMutation.isPending || !categoryIds.length} className="min-w-[140px]">
            {createMutation.isPending ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
