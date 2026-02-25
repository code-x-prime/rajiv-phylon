import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import { createSlug } from "../helper/create-slug.js";
import { uploadFile, getPublicUrl, deleteFileByUrl } from "../service/r2Service.js";

export const create = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name?.trim()) throw new ApiError(400, "Category name is required");

    const slug = createSlug(name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) throw new ApiError(409, "Category with this slug already exists");

    let imageUrl = null;
    if (req.file) {
        imageUrl = await uploadFile(req.file, "categories");
    }

    const category = await prisma.category.create({
        data: {
            name: name.trim(),
            slug,
            image: imageUrl,
            showOnHome: req.body.showOnHome === true || req.body.showOnHome === "true",
            homeOrder: parseInt(req.body.homeOrder, 10) || 0,
        },
    });
    res.status(201).json(new ApiResponsive(201, category, "Category created"));
});

export const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new ApiError(404, "Category not found");

    const data = {};
    if (name?.trim()) {
        data.name = name.trim();
        data.slug = createSlug(name);
    }
    if (req.body.showOnHome !== undefined) data.showOnHome = req.body.showOnHome === true || req.body.showOnHome === "true";
    if (req.body.homeOrder !== undefined && req.body.homeOrder !== "") data.homeOrder = parseInt(req.body.homeOrder, 10) || 0;
    if (req.file) {
        if (category.image) {
            try {
                await deleteFileByUrl(category.image);
            } catch (e) {
                console.warn("R2 delete old category image warning:", e);
            }
        }
        data.image = await uploadFile(req.file, "categories");
    }

    const updated = await prisma.category.update({
        where: { id },
        data,
    });
    res.status(200).json(new ApiResponsive(200, updated, "Category updated"));
});

export const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
        where: { id },
        include: { subCategories: true },
    });
    if (!category) throw new ApiError(404, "Category not found");

    for (const sub of category.subCategories) {
        await prisma.productSubCategory.deleteMany({ where: { subCategoryId: sub.id } });
    }
    await prisma.subCategory.deleteMany({ where: { categoryId: id } });
    await prisma.productCategory.deleteMany({ where: { categoryId: id } });
    await prisma.category.delete({ where: { id } });
    res.status(200).json(new ApiResponsive(200, null, "Category deleted"));
});

export const getAll = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { subCategories: true, productCategories: true } } },
    });
    const withImageUrl = categories.map((c) => ({
        ...c,
        imageUrl: c.image ? (c.image.startsWith("http") ? c.image : getPublicUrl(c.image)) : null,
    }));
    res.status(200).json(new ApiResponsive(200, withImageUrl, "Success"));
});

export const getAllWithSubcategories = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            subCategories: { orderBy: { name: "asc" } },
        },
    });
    const withImageUrl = categories.map((c) => ({
        ...c,
        imageUrl: c.image ? (c.image.startsWith("http") ? c.image : getPublicUrl(c.image)) : null,
        subCategories: (c.subCategories || []).map((s) => ({
            ...s,
            imageUrl: s.image ? (s.image.startsWith("http") ? s.image : getPublicUrl(s.image)) : null,
        })),
    }));
    res.status(200).json(new ApiResponsive(200, withImageUrl, "Success"));
});

/** GET categories for home – showOnHome = true, include subCategories, sort by homeOrder */
export const getHome = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
        where: { showOnHome: true },
        orderBy: { homeOrder: "asc" },
        include: {
            subCategories: { orderBy: { name: "asc" } },
        },
    });
    const withImageUrl = categories.map((c) => ({
        ...c,
        imageUrl: c.image ? (c.image.startsWith("http") ? c.image : getPublicUrl(c.image)) : null,
        subCategories: (c.subCategories || []).map((s) => ({
            ...s,
            imageUrl: s.image ? (s.image.startsWith("http") ? s.image : getPublicUrl(s.image)) : null,
        })),
    }));
    res.status(200).json(new ApiResponsive(200, withImageUrl, "Success"));
});
