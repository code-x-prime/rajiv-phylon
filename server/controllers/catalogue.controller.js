import fs from 'fs';
import path from 'path';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import { uploadFile, getPublicUrl, deleteFileByUrl } from "../service/r2Service.js";

const FALLBACK_CATALOGUE_PATH = path.join(process.cwd(), "data", "catalogue.json");

const DEFAULT_CATALOGUE = {
    id: "default-catalog",
    title: "Product Catalogue",
    year: "",
    pdfUrl: "",
    fileSize: "",
    isActive: false,
    updatedAt: new Date().toISOString(),
};

function readFallbackCatalogue() {
    try {
        if (fs.existsSync(FALLBACK_CATALOGUE_PATH)) {
            const raw = fs.readFileSync(FALLBACK_CATALOGUE_PATH, "utf-8");
            return JSON.parse(raw);
        }
    } catch (e) {
        console.warn("[CatalogueController] Read fallback error:", e);
    }
    return DEFAULT_CATALOGUE;
}

function saveFallbackCatalogue(data) {
    try {
        const dir = path.dirname(FALLBACK_CATALOGUE_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(FALLBACK_CATALOGUE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
        console.warn("[CatalogueController] Save fallback error:", e);
    }
}

/** GET active catalogue (public) */
export const getCatalogue = asyncHandler(async (req, res) => {
    let catalogue = null;
    try {
        if (prisma.catalogue) {
            catalogue = await prisma.catalogue.findFirst({
                where: { isActive: true },
                orderBy: { updatedAt: "desc" },
            });
        }
    } catch (dbErr) {
        console.warn("[CatalogueController] DB query error, using fallback:", dbErr.message);
    }

    if (!catalogue) {
        catalogue = readFallbackCatalogue();
    }

    res.status(200).json(new ApiResponsive(200, catalogue, "Catalogue fetched successfully"));
});

/** POST/PUT update or replace active catalogue (admin) */
export const updateCatalogue = asyncHandler(async (req, res) => {
    const file = req.file;
    const title = (req.body.title || "").trim() || "Product Catalogue 2026";
    const year = (req.body.year || "").trim() || "2026";
    let fileSize = (req.body.fileSize || "").trim();
    let pdfUrl = (req.body.pdfUrl || "").trim();

    if (file) {
        // Upload PDF to Cloudflare R2
        pdfUrl = await uploadFile(file, "catalogues");
        if (!fileSize && file.size) {
            fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        }
    }

    if (!pdfUrl) {
        throw new ApiError(400, "Please provide a valid PDF file or PDF URL");
    }

    let resultCatalogue = null;
    const updateData = {
        title,
        year,
        pdfUrl,
        fileSize: fileSize || null,
        isActive: true,
        updatedAt: new Date(),
    };

    try {
        if (prisma.catalogue) {
            // Deactivate existing active catalogues
            await prisma.catalogue.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });

            resultCatalogue = await prisma.catalogue.create({
                data: updateData,
            });
        }
    } catch (dbErr) {
        console.warn("[CatalogueController] DB save failed, saving fallback:", dbErr.message);
    }

    const fallbackData = {
        id: resultCatalogue?.id || `cat-${Date.now()}`,
        ...updateData,
        updatedAt: new Date().toISOString(),
    };
    saveFallbackCatalogue(fallbackData);

    res.status(200).json(new ApiResponsive(200, resultCatalogue || fallbackData, "Catalogue updated successfully"));
});

/** DELETE remove active catalogue (admin) */
export const deleteCatalogue = asyncHandler(async (req, res) => {
    try {
        if (prisma.catalogue) {
            await prisma.catalogue.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });
        }
    } catch (e) {}

    saveFallbackCatalogue(DEFAULT_CATALOGUE);
    res.status(200).json(new ApiResponsive(200, DEFAULT_CATALOGUE, "Catalogue reset to default"));
});
