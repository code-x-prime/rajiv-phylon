import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import { uploadFile, getPublicUrl, deleteFileByUrl } from "../service/r2Service.js";

function resolveBannerImage(urlOrKey) {
    if (!urlOrKey) return null;
    return urlOrKey.startsWith("http") ? urlOrKey : getPublicUrl(urlOrKey) || urlOrKey;
}

function mapBanner(b) {
    return {
        ...b,
        desktopImageUrl: resolveBannerImage(b.desktopImage),
        mobileImageUrl: resolveBannerImage(b.mobileImage),
    };
}

/** GET banners (public) – query: position=HOME_DESKTOP&isActive=true, sorted by order */
export const getPublic = asyncHandler(async (req, res) => {
    const position = (req.query.position || "").toString().trim() || null;
    const isActive = req.query.isActive !== "false";

    const where = { isActive };
    if (position) where.position = position;

    const banners = await prisma.banner.findMany({
        where,
        orderBy: { order: "asc" },
    });
    const data = banners.map(mapBanner);
    res.status(200).json(new ApiResponsive(200, data, "Success"));
});

/** GET all banners (admin) */
export const getAll = asyncHandler(async (req, res) => {
    const banners = await prisma.banner.findMany({
        orderBy: { order: "asc" },
    });
    res.status(200).json(new ApiResponsive(200, banners.map(mapBanner), "Success"));
});

/** POST create banner */
export const create = asyncHandler(async (req, res) => {
    const desktopFile = req.files?.desktopImage?.[0];
    const mobileFile = req.files?.mobileImage?.[0];
    if (!desktopFile || !mobileFile) {
        throw new ApiError(400, "Desktop and mobile images are required");
    }
    const title = (req.body.title || "").trim();
    if (!title) throw new ApiError(400, "Title is required");

    const link = (req.body.link || "").trim() || null;
    const position = (req.body.position || "").trim() || null;
    const isActive = req.body.isActive !== "false" && req.body.isActive !== false;
    const order = parseInt(req.body.order, 10) || 0;

    const [desktopUrl, mobileUrl] = await Promise.all([
        uploadFile(desktopFile, "banners"),
        uploadFile(mobileFile, "banners"),
    ]);

    const banner = await prisma.banner.create({
        data: {
            title,
            desktopImage: desktopUrl,
            mobileImage: mobileUrl,
            link,
            position,
            isActive,
            order,
        },
    });
    res.status(201).json(new ApiResponsive(201, mapBanner(banner), "Banner created"));
});

/** PUT update banner */
export const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new ApiError(404, "Banner not found");

    const title = (req.body.title || "").trim();
    const link = (req.body.link || "").trim() || null;
    const isActive = req.body.isActive !== undefined
        ? (req.body.isActive !== "false" && req.body.isActive !== false)
        : undefined;
    const order = req.body.order !== undefined && req.body.order !== "" ? parseInt(req.body.order, 10) : undefined;

    const data = {};
    if (title) data.title = title;
    if (link !== undefined) data.link = link;
    if (req.body.position !== undefined) data.position = (req.body.position || "").trim() || null;
    if (typeof isActive === "boolean") data.isActive = isActive;
    if (order !== undefined && !isNaN(order)) data.order = order;

    const desktopFile = req.files?.desktopImage?.[0];
    const mobileFile = req.files?.mobileImage?.[0];

    if (desktopFile) {
        try {
            await deleteFileByUrl(banner.desktopImage);
        } catch (e) {
            console.warn("R2 delete old desktop banner image:", e);
        }
        data.desktopImage = await uploadFile(desktopFile, "banners");
    }
    if (mobileFile) {
        try {
            await deleteFileByUrl(banner.mobileImage);
        } catch (e) {
            console.warn("R2 delete old mobile banner image:", e);
        }
        data.mobileImage = await uploadFile(mobileFile, "banners");
    }

    const updated = await prisma.banner.update({
        where: { id },
        data,
    });
    res.status(200).json(new ApiResponsive(200, mapBanner(updated), "Updated"));
});

/** PATCH reorder banners – body: { orderedIds: string[] } */
export const reorder = asyncHandler(async (req, res) => {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        throw new ApiError(400, "orderedIds array is required");
    }
    await Promise.all(
        orderedIds.map((id, index) =>
            prisma.banner.updateMany({ where: { id }, data: { order: index } })
        )
    );
    const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
    res.status(200).json(new ApiResponsive(200, banners.map(mapBanner), "Reordered"));
});

/** PATCH toggle isActive */
export const toggleActive = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new ApiError(404, "Banner not found");
    const updated = await prisma.banner.update({
        where: { id },
        data: { isActive: !banner.isActive },
    });
    res.status(200).json(new ApiResponsive(200, mapBanner(updated), "Updated"));
});

/** DELETE banner – remove images from R2 then delete */
export const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new ApiError(404, "Banner not found");
    try {
        await deleteFileByUrl(banner.desktopImage);
    } catch (e) {
        console.warn("R2 delete banner desktop image:", e);
    }
    try {
        await deleteFileByUrl(banner.mobileImage);
    } catch (e) {
        console.warn("R2 delete banner mobile image:", e);
    }
    await prisma.banner.delete({ where: { id } });
    res.status(200).json(new ApiResponsive(200, null, "Deleted"));
});
