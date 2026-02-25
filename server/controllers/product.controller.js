import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import { createSlug } from "../helper/create-slug.js";
import { uploadFile, getPublicUrl, deleteFileByUrl } from "../service/r2Service.js";

function parseIds(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed.filter(Boolean) : value ? [value] : [];
        } catch {
            return value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
        }
    }
    return [];
}

function stripHtml(html) {
    if (!html || typeof html !== "string") return "";
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function buildAutoSeo(product, imageUrls) {
    const categories = (product.productCategories || []).map((pc) => pc.category?.name).filter(Boolean);
    const subCategories = (product.productSubCategories || []).map((ps) => ps.subCategory?.name).filter(Boolean);
    const firstImageUrl = imageUrls && imageUrls[0] ? (imageUrls[0].url?.startsWith("http") ? imageUrls[0].url : getPublicUrl(imageUrls[0].url) || imageUrls[0].url) : null;
    return {
        metaTitle: product.name || "",
        metaDescription: stripHtml(product.description || "").slice(0, 160).trim(),
        metaKeywords: [product.name, ...categories, ...subCategories].filter(Boolean).join(", "),
        ogImage: firstImageUrl,
    };
}
function parseJsonField(value) {
    if (!value) return null;
    if (typeof value === "object") {
        const s = JSON.stringify(value);
        return s === "{}" ? null : s;
    }
    if (typeof value === "string") {
        if (!value.trim()) return null;
        try {
            const parsed = JSON.parse(value);
            if (typeof parsed === "object" && !Array.isArray(parsed) && Object.keys(parsed).length === 0) return null;
            return value;
        } catch { return null; }
    }
    return null;
}

export const create = asyncHandler(async (req, res) => {
    const { name, description, metaTitle, metaDescription, metaKeywords, ogImage } = req.body;
    const categoryIds = parseIds(req.body.categoryIds);
    const subCategoryIds = parseIds(req.body.subCategoryIds);

    if (!name?.trim()) throw new ApiError(400, "Product name is required");
    if (!categoryIds.length) throw new ApiError(400, "At least one categoryId is required");

    const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } } });
    if (categories.length !== categoryIds.length) throw new ApiError(404, "One or more categories not found");

    if (subCategoryIds.length) {
        const subs = await prisma.subCategory.findMany({ where: { id: { in: subCategoryIds } } });
        if (subs.length !== subCategoryIds.length) throw new ApiError(400, "One or more subcategories not found");
        const validCategoryIds = new Set(categoryIds);
        const invalid = subs.some((s) => !validCategoryIds.has(s.categoryId));
        if (invalid) throw new ApiError(400, "All subcategories must belong to selected categories");
    }

    const slug = createSlug(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) throw new ApiError(409, "Product with this slug already exists");

    const files = req.files || [];
    if (files.length > 4) throw new ApiError(400, "Maximum 4 images per product");

    const featureTag = ["NEW_ARRIVAL", "TRENDING", "BEST_SELLER"].includes(String(req.body.featureTag || "").toUpperCase())
        ? String(req.body.featureTag).toUpperCase()
        : null;
    const product = await prisma.product.create({
        data: {
            name: name.trim(),
            slug,
            description: description || null,
            moq: req.body.moq?.trim() || null,
            specifications: parseJsonField(req.body.specifications),
            tradeInfo: parseJsonField(req.body.tradeInfo),
            featureTag,
            isFeatured: req.body.isFeatured === true || req.body.isFeatured === "true",
            isNewArrival: req.body.isNewArrival === true || req.body.isNewArrival === "true",
            isHighDemand: req.body.isHighDemand === true || req.body.isHighDemand === "true",
            showOnHome: req.body.showOnHome === true || req.body.showOnHome === "true",
            isActive: req.body.isActive !== false && req.body.isActive !== "false",
        },
    });

    await prisma.productCategory.createMany({
        data: categoryIds.map((categoryId) => ({ productId: product.id, categoryId })),
    });
    if (subCategoryIds.length) {
        await prisma.productSubCategory.createMany({
            data: subCategoryIds.map((subCategoryId) => ({ productId: product.id, subCategoryId })),
        });
    }

    const imageInserts = await Promise.all(
        files.slice(0, 4).map(async (file, index) => {
            const url = await uploadFile(file, "products");
            return { url, position: index, productId: product.id };
        })
    );
    if (imageInserts.length) {
        await prisma.productImage.createMany({ data: imageInserts });
    }

    const withRelations = await prisma.product.findUnique({
        where: { id: product.id },
        include: {
            images: { orderBy: { position: "asc" } },
            productCategories: { include: { category: true } },
            productSubCategories: { include: { subCategory: true } },
        },
    });
    const imagesWithUrls = (withRelations.images || []).map((img) => ({
        ...img,
        url: img.url?.startsWith("http") ? img.url : getPublicUrl(img.url) || img.url,
    }));
    const autoSeo = buildAutoSeo(withRelations, imagesWithUrls);
    const seoData = {
        metaTitle: (metaTitle && String(metaTitle).trim()) || autoSeo.metaTitle,
        metaDescription: (metaDescription && String(metaDescription).trim()) || autoSeo.metaDescription,
        metaKeywords: (metaKeywords && String(metaKeywords).trim()) || autoSeo.metaKeywords,
        ogImage: (ogImage && String(ogImage).trim()) || autoSeo.ogImage,
    };
    await prisma.product.update({
        where: { id: product.id },
        data: seoData,
    });

    const updated = await prisma.product.findUnique({
        where: { id: product.id },
        include: {
            images: { orderBy: { position: "asc" } },
            productCategories: { include: { category: true } },
            productSubCategories: { include: { subCategory: true } },
        },
    });
    res.status(201).json(new ApiResponsive(201, mapProductResponse(updated), "Product created"));
});

export const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let { name, description, existingImages, metaTitle, metaDescription, metaKeywords, ogImage } = req.body;
    const categoryIds = parseIds(req.body.categoryIds);
    const subCategoryIds = parseIds(req.body.subCategoryIds);

    let images = existingImages;
    if (typeof images === "string") {
        try {
            images = images ? JSON.parse(images) : undefined;
        } catch {
            images = undefined;
        }
    }

    const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
    if (!product) throw new ApiError(404, "Product not found");

    const data = {};
    if (name?.trim()) {
        data.name = name.trim();
        data.slug = createSlug(name);
    }
    if (description !== undefined) data.description = description;
    if (req.body.moq !== undefined) data.moq = req.body.moq?.trim() || null;
    if (req.body.specifications !== undefined) data.specifications = parseJsonField(req.body.specifications);
    if (req.body.tradeInfo !== undefined) data.tradeInfo = parseJsonField(req.body.tradeInfo);
    if (req.body.isFeatured !== undefined) data.isFeatured = req.body.isFeatured === true || req.body.isFeatured === "true";
    if (req.body.isNewArrival !== undefined) data.isNewArrival = req.body.isNewArrival === true || req.body.isNewArrival === "true";
    if (req.body.isHighDemand !== undefined) data.isHighDemand = req.body.isHighDemand === true || req.body.isHighDemand === "true";
    if (req.body.showOnHome !== undefined) data.showOnHome = req.body.showOnHome === true || req.body.showOnHome === "true";
    if (req.body.isActive !== undefined) data.isActive = req.body.isActive !== false && req.body.isActive !== "false";
    if (req.body.featureTag !== undefined) {
        const tag = String(req.body.featureTag || "").trim().toUpperCase();
        const validTag = ["NEW_ARRIVAL", "TRENDING", "BEST_SELLER", ""].includes(tag)
            ? (tag || null)
            : null;
        data.featureTag = validTag;
        data.isNewArrival = validTag === "NEW_ARRIVAL";
        data.isFeatured = validTag === "BEST_SELLER";
        data.isHighDemand = validTag === "TRENDING";
    }

    await prisma.product.update({ where: { id }, data });

    if (categoryIds.length) {
        const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } } });
        if (categories.length !== categoryIds.length) throw new ApiError(404, "One or more categories not found");
        await prisma.productCategory.deleteMany({ where: { productId: id } });
        await prisma.productCategory.createMany({
            data: categoryIds.map((categoryId) => ({ productId: id, categoryId })),
        });
    } else {
        await prisma.productCategory.deleteMany({ where: { productId: id } });
    }

    const validCategoryIds = categoryIds.length ? new Set(categoryIds) : new Set();
    if (subCategoryIds.length) {
        const subs = await prisma.subCategory.findMany({ where: { id: { in: subCategoryIds } } });
        if (subs.length !== subCategoryIds.length) throw new ApiError(400, "One or more subcategories not found");
        if (validCategoryIds.size) {
            const invalid = subs.some((s) => !validCategoryIds.has(s.categoryId));
            if (invalid) throw new ApiError(400, "All subcategories must belong to selected categories");
        }
        await prisma.productSubCategory.deleteMany({ where: { productId: id } });
        await prisma.productSubCategory.createMany({
            data: subCategoryIds.map((subCategoryId) => ({ productId: id, subCategoryId })),
        });
    } else {
        await prisma.productSubCategory.deleteMany({ where: { productId: id } });
    }

    if (images && Array.isArray(images)) {
        await prisma.productImage.deleteMany({ where: { productId: id } });
        const toCreate = images.slice(0, 4).map((img, idx) => ({
            productId: id,
            url: typeof img === "string" ? img : img.url,
            position: typeof img === "object" && typeof img.position === "number" ? img.position : idx,
        }));
        if (toCreate.length) await prisma.productImage.createMany({ data: toCreate });
    }

    const files = req.files || [];
    if (files.length) {
        const existingImages = await prisma.productImage.findMany({ where: { productId: id }, orderBy: { position: "asc" } });
        let startPos = existingImages.length;
        for (const file of files.slice(0, 4 - existingImages.length)) {
            if (startPos >= 4) break;
            const url = await uploadFile(file, "products");
            await prisma.productImage.create({ data: { productId: id, url, position: startPos } });
            startPos++;
        }
    }

    const withRelations = await prisma.product.findUnique({
        where: { id },
        include: {
            images: { orderBy: { position: "asc" } },
            productCategories: { include: { category: true } },
            productSubCategories: { include: { subCategory: true } },
        },
    });
    const imagesWithUrls = (withRelations.images || []).map((img) => ({
        ...img,
        url: img.url?.startsWith("http") ? img.url : getPublicUrl(img.url) || img.url,
    }));
    const autoSeo = buildAutoSeo(withRelations, imagesWithUrls);
    const seoData = {
        metaTitle: (metaTitle && String(metaTitle).trim()) || autoSeo.metaTitle,
        metaDescription: (metaDescription && String(metaDescription).trim()) || autoSeo.metaDescription,
        metaKeywords: (metaKeywords && String(metaKeywords).trim()) || autoSeo.metaKeywords,
        ogImage: (ogImage && String(ogImage).trim()) || autoSeo.ogImage,
    };
    await prisma.product.update({
        where: { id },
        data: seoData,
    });

    const updated = await prisma.product.findUnique({
        where: { id },
        include: {
            images: { orderBy: { position: "asc" } },
            productCategories: { include: { category: true } },
            productSubCategories: { include: { subCategory: true } },
        },
    });
    res.status(200).json(new ApiResponsive(200, mapProductResponse(updated), "Product updated"));
});

export const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: { images: true },
    });
    if (!product) throw new ApiError(404, "Product not found");

    for (const img of product.images || []) {
        try {
            await deleteFileByUrl(img.url);
        } catch (e) {
            console.warn("R2 delete image warning:", e);
        }
    }
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productCategory.deleteMany({ where: { productId: id } });
    await prisma.productSubCategory.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    res.status(200).json(new ApiResponsive(200, null, "Product deleted"));
});

export const removeImage = asyncHandler(async (req, res) => {
    const { id, imageId } = req.params;
    const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
    if (!product) throw new ApiError(404, "Product not found");

    const image = product.images.find((i) => i.id === imageId);
    if (!image) throw new ApiError(404, "Image not found");

    try {
        await deleteFileByUrl(image.url);
    } catch (e) {
        console.warn("R2 delete image warning:", e);
    }
    await prisma.productImage.delete({ where: { id: imageId } });
    res.status(200).json(new ApiResponsive(200, null, "Image removed"));
});

export const getAll = asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            images: { orderBy: { position: "asc" } },
            productCategories: { include: { category: true } },
            productSubCategories: { include: { subCategory: true } },
        },
    });
    res.status(200).json(new ApiResponsive(200, products.map(mapProductResponse), "Success"));
});

export const getOne = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            images: { orderBy: { position: "asc" } },
            productCategories: { include: { category: true } },
            productSubCategories: { include: { subCategory: true } },
        },
    });
    if (!product) throw new ApiError(404, "Product not found");
    res.status(200).json(new ApiResponsive(200, mapProductResponse(product), "Success"));
});

export const getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            images: { orderBy: { position: "asc" } },
            productCategories: { include: { category: true } },
            productSubCategories: { include: { subCategory: true } },
        },
    });
    if (!product) throw new ApiError(404, "Product not found");
    res.status(200).json(new ApiResponsive(200, mapProductResponse(product), "Success"));
});

const VALID_FEATURE_TAGS = ["NEW_ARRIVAL", "TRENDING", "BEST_SELLER"];

function getProductsByFlag(flag) {
    return asyncHandler(async (req, res) => {
        const where = { isActive: true, [flag]: true };
        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                images: { orderBy: { position: "asc" } },
                productCategories: { include: { category: true } },
                productSubCategories: { include: { subCategory: true } },
            },
        });
        const data = products.map(mapProductResponse);
        res.status(200).json(new ApiResponsive(200, data, "Success"));
    });
}

export const getFeatured = getProductsByFlag("isFeatured");
export const getNewArrivals = getProductsByFlag("isNewArrival");
export const getHighDemand = getProductsByFlag("isHighDemand");

export const getByFeature = asyncHandler(async (req, res) => {
    const { tag } = req.params;
    const upper = String(tag || "").toUpperCase();
    if (!VALID_FEATURE_TAGS.includes(upper)) {
        throw new ApiError(400, "Invalid feature tag");
    }
    const products = await prisma.product.findMany({
        where: { featureTag: upper },
        orderBy: { createdAt: "desc" },
        include: {
            images: { orderBy: { position: "asc" } },
            productCategories: { include: { category: true } },
            productSubCategories: { include: { subCategory: true } },
        },
    });
    const data = products.map(mapProductResponse);
    if (process.env.NODE_ENV !== "production") {
        console.log("[Products getByFeature]", { tag: upper, count: data.length, ids: data.map((p) => p.id) });
    }
    res.status(200).json(new ApiResponsive(200, data, "Success"));
});

function mapProductResponse(product) {
    if (!product) return product;
    const categories = (product.productCategories || []).map((pc) => pc.category).filter(Boolean);
    const subCategories = (product.productSubCategories || []).map((ps) => ps.subCategory).filter(Boolean);
    const images = (product.images || []).map((img) => ({
        ...img,
        url: img.url?.startsWith("http") ? img.url : getPublicUrl(img.url) || img.url,
    }));
    const resolvedOgImage = product.ogImage
        ? (product.ogImage.startsWith("http") ? product.ogImage : getPublicUrl(product.ogImage) || product.ogImage)
        : (images[0] ? images[0].url : null);
    const parseOrNull = (s) => { try { return s ? JSON.parse(s) : null; } catch { return null; } };
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        moq: product.moq || null,
        specifications: parseOrNull(product.specifications),
        tradeInfo: parseOrNull(product.tradeInfo),
        featureTag: product.featureTag || null,
        isFeatured: product.isFeatured ?? false,
        isNewArrival: product.isNewArrival ?? false,
        isHighDemand: product.isHighDemand ?? false,
        showOnHome: product.showOnHome ?? false,
        isActive: product.isActive !== false,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        metaTitle: product.metaTitle || product.name,
        metaDescription: product.metaDescription || null,
        metaKeywords: product.metaKeywords || null,
        ogImage: resolvedOgImage,
        seoAutoGenerated: {
            metaTitle: !product.metaTitle,
            metaDescription: !product.metaDescription,
            metaKeywords: !product.metaKeywords,
            ogImage: !product.ogImage,
        },
        images,
        categories,
        subCategories,
    };
}
