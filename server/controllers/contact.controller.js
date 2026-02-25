import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";

const VALID_STATUSES = ["PENDING", "CONTACTED", "IN_PROGRESS", "COMPLETED", "REJECTED"];

/**
 * Create contact inquiry (public – no auth)
 * Body: name, phone, message (required); email, quantity, unit, productId, productName, source (optional)
 */
export const createInquiry = asyncHandler(async (req, res) => {
    const { name, phone, message, quantity, unit, productId, productName, source, email, companyName } = req.body;

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
        throw new ApiError(400, "Name, phone, and message are required");
    }

    const inquiry = await prisma.contactInquiry.create({
        data: {
            name: name.trim(),
            phone: phone.trim(),
            message: message.trim(),
            quantity: quantity != null ? String(quantity).trim() : null,
            unit: unit?.trim() || null,
            productId: productId?.trim() || null,
            productName: productName?.trim() || null,
            source: source?.trim() || null,
            email: email?.trim() || null,
        },
    });
    res.status(201).json(new ApiResponsive(201, inquiry, "Inquiry submitted successfully"));
});

/**
 * GET inquiries with pagination, search (name, phone), status filter, date range
 * Query: page=1, limit=10, search=, status=, dateFrom=, dateTo=
 */
export const getInquiries = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const search = (req.query.search || "").trim().toLowerCase();
    const status = req.query.status;
    const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null;
    const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null;

    const where = {};

    if (status && VALID_STATUSES.includes(String(status).toUpperCase())) {
        where.status = String(status).toUpperCase();
    }

    if (dateFrom && !isNaN(dateFrom.getTime())) {
        where.createdAt = where.createdAt || {};
        where.createdAt.gte = dateFrom;
    }
    if (dateTo && !isNaN(dateTo.getTime())) {
        where.createdAt = where.createdAt || {};
        where.createdAt.lte = dateTo;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
        ];
    }

    const [inquiries, total] = await Promise.all([
        prisma.contactInquiry.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: { lastUpdatedBy: { select: { id: true, name: true, email: true } } },
        }),
        prisma.contactInquiry.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    res.status(200).json(
        new ApiResponsive(
            200,
            { data: inquiries, total, page, limit, totalPages },
            "Success"
        )
    );
});

/**
 * PATCH / PUT update single inquiry: status, adminNotes, followUpDate
 */
export const updateInquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, adminNotes, followUpDate } = req.body;
    const adminId = req.user?.id || null;

    const existing = await prisma.contactInquiry.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Inquiry not found");

    const data = { lastUpdatedById: adminId };
    if (status !== undefined) {
        const s = String(status).toUpperCase();
        if (!VALID_STATUSES.includes(s)) throw new ApiError(400, "Invalid status");
        data.status = s;
    }
    if (adminNotes !== undefined) data.adminNotes = adminNotes ? String(adminNotes).trim() : null;
    if (followUpDate !== undefined) {
        data.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }

    const updated = await prisma.contactInquiry.update({
        where: { id },
        data,
        include: { lastUpdatedBy: { select: { id: true, name: true, email: true } } },
    });
    res.status(200).json(new ApiResponsive(200, updated, "Updated"));
});

/**
 * DELETE inquiry
 */
export const deleteInquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await prisma.contactInquiry.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Inquiry not found");
    await prisma.contactInquiry.delete({ where: { id } });
    res.status(200).json(new ApiResponsive(200, null, "Deleted"));
});
