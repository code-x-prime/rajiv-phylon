import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  contactApi,
  type ContactInquiry,
  type InquiryStatus,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { getApiError } from "@/lib/axios";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  MoreHorizontal,
  Package,
  Mail,
  Phone,
  User,
  Calendar,
  Tag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
];

const STATUS_STYLES: Record<InquiryStatus, string> = {
  PENDING: "bg-gray-100 text-gray-800 border-gray-200",
  CONTACTED: "bg-blue-100 text-blue-800 border-blue-200",
  IN_PROGRESS: "bg-amber-100 text-amber-800 border-amber-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border ${STATUS_STYLES[status] ?? STATUS_STYLES.PENDING}`}
    >
      {STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status}
    </span>
  );
}

const PAGE_SIZE = 10;

export function Contact() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [detailItem, setDetailItem] = useState<ContactInquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactInquiry | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading } = useQuery({
    queryKey: [
      "contact",
      "inquiries",
      page,
      search,
      statusFilter,
      dateFrom,
      dateTo,
    ],
    queryFn: () =>
      contactApi.getInquiries({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: statusFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: {
      id: string;
      status?: InquiryStatus;
      adminNotes?: string | null;
      followUpDate?: string | null;
    }) =>
      contactApi.updateInquiry(payload.id, {
        status: payload.status,
        adminNotes: payload.adminNotes,
        followUpDate: payload.followUpDate,
      }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      if (detailItem?.id === updated.id) setDetailItem(updated);
      toast.success("Inquiry updated");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactApi.deleteInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      setDeleteTarget(null);
      if (detailItem && deleteTarget?.id === detailItem.id) setDetailItem(null);
      toast.success("Inquiry deleted");
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const inquiries = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleQuickStatus = (inquiry: ContactInquiry, newStatus: InquiryStatus) => {
    updateMutation.mutate({ id: inquiry.id, status: newStatus });
  };

  const handleSaveDetail = (payload: {
    adminNotes?: string | null;
    followUpDate?: string | null;
    status?: InquiryStatus;
  }) => {
    if (!detailItem) return;
    updateMutation.mutate({
      id: detailItem.id,
      ...payload,
    });
  };

  return (
    <div className="space-y-4" style={{ backgroundColor: "#f6f7f9" }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search by name or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-xs border-[#e5e7eb] bg-white"
          />
          <Select value={statusFilter || "all"} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-[140px] border-[#e5e7eb] bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="w-[140px] border-[#e5e7eb] bg-white"
            placeholder="From"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="w-[140px] border-[#e5e7eb] bg-white"
            placeholder="To"
          />
        </div>
        <div className="flex items-center gap-1 border border-[#e5e7eb] bg-white p-1">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border border-[#e5e7eb] bg-white">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center animate-pulse">
                <div className="h-4 bg-[#f6f7f9] rounded w-28" />
                <div className="h-4 bg-[#f6f7f9] rounded w-24" />
                <div className="h-4 bg-[#f6f7f9] rounded w-36" />
                <div className="h-4 bg-[#f6f7f9] rounded flex-1" />
                <div className="h-6 bg-[#f6f7f9] rounded w-20" />
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No inquiries found. Try adjusting filters or search.
          </div>
        ) : viewMode === "list" ? (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-[#e5e7eb]">
                  <TableHead className="border-[#e5e7eb]">Name</TableHead>
                  <TableHead className="border-[#e5e7eb]">Contact</TableHead>
                  <TableHead className="border-[#e5e7eb]">Product / Qty</TableHead>
                  <TableHead className="border-[#e5e7eb]">Message</TableHead>
                  <TableHead className="border-[#e5e7eb]">Status</TableHead>
                  <TableHead className="border-[#e5e7eb]">Date</TableHead>
                  <TableHead className="border-[#e5e7eb] w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((row) => (
                  <TableRow key={row.id} className="border-[#e5e7eb]">
                    <TableCell className="border-[#e5e7eb] font-medium">{row.name}</TableCell>
                    <TableCell className="border-[#e5e7eb]">
                      <div className="space-y-0.5">
                        <p className="text-sm">{row.phone}</p>
                        {row.email && <p className="text-xs text-muted-foreground">{row.email}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="border-[#e5e7eb]">
                      <div className="space-y-0.5">
                        {row.productName && (
                          <p className="text-xs font-medium text-primary truncate max-w-[160px]" title={row.productName}>
                            {row.productName}
                          </p>
                        )}
                        {row.quantity && (
                          <p className="text-xs text-muted-foreground">
                            Qty: {row.quantity}{row.unit ? ` ${row.unit}` : ""}
                          </p>
                        )}
                        {!row.productName && !row.quantity && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="border-[#e5e7eb] max-w-[200px]">
                      <button
                        type="button"
                        className="text-left text-primary hover:underline truncate block max-w-full"
                        onClick={() => setDetailItem(row)}
                      >
                        {row.message.slice(0, 50)}
                        {row.message.length > 50 ? "…" : ""}
                      </button>
                    </TableCell>
                    <TableCell className="border-[#e5e7eb]">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="border-[#e5e7eb] text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="border-[#e5e7eb]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-[#e5e7eb]">
                          {STATUS_OPTIONS.map((s) => (
                            <DropdownMenuItem
                              key={s.value}
                              onClick={() => handleQuickStatus(row, s.value)}
                            >
                              {s.label}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuItem onClick={() => setDetailItem(row)}>
                            View / Edit details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteTarget(row)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#e5e7eb]">
                <p className="text-sm text-muted-foreground">
                  {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, total)} of {total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="border-[#e5e7eb]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="border-[#e5e7eb]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inquiries.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setDetailItem(row)}
                className="text-left border border-[#e5e7eb] p-4 bg-white hover:border-[#374151] transition-colors rounded-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-[#111827]">{row.name}</p>
                  <StatusBadge status={row.status} />
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />{row.phone}
                  </p>
                  {row.email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />{row.email}
                    </p>
                  )}
                  {row.productName && (
                    <p className="text-xs font-medium text-primary flex items-center gap-1">
                      <Package className="h-3 w-3" />{row.productName}
                    </p>
                  )}
                  {row.quantity && (
                    <p className="text-xs text-muted-foreground">
                      Qty: {row.quantity}{row.unit ? ` ${row.unit}` : ""}
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </button>
            ))}
            {totalPages > 1 && (
              <div className="col-span-full flex items-center justify-between pt-4 border-t border-[#e5e7eb]">
                <p className="text-sm text-muted-foreground">
                  {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, total)} of {total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="border-[#e5e7eb]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="border-[#e5e7eb]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <DetailDrawer
        inquiry={detailItem}
        onClose={() => setDetailItem(null)}
        onSave={handleSaveDetail}
        isLoading={updateMutation.isPending}
        statusOptions={STATUS_OPTIONS}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete inquiry?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

function DetailDrawer({
  inquiry,
  onClose,
  onSave,
  isLoading,
  statusOptions,
}: {
  inquiry: ContactInquiry | null;
  onClose: () => void;
  onSave: (payload: {
    adminNotes?: string | null;
    followUpDate?: string | null;
    status?: InquiryStatus;
  }) => void;
  isLoading: boolean;
  statusOptions: { value: InquiryStatus; label: string }[];
}) {
  const [adminNotes, setAdminNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [status, setStatus] = useState<InquiryStatus>("PENDING");

  /* eslint-disable react-hooks/set-state-in-effect -- sync form from selected inquiry */
  useEffect(() => {
    if (inquiry) {
      setAdminNotes(inquiry.adminNotes ?? "");
      setFollowUpDate(
        inquiry.followUpDate
          ? new Date(inquiry.followUpDate).toISOString().slice(0, 10)
          : ""
      );
      setStatus(inquiry.status);
    }
  }, [inquiry]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!inquiry) return null;

  const handleSave = () => {
    onSave({
      adminNotes: adminNotes.trim() || null,
      followUpDate: followUpDate ? new Date(followUpDate).toISOString() : null,
      status,
    });
  };

  return (
    <Dialog open={!!inquiry} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-[#e5e7eb]">
        <DialogHeader>
          <DialogTitle>Inquiry details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-[#f6f7f9] p-3 rounded-lg border border-[#e5e7eb]">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium">{inquiry.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <a href={`tel:${inquiry.phone}`} className="hover:underline">{inquiry.phone}</a>
            </div>
            {inquiry.email && (
              <div className="col-span-2 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <a href={`mailto:${inquiry.email}`} className="hover:underline text-primary">{inquiry.email}</a>
              </div>
            )}
            {inquiry.productName && (
              <div className="col-span-2 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium text-primary">{inquiry.productName}</span>
              </div>
            )}
            {inquiry.quantity && (
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>Qty: {inquiry.quantity}{inquiry.unit ? ` ${inquiry.unit}` : ""}</span>
              </div>
            )}
            {inquiry.source && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <span>Source: {inquiry.source}</span>
              </div>
            )}
            <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{new Date(inquiry.createdAt).toLocaleString("en-IN")}</span>
            </div>
            {inquiry.lastUpdatedBy && (
              <p className="col-span-2 text-xs text-muted-foreground">
                Last updated by: {inquiry.lastUpdatedBy.name || inquiry.lastUpdatedBy.email}
              </p>
            )}
          </div>
          <div>
            <Label>Message</Label>
            <div className="mt-1 p-3 border border-[#e5e7eb] bg-[#f6f7f9] whitespace-pre-wrap text-sm">
              {inquiry.message}
            </div>
          </div>
          <div>
            <Label>Admin notes</Label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="mt-1 w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white"
              placeholder="Add notes..."
            />
          </div>
          <div>
            <Label>Follow-up date</Label>
            <Input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="mt-1 border-[#e5e7eb] bg-white"
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as InquiryStatus)}>
              <SelectTrigger className="mt-1 border-[#e5e7eb] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="border-[#e5e7eb]">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-[#111827] text-white hover:bg-[#374151]"
            >
              {isLoading ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
