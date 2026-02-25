import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import { createSlug } from "../helper/create-slug.js";
import { uploadFile, getPublicUrl, deleteFileByUrl } from "../service/r2Service.js";

export const create = asyncHandler(async (req, res) => {
    const { name, categoryId } = req.body;
    if (!name?.trim()) throw new ApiError(400, "SubCategory name is required");
    if (!categoryId) throw new ApiError(400, "categoryId is required");

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new ApiError(404, "Category not found");

    const slug = createSlug(name);
    const existing = await prisma.subCategory.findUnique({ where: { slug } });
    if (existing) throw new ApiError(409, "SubCategory with this slug already exists");

    let imageUrl = null;
    if (req.file) {
        imageUrl = await uploadFile(req.file, "subcategories");
    }

    const subCategory = await prisma.subCategory.create({
        data: { name: name.trim(), slug, categoryId, image: imageUrl },
    });
    res.status(201).json(new ApiResponsive(201, subCategory, "SubCategory created"));
});

export const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    const subCategory = await prisma.subCategory.findUnique({ where: { id } });
    if (!subCategory) throw new ApiError(404, "SubCategory not found");

    const data = {};
    if (name?.trim()) {
        data.name = name.trim();
        data.slug = createSlug(name);
    }
    if (categoryId) {
        const cat = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!cat) throw new ApiError(404, "Category not found");
        data.categoryId = categoryId;
    }
    if (req.file) {
        if (subCategory.image) {
            try {
                await deleteFileByUrl(subCategory.image);
            } catch (e) {
                console.warn("R2 delete old subcategory image warning:", e);
            }
        }
        data.image = await uploadFile(req.file, "subcategories");
    }

    const updated = await prisma.subCategory.update({ where: { id }, data });
    res.status(200).json(new ApiResponsive(200, updated, "SubCategory updated"));
});

export const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subCategory = await prisma.subCategory.findUnique({ where: { id } });
    if (!subCategory) throw new ApiError(404, "SubCategory not found");

    await prisma.productSubCategory.deleteMany({ where: { subCategoryId: id } });
    await prisma.subCategory.delete({ where: { id } });
    res.status(200).json(new ApiResponsive(200, null, "SubCategory deleted"));
});

export const getAll = asyncHandler(async (req, res) => {
    const subCategories = await prisma.subCategory.findMany({
        orderBy: [{ categoryId: "asc" }, { name: "asc" }],
        include: { category: { select: { id: true, name: true, slug: true } } },
    });
    const withImageUrl = subCategories.map((s) => ({
        ...s,
        imageUrl: s.image ? (s.image.startsWith("http") ? s.image : getPublicUrl(s.image)) : null,
    }));
    res.status(200).json(new ApiResponsive(200, withImageUrl, "Success"));
});

export const getByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const subCategories = await prisma.subCategory.findMany({
        where: { categoryId },
        orderBy: { name: "asc" },
    });
    const withImageUrl = subCategories.map((s) => ({
        ...s,
        imageUrl: s.image ? (s.image.startsWith("http") ? s.image : getPublicUrl(s.image)) : null,
    }));
    res.status(200).json(new ApiResponsive(200, withImageUrl, "Success"));
});
