import React, { useState, useEffect } from "react";
import { api, getApiError } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Upload,
  Link as LinkIcon,
  RefreshCw,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface CatalogueData {
  id?: string;
  title: string;
  year: string;
  pdfUrl: string;
  fileSize?: string;
  isActive?: boolean;
  updatedAt?: string;
}

export function CataloguePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [catalogue, setCatalogue] = useState<CatalogueData | null>(null);

  // Form states
  const [uploadMode, setUploadMode] = useState<"file" | "url">("url");
  const [title, setTitle] = useState("Product Catalogue 2026");
  const [year, setYear] = useState("2026");
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const fetchCatalogue = async () => {
    try {
      setLoading(true);
      const res = await api.get("/catalogue");
      const data = res.data?.data || res.data;
      if (data) {
        setCatalogue(data);
        setTitle(data.title || "Product Catalogue 2026");
        setYear(data.year || "2026");
        setPdfUrl(data.pdfUrl || "");
        setFileSize(data.fileSize || "");
      }
    } catch (err) {
      console.error("Failed to load catalogue info:", err);
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Please select a valid PDF file");
        return;
      }
      setPdfFile(selected);
      const sizeMb = (selected.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} MB`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadMode === "file" && !pdfFile) {
      toast.error("Please select a PDF file to upload");
      return;
    }

    if (uploadMode === "url" && !pdfUrl.trim()) {
      toast.error("Please enter a valid PDF URL");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("year", year);
      formData.append("fileSize", fileSize);

      if (uploadMode === "file" && pdfFile) {
        formData.append("pdf", pdfFile);
      } else {
        formData.append("pdfUrl", pdfUrl);
      }

      const res = await api.post("/catalogue", formData);
      const updatedData = res.data?.data || res.data;

      setCatalogue(updatedData);
      setPdfFile(null);
      toast.success("Catalogue replaced & published successfully!");
    } catch (err) {
      console.error("Replace catalogue error:", err);
      toast.error(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to reset the active catalogue?")) return;

    try {
      setSubmitting(true);
      const res = await api.delete("/catalogue");
      const data = res.data?.data || res.data;
      setCatalogue(data);
      setPdfUrl(data.pdfUrl || "");
      toast.success("Catalogue reset to default");
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Catalogue Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Replace, upload or update the active PDF catalogue for <code className="text-primary font-mono text-xs">/catalog</code> page
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCatalogue}
          disabled={loading}
          className="gap-2 shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Status
        </Button>
      </div>

      {/* Active Catalogue Info Card */}
      <Card className="border-primary/20 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Active Published Catalogue
            </CardTitle>
            {catalogue && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Live on Website
              </span>
            )}
          </div>
          <CardDescription>
            This PDF catalogue is currently displayed on your main website.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : catalogue ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Catalogue Title</p>
                <p className="text-base font-bold text-foreground mt-0.5">{catalogue.title || "Product Catalogue"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Catalogue Year / Season</p>
                <p className="text-base font-bold text-primary mt-0.5">{catalogue.year || "2026"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">File Size</p>
                <p className="text-sm font-mono text-foreground mt-0.5">{catalogue.fileSize || "Dynamic Size"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Updated</p>
                <p className="text-sm text-foreground mt-0.5">
                  {catalogue.updatedAt ? new Date(catalogue.updatedAt).toLocaleString("en-IN") : "Just now"}
                </p>
              </div>

              <div className="md:col-span-2 pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">PDF File URL</p>
                  <a
                    href={catalogue.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-primary hover:underline truncate block"
                  >
                    {catalogue.pdfUrl}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={catalogue.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open PDF
                  </a>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="gap-1.5 text-xs h-8"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              No active catalogue set. Update below to publish a new catalogue.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Replace / Upload New Catalogue Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Replace with New Catalogue
          </CardTitle>
          <CardDescription>
            Upload a new PDF file or paste a PDF link (e.g. 2026 Catalogue) to replace the live website version.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mode Switcher */}
            <div className="flex items-center gap-3 p-1.5 bg-muted rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  uploadMode === "url"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                Paste PDF URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  uploadMode === "file"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload PDF File
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-title">Catalogue Title</Label>
                <Input
                  id="cat-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product Catalogue 2026"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cat-year">Year / Season</Label>
                <Input
                  id="cat-year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2026"
                  required
                />
              </div>
            </div>

            {uploadMode === "url" ? (
              <div className="space-y-2">
                <Label htmlFor="cat-url">PDF Document URL</Label>
                <Input
                  id="cat-url"
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://your-r2-cdn-domain.com/catalogue.pdf"
                  required={uploadMode === "url"}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the direct URL of your newly uploaded PDF file from R2 or CDN.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="cat-file">Select PDF File from Computer</Label>
                <Input
                  id="cat-file"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  required={uploadMode === "file" && !pdfFile}
                  className="cursor-pointer"
                />
                {pdfFile && (
                  <p className="text-xs text-emerald-500 font-medium">
                    Selected File: {pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  The file will automatically upload to Cloudflare R2 storage and update your website.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cat-size">File Size Badge (Optional)</Label>
              <Input
                id="cat-size"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 64 MB or 554 MB"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto font-semibold gap-2 min-w-[200px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading & Replacing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Publish & Replace Catalogue
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
