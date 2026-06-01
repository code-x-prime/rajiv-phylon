import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAdminAuth } from "@/components/RequireAdminAuth";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Categories } from "@/pages/Categories";
import { SubCategories } from "@/pages/SubCategories";
import { ProductList } from "@/pages/products/ProductList";
import { ProductAdd } from "@/pages/products/ProductAdd";
import { ProductEdit } from "@/pages/products/ProductEdit";
import { Gallery } from "@/pages/Gallery";
import { Contact } from "@/pages/Contact";
import { Banners } from "@/pages/Banners";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAdminAuth>
                  <AppLayout />
                </RequireAdminAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="subcategories" element={<SubCategories />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<ProductAdd />} />
              <Route path="products/edit/:id" element={<ProductEdit />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
              <Route path="banners" element={<Banners />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
