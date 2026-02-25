import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { categoriesApi, productsApi, galleryApi, contactApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FolderTree,
  Package,
  Images,
  MessageSquare,
  ImageIcon,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";

const STAT_CARDS = [
  {
    key: "categories",
    label: "Categories",
    icon: FolderTree,
    color: "text-blue-600",
    bg: "bg-blue-50",
    link: "/categories",
  },
  {
    key: "products",
    label: "Products",
    icon: Package,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    link: "/products",
  },
  {
    key: "gallery",
    label: "Gallery Images",
    icon: Images,
    color: "text-violet-600",
    bg: "bg-violet-50",
    link: "/gallery",
  },
  {
    key: "inquiries",
    label: "Contact Inquiries",
    icon: MessageSquare,
    color: "text-amber-600",
    bg: "bg-amber-50",
    link: "/contact",
  },
];

const QUICK_LINKS = [
  { label: "Add Product", to: "/products/add", icon: Package, desc: "Create a new product listing" },
  { label: "Manage Banners", to: "/banners", icon: ImageIcon, desc: "Update home page banners" },
  { label: "Add Category", to: "/categories", icon: FolderTree, desc: "Create a new category" },
  { label: "Add SubCategory", to: "/subcategories", icon: Layers, desc: "Create a new subcategory" },
  { label: "View Inquiries", to: "/contact", icon: MessageSquare, desc: "Review contact inquiries" },
  { label: "Upload Gallery", to: "/gallery", icon: Images, desc: "Add images to gallery" },
];

export function Dashboard() {
  const { data: categories = [], isLoading: loadingCat } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });
  const { data: products = [], isLoading: loadingProd } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getAll(),
  });
  const { data: gallery = [], isLoading: loadingGallery } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => galleryApi.getAll(),
  });
  const { data: inquiriesData, isLoading: loadingInq } = useQuery({
    queryKey: ["contact", "count"],
    queryFn: () => contactApi.getInquiries({ page: 1, limit: 1 }),
  });

  const isLoading = loadingCat || loadingProd || loadingGallery || loadingInq;

  const statValues: Record<string, number> = {
    categories: categories.length,
    products: products.length,
    gallery: gallery.length,
    inquiries: inquiriesData?.total ?? 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Overview</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back — here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
          <Clock className="h-3.5 w-3.5" />
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, bg, link }) => (
          <Link key={key} to={link} className="block group">
            <Card className="border-border hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">{statValues[key]}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 group-hover:text-primary transition-colors">
                  View all <ArrowRight className="h-3 w-3" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pending inquiries alert */}
      {!isLoading && (inquiriesData?.total ?? 0) > 0 && (
        <Link
          to="/contact"
          className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
        >
          <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              {inquiriesData?.total} total contact inquiries
            </p>
            <p className="text-xs text-amber-700 mt-0.5">Click to view and manage all inquiries</p>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-600 shrink-0" />
        </Link>
      )}

      {/* Quick links */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map(({ label, to, icon: Icon, desc }) => (
            <Link
              key={to}
              to={to}
              className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card hover:border-primary/40 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Loading skeleton for quick links */}
      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border border-border rounded-lg space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
