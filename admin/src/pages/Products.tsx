import { useEffect, useState } from "react";
import JoditEditor from "jodit-react";
import { productsApi, categoriesApi, subCategoriesApi, type Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, CheckSquare, Square, Tag } from "lucide-react";
import { toast } from "sonner";

type Category = { id: string; name: string };
type SubCategory = { id: string; name: string; categoryId: string };

export function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isHighDemand, setIsHighDemand] = useState(false);
  const [showOnHome, setShowOnHome] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Bulk assign
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkCategoryId, setBulkCategoryId] = useState("");
  const [bulkSubCategoryId, setBulkSubCategoryId] = useState("");
  const [bulkSubCategories, setBulkSubCategories] = useState<SubCategory[]>([]);
  const [bulkAssigning, setBulkAssigning] = useState(false);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!categoryId) {
      setSubCategories([]);
      setSubCategoryId("");
      return;
    }
    subCategoriesApi.getByCategory(categoryId).then(setSubCategories).catch(() => setSubCategories([]));
  }, [categoryId]);

  useEffect(() => {
    if (!bulkCategoryId) {
      setBulkSubCategories([]);
      setBulkSubCategoryId("");
      return;
    }
    subCategoriesApi.getByCategory(bulkCategoryId).then(setBulkSubCategories).catch(() => setBulkSubCategories([]));
  }, [bulkCategoryId]);

  const load = () => {
    setLoading(true);
    productsApi
      .getAll()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) {
      setImages((prev) => prev.concat(files.slice(0, 4 - prev.length)));
      setImagePreviews((prev) => {
        const next = [...prev];
        files.slice(0, 4 - images.length).forEach((f) => next.push(URL.createObjectURL(f)));
        return next.slice(0, 4);
      });
    } else {
      setImages((prev) => prev.concat(files));
      setImagePreviews((prev) => prev.concat(files.map((f) => URL.createObjectURL(f))));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description || undefined,
        categoryIds: [categoryId],
        subCategoryIds: subCategoryId ? [subCategoryId] : [],
        isFeatured,
        isNewArrival,
        isHighDemand,
        showOnHome,
        isActive,
      };
      if (editingId) {
        await productsApi.update(editingId, payload, images.length ? images : undefined);
        setEditingId(null);
      } else {
        await productsApi.create(payload, images.length ? images : undefined);
      }
      resetForm();
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  function resetForm() {
    setName("");
    setDescription("");
    setCategoryId("");
    setSubCategoryId("");
    setImages([]);
    imagePreviews.forEach(URL.revokeObjectURL);
    setImagePreviews([]);
    setEditingId(null);
    setIsFeatured(false);
    setIsNewArrival(false);
    setIsHighDemand(false);
    setShowOnHome(false);
    setIsActive(true);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsApi.delete(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description || "");
    setCategoryId((p as { categories?: { id: string }[] }).categories?.[0]?.id ?? "");
    setSubCategoryId((p as { subCategories?: { id: string }[] }).subCategories?.[0]?.id ?? "");
    setImages([]);
    setImagePreviews([]);
    setIsFeatured(p.isFeatured ?? false);
    setIsNewArrival(p.isNewArrival ?? false);
    setIsHighDemand(p.isHighDemand ?? false);
    setShowOnHome(p.showOnHome ?? false);
    setIsActive(p.isActive !== false);
  };

  // Bulk selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === list.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(list.map((p) => p.id)));
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkCategoryId) {
      toast.error("Select a category first");
      return;
    }
    if (selectedIds.size === 0) {
      toast.error("Select products first");
      return;
    }
    setBulkAssigning(true);
    try {
      const result = await productsApi.bulkAssignCategories(
        Array.from(selectedIds),
        [bulkCategoryId],
        bulkSubCategoryId ? [bulkSubCategoryId] : []
      );
      toast.success(`Updated ${result.data?.updated || selectedIds.size} products`);
      setSelectedIds(new Set());
      setBulkCategoryId("");
      setBulkSubCategoryId("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to assign categories");
    } finally {
      setBulkAssigning(false);
    }
  };

  const hasUncategorized = list.some((p) => !p.categories?.length);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Product Management</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Add"} Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>SubCategory (optional)</Label>
              <select
                className="flex h-10 w-full max-w-xs border border-input bg-background px-3 py-2 text-sm"
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
              >
                <option value="">None</option>
                {subCategories.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="border-border" />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="border-border" />
                <span className="text-sm">New Arrival</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isHighDemand} onChange={(e) => setIsHighDemand(e.target.checked)} className="border-border" />
                <span className="text-sm">High Demand</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showOnHome} onChange={(e) => setShowOnHome(e.target.checked)} className="border-border" />
                <span className="text-sm">Show on Home</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="border-border" />
                <span className="text-sm">Active</span>
              </label>
            </div>
            <div className="space-y-2">
              <Label>Description (Jodit)</Label>
              <JoditEditor
                value={description}
                onBlur={(v) => setDescription(v)}
                config={{ height: 280 }}
              />
            </div>
            <div className="space-y-2">
              <Label>Images (max 4, order = position)</Label>
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 border rounded overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs p-1"
                      onClick={() => removeImage(i)}
                    >
                      ×
                    </button>
                    <span className="absolute bottom-0 left-0 bg-black/60 text-white text-xs px-1">#{i + 1}</span>
                  </div>
                ))}
                {imagePreviews.length < 4 && (
                  <label className="w-20 h-20 border border-dashed flex items-center justify-center cursor-pointer text-muted-foreground hover:bg-muted/50">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={onImageChange} />
                    +
                  </label>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {editingId ? "Update" : "Create"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => resetForm()}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Bulk Assign Panel */}
      {hasUncategorized && (
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Tag className="h-5 w-5" />
              Bulk Category Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-600 mb-3">
              Some products have no categories assigned. Select products and assign categories below.
            </p>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs">Category *</Label>
                <select
                  className="flex h-9 w-full border border-amber-300 bg-white px-3 py-1.5 text-sm mt-1"
                  value={bulkCategoryId}
                  onChange={(e) => setBulkCategoryId(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs">SubCategory (optional)</Label>
                <select
                  className="flex h-9 w-full border border-amber-300 bg-white px-3 py-1.5 text-sm mt-1"
                  value={bulkSubCategoryId}
                  onChange={(e) => setBulkSubCategoryId(e.target.value)}
                >
                  <option value="">None</option>
                  {bulkSubCategories.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleBulkAssign}
                disabled={!bulkCategoryId || selectedIds.size === 0 || bulkAssigning}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {bulkAssigning ? "Assigning..." : `Assign to ${selectedIds.size || "..."} products`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Products</CardTitle>
            {selectedIds.size > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedIds.size} selected
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <button onClick={toggleSelectAll} className="text-muted-foreground hover:text-foreground">
                      {selectedIds.size === list.length && list.length > 0 ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Home</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((p) => (
                  <TableRow key={p.id} className={selectedIds.has(p.id) ? "bg-amber-50/50" : ""}>
                    <TableCell>
                      <button onClick={() => toggleSelect(p.id)} className="text-muted-foreground hover:text-foreground">
                        {selectedIds.has(p.id) ? (
                          <CheckSquare className="h-4 w-4 text-amber-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.slug}</TableCell>
                    <TableCell>
                      {p.categories?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {p.categories.map((c) => (
                            <span key={c.id} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{c.name}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No category</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {p.isFeatured && <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">Featured</span>}
                        {p.isNewArrival && <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">New</span>}
                        {p.isHighDemand && <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">High</span>}
                        {p.isActive === false && <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Inactive</span>}
                        {!p.isFeatured && !p.isNewArrival && !p.isHighDemand && p.isActive !== false && <span className="text-muted-foreground text-xs">—</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => startEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
