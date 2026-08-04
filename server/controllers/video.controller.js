import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import { uploadFile, getPublicUrl, deleteFileByUrl } from "../service/r2Service.js";

function resolveVideoUrl(urlOrKey) {
    if (!urlOrKey) return null;
    return urlOrKey.startsWith("http") ? urlOrKey : getPublicUrl(urlOrKey) || urlOrKey;
}

function mapVideo(v) {
    return {
        ...v,
        videoUrlResolved: resolveVideoUrl(v.videoUrl),
        thumbnailResolved: resolveVideoUrl(v.thumbnail),
    };
}

/** GET videos (public) – active only, sorted by order */
export const getPublic = asyncHandler(async (req, res) => {
    const videos = await prisma.video.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });
    res.status(200).json(new ApiResponsive(200, videos.map(mapVideo), "Success"));
});

/** GET all videos (admin) */
export const getAll = asyncHandler(async (req, res) => {
    const videos = await prisma.video.findMany({
        orderBy: { order: "asc" },
    });
    res.status(200).json(new ApiResponsive(200, videos.map(mapVideo), "Success"));
});

/** POST create video */
export const create = asyncHandler(async (req, res) => {
    const videoFile = req.file;
    if (!videoFile) {
        throw new ApiError(400, "Video file is required");
    }

    const title = (req.body.title || "").trim() || null;
    const description = (req.body.description || "").trim() || null;
    const isActive = req.body.isActive !== "false" && req.body.isActive !== false;
    const order = parseInt(req.body.order, 10) || 0;

    const videoUrl = await uploadFile(videoFile, "videos");

    const video = await prisma.video.create({
        data: { title, description, videoUrl, isActive, order },
    });

    res.status(201).json(new ApiResponsive(201, mapVideo(video), "Video created"));
});

/** PUT update video */
export const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await prisma.video.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Video not found");

    const title = (req.body.title || "").trim();
    const description = (req.body.description || "").trim() || null;
    const isActive = req.body.isActive !== undefined
        ? (req.body.isActive !== "false" && req.body.isActive !== false)
        : undefined;
    const order = req.body.order !== undefined && req.body.order !== ""
        ? parseInt(req.body.order, 10)
        : undefined;

    const data = {};
    if (title) data.title = title;
    if (description !== undefined) data.description = description;
    if (typeof isActive === "boolean") data.isActive = isActive;
    if (order !== undefined && !isNaN(order)) data.order = order;

    // Replace video file if new one uploaded
    const videoFile = req.file;
    if (videoFile) {
        try {
            await deleteFileByUrl(existing.videoUrl);
        } catch (e) {
            console.warn("R2 delete old video:", e);
        }
        data.videoUrl = await uploadFile(videoFile, "videos");
    }

    const updated = await prisma.video.update({ where: { id }, data });
    res.status(200).json(new ApiResponsive(200, mapVideo(updated), "Updated"));
});

/** PATCH reorder videos – body: { orderedIds: string[] } */
export const reorder = asyncHandler(async (req, res) => {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        throw new ApiError(400, "orderedIds array is required");
    }
    await Promise.all(
        orderedIds.map((id, index) =>
            prisma.video.updateMany({ where: { id }, data: { order: index } })
        )
    );
    const videos = await prisma.video.findMany({ orderBy: { order: "asc" } });
    res.status(200).json(new ApiResponsive(200, videos.map(mapVideo), "Reordered"));
});

/** PATCH toggle isActive */
export const toggleActive = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) throw new ApiError(404, "Video not found");
    const updated = await prisma.video.update({
        where: { id },
        data: { isActive: !video.isActive },
    });
    res.status(200).json(new ApiResponsive(200, mapVideo(updated), "Updated"));
});

/** DELETE video – remove from R2 then delete + auto-reorder */
export const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) throw new ApiError(404, "Video not found");
    try {
        await deleteFileByUrl(video.videoUrl);
    } catch (e) {
        console.warn("R2 delete video:", e);
    }
    await prisma.video.delete({ where: { id } });

    // Auto-reorder: gap hatao — remaining videos ko compact karo
    const remaining = await prisma.video.findMany({ orderBy: { order: "asc" } });
    await Promise.all(
        remaining.map((v, index) =>
            prisma.video.updateMany({ where: { id: v.id }, data: { order: index } })
        )
    );

    res.status(200).json(new ApiResponsive(200, null, "Deleted"));
});
