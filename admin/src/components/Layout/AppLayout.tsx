import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderTree,
  Layers,
  Package,
  Images,
  MessageSquare,
  LogOut,
  Menu,
  ChevronLeft,
  Search,
  ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/banners", label: "Banners", icon: ImageIcon },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/subcategories", label: "SubCategories", icon: Layers },
  { to: "/products", label: "Products", icon: Package },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/contact", label: "Contact Inquiries", icon: MessageSquare },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/products/add")) return "Add Product";
  if (pathname.startsWith("/products/edit")) return "Edit Product";
  if (pathname.startsWith("/categories")) return "Categories";
  if (pathname.startsWith("/subcategories")) return "SubCategories";
  if (pathname.startsWith("/products")) return "Products";
  if (pathname.startsWith("/gallery")) return "Gallery";
  if (pathname.startsWith("/contact")) return "Contact Inquiries";
  if (pathname.startsWith("/banners")) return "Banners";
  return "Admin";
}

export function AppLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pathname = location.pathname;
  const pageTitle = getPageTitle(pathname);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar overlay (mobile) */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />

      {/* Sidebar - always visible on lg, drawer on mobile */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full border-r border-border bg-card flex flex-col transition-all duration-200",
          "w-56",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          sidebarCollapsed ? "lg:w-16" : "lg:w-56"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-3 min-w-0">
          {!sidebarCollapsed && (
            <span className="font-semibold text-primary truncate">Admin</span>
          )}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8"
              onClick={() => setSidebarCollapsed((c) => !c)}
            >
              <ChevronLeft className={cn("h-4 w-4", sidebarCollapsed && "rotate-180")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                pathname === to || (to !== "/" && pathname.startsWith(to))
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
                sidebarCollapsed && "justify-center px-0"
              )}
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-200",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-56"
        )}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground truncate min-w-0">
            {pageTitle}
          </h1>
          <div className="flex-1 flex justify-end lg:justify-center max-w-xs lg:max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search"
                className="pl-8 h-9 bg-muted/50 border-border w-full"
              />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 shrink-0 h-9">
                <span className="hidden sm:inline text-sm text-foreground truncate max-w-[120px]">{admin?.email}</span>
                <span className="h-8 w-8 shrink-0 bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {(admin?.name || admin?.email || "A").charAt(0).toUpperCase()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
