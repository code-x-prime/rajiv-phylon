import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import { uploadFile, getPublicUrl, deleteFileByUrl } from "../service/r2Service.js";

export const upload = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "Image file is required");

    const url = await uploadFile(req.file, "gallery");
    const { title, section } = req.body || {};
    const gallery = await prisma.gallery.create({
        data: { image: url, title: title?.trim() || null, section: section?.trim() || null },
    });
    const imageUrl = url.startsWith("http") ? url : getPublicUrl(url) || url;
    res.status(201).json(new ApiResponsive(201, { ...gallery, imageUrl }, "Image uploaded"));
});

export const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const gallery = await prisma.gallery.findUnique({ where: { id } });
    if (!gallery) throw new ApiError(404, "Gallery item not found");

    try {
        await deleteFileByUrl(gallery.image);
    } catch (e) {
        console.warn("R2 delete gallery image warning:", e);
    }
    await prisma.gallery.delete({ where: { id } });
    res.status(200).json(new ApiResponsive(200, null, "Gallery image deleted"));
});

export const getAll = asyncHandler(async (req, res) => {
    const section = (req.query.section || "").toString().trim() || undefined;
    const where = section ? { section } : {};
    const items = await prisma.gallery.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
    const withUrl = items.map((g) => ({
        ...g,
        imageUrl: g.image?.startsWith("http") ? g.image : getPublicUrl(g.image) || g.image,
    }));
    res.status(200).json(new ApiResponsive(200, withUrl, "Success"));
});
