import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, type Product } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getApiError } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  GripVertical,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  Search,
  Sparkles,
} from "lucide-react";

export function ProductList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "DRAFT" | "PUBLISHED">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name-asc" | "name-desc">("newest");
  const [showReorderModal, setShowReorderModal] = useState(false);

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
      setDeleteTarget(null);
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const filtered = statusFilter === "all"
    ? list
    : list.filter((p) => (p.status || "PUBLISHED") === statusFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    if (sortBy === "name-desc") return b.name.localeCompare(a.name, undefined, { sensitivity: "base" });
    if (sortBy === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    // Default: Newest first (createdAt desc)
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const columns = [
    {
      id: "image",
      header: "Image",
      cell: (row: Product) => {
        const src = row.images?.[0]?.url;
        return src ? (
          <img src={src} alt={row.name} className="h-12 w-12 object-cover border border-border shrink-0 rounded" />
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        );
      },
    },
    { id: "name", header: "Name", sortKey: "name" as const, cell: (row: Product) => row.name },
    { id: "category", header: "Categories", cell: (row: Product) => (row.categories?.length ? row.categories.map((c) => c.name).join(", ") : "—") },
    { id: "subcategory", header: "SubCategories", cell: (row: Product) => (row.subCategories?.length ? row.subCategories.map((s) => s.name).join(", ") : "—") },
    {
      id: "status",
      header: "Status",
      sortKey: "status" as const,
      cell: (row: Product) => {
        const isDraft = (row.status || "PUBLISHED") === "DRAFT";
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isDraft ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
            {isDraft ? "Draft" : "Published"}
          </span>
        );
      },
    },
    {
      id: "createdAt",
      header: "Created Date",
      sortKey: "createdAt" as const,
      cell: (row: Product) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          {(["all", "PUBLISHED", "DRAFT"] as const).map((opt) => (
            <button key={opt} onClick={() => setStatusFilter(opt)}
              className={`px-3 py-1 text-sm rounded border transition-colors ${statusFilter === opt ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
              {opt === "all" ? "All" : opt === "DRAFT" ? "Drafts" : "Published"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowReorderModal(true)}
            variant="outline"
            size="sm"
            className="gap-2 border-primary/40 hover:bg-primary/5 text-primary font-medium"
          >
            <ArrowUpDown className="h-4 w-4" /> Position & Reorder Products
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-border rounded px-3 py-1 bg-card text-foreground text-sm font-medium focus:ring-primary focus:border-primary"
            >
              <option value="newest">🔥 Newest First (Default)</option>
              <option value="oldest">⏳ Oldest First</option>
              <option value="name-asc">🔤 Name (A → Z)</option>
              <option value="name-desc">🔤 Name (Z → A)</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable<Product>
        data={sorted}
        columns={columns}
        searchPlaceholder="Search products..."
        searchKey="name"
        addButton={{ label: "Add Product", onClick: () => navigate("/products/add") }}
        onEdit={(row) => navigate(`/products/edit/${row.id}`)}
        onDelete={(row) => setDeleteTarget(row)}
        isLoading={isLoading}
        initialSortKey="createdAt"
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete product?"
        description="This will remove all product images from R2 and delete the product. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        loading={deleteMutation.isPending}
      />

      {/* Reorder Modal */}
      {showReorderModal && (
        <ProductReorderModal
          products={list}
          onClose={() => setShowReorderModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setShowReorderModal(false);
          }}
        />
      )}
    </>
  );
}

/* ── Interactive Drag & Drop Reorder Modal ───────────────── */
function ProductReorderModal({
  products,
  onClose,
  onSuccess,
}: {
  products: Product[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    // Clone products list sorted initially by order
    const copy = [...products].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setItems(copy);
  }, [products]);

  const reorderMutation = useMutation({
    mutationFn: () => productsApi.reorder(items.map((i) => i.id)),
    onSuccess: () => {
      toast.success("Product display order saved successfully!");
      onSuccess();
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
  };

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    moveItem(draggedIdx, targetIdx);
    setDraggedIdx(targetIdx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const handlePositionChange = (idx: number, newPosStr: string) => {
    const newPos = parseInt(newPosStr, 10);
    if (isNaN(newPos) || newPos < 1 || newPos > items.length) return;
    moveItem(idx, newPos - 1);
  };

  const filteredItems = search.trim()
    ? items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Product Position & Display Order
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag & drop or use ▲ / ▼ buttons to set exact display position for client homepage & products catalog
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border bg-card">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search product to reorder..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Reorderable List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {filteredItems.map((prod) => {
            const actualIndex = items.findIndex((i) => i.id === prod.id);
            const isDragging = draggedIdx === actualIndex;

            return (
              <div
                key={prod.id}
                draggable
                onDragStart={() => handleDragStart(actualIndex)}
                onDragOver={(e) => handleDragOver(e, actualIndex)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all select-none ${
                  isDragging
                    ? "bg-primary/10 border-primary shadow-lg scale-[1.01]"
                    : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs shrink-0 text-foreground">
                    #{actualIndex + 1}
                  </span>

                  {prod.images?.[0]?.url ? (
                    <img
                      src={prod.images[0].url}
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded border border-border shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">
                      No img
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm line-clamp-1">{prod.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {prod.categories?.map((c) => c.name).join(", ") || "No category"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                    <span className="text-muted-foreground">Pos:</span>
                    <input
                      type="number"
                      min={1}
                      max={items.length}
                      defaultValue={actualIndex + 1}
                      onBlur={(e) => handlePositionChange(actualIndex, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handlePositionChange(actualIndex, (e.target as HTMLInputElement).value);
                      }}
                      className="w-10 text-center font-bold bg-background border border-border rounded py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(actualIndex, actualIndex - 1)}
                      disabled={actualIndex === 0}
                      className="h-5 w-5 p-0"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(actualIndex, actualIndex + 1)}
                      disabled={actualIndex === items.length - 1}
                      className="h-5 w-5 p-0"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <span className="text-xs text-muted-foreground">Total {items.length} products positionable</span>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose} disabled={reorderMutation.isPending}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => reorderMutation.mutate()}
              disabled={reorderMutation.isPending}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              {reorderMutation.isPending ? "Saving Sequence..." : "Save Product Positions"}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
