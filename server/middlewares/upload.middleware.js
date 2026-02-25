import multer from "multer";
import ApiError from "../utils/ApiError.js";

// Memory storage for R2 upload (buffer in req.file)
const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Only JPEG, PNG, GIF, WebP images are allowed"), false);
    }
};

/** Single image upload (field name: image or file) */
export const uploadSingle = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: imageFilter,
}).single("image");

/** Multiple images (field name: images, max 4 for products) */
export const uploadMultiple = (maxCount = 4) =>
    multer({
        storage,
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: imageFilter,
    }).array("images", maxCount);

/** Single file for gallery */
export const uploadGallery = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: imageFilter,
}).single("image");

/** Banner: desktopImage + mobileImage (each optional on update) */
export const uploadBanner = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: imageFilter,
}).fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
]);

export default { uploadSingle, uploadMultiple, uploadGallery, uploadBanner };
