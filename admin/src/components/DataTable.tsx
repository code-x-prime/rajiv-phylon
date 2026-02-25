import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_PAGE_SIZE = 10;

type Column<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortKey?: keyof T | string;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T | ((row: T) => string);
  addButton?: { label: string; onClick: () => void };
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  initialSortKey?: keyof T | string;
};

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchKey,
  addButton,
  onEdit,
  onDelete,
  isLoading,
  emptyMessage = "No data.",
  initialSortKey,
}: DataTableProps<T>) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<keyof T | string | undefined>(initialSortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filtered = useMemo(() => {
    let list = [...data];
    if (search.trim() && searchKey) {
      const s = search.trim().toLowerCase();
      list = list.filter((row) => {
        const val = typeof searchKey === "function" ? searchKey(row) : String(row[searchKey as keyof T] ?? "");
        return String(val).toLowerCase().includes(s);
      });
    }
    if (sortKey) {
      list.sort((a, b) => {
        const av = a[sortKey as keyof T];
        const bv = b[sortKey as keyof T];
        const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [data, search, searchKey, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Input
          placeholder={searchPlaceholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-sm border-border"
        />
        {addButton && (
          <Button onClick={addButton.onClick} className="bg-primary text-primary-foreground">
            {addButton.label}
          </Button>
        )}
      </div>

      <div className="border border-border bg-card">
        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.id}>{col.header}</TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead className="w-24">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      <div className="h-5 bg-muted animate-pulse w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && <TableCell><div className="h-5 w-10 bg-muted animate-pulse" /></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.id}
                    className={col.sortKey ? "cursor-pointer select-none" : ""}
                    onClick={() => col.sortKey && handleSort(col.sortKey)}
                  >
                    {col.header}
                  </TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead className="w-24">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center text-muted-foreground py-8">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((row, idx) => (
                  <TableRow key={(row.id as string) ?? idx}>
                    {columns.map((col) => (
                      <TableCell key={col.id}>{col.cell(row)}</TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell>
                        <div className="flex gap-1">
                          {onEdit && (
                            <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(row)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {!isLoading && filtered.length > pageSize && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
