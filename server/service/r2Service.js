import {
    ListObjectsV2Command,
    DeleteObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import s3client from "../utils/s3client.js";
import ApiError from "../utils/ApiError.js";

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || "rajiv-phylon";
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

/**
 * Get public URL for an R2 object key
 */
export const getPublicUrl = (key) => {
    if (!key) return null;
    if (key.startsWith("http://") || key.startsWith("https://")) return key;
    return R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : null;
};

/**
 * Upload file to R2 (multer memory buffer or { buffer, originalname, mimetype })
 * @param {Object} file - { buffer, originalname, mimetype }
 * @param {string} folder - subfolder under UPLOAD_FOLDER (e.g. 'categories', 'products', 'gallery')
 * @returns {Promise<string>} - public URL of uploaded file
 */
export const uploadFile = async (file, folder = "uploads") => {
    try {
        if (!file?.buffer || !file.originalname) {
            throw new ApiError(400, "Invalid file: buffer and originalname required");
        }
        const ext = file.originalname.includes(".")
            ? file.originalname.split(".").pop().toLowerCase()
            : "bin";
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
        const key = `${UPLOAD_FOLDER}/${folder}/${safeName}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype || "application/octet-stream",
        });

        await s3client.send(command);
        const url = getPublicUrl(key);
        return url || key;
    } catch (error) {
        console.error("R2 uploadFile error:", error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Failed to upload file to R2");
    }
};

/**
 * List files from R2 storage with pagination
 */
export const listFiles = async ({ prefix = '', page = 1, limit = 50, fileTypes = [] }) => {
    try {
        const fullPrefix = prefix ? `${UPLOAD_FOLDER}/${prefix}` : `${UPLOAD_FOLDER}/`;

        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: fullPrefix,
            MaxKeys: 1000, // Get all for now, we'll filter and paginate in memory
        });

        const response = await s3client.send(command);
        const contents = response.Contents || [];

        // Filter by file types if specified
        let files = contents.map(item => {
            const key = item.Key;
            const fileName = key.split('/').pop();
            const folder = key.replace(`${UPLOAD_FOLDER}/`, '').split('/').slice(0, -1).join('/');
            const extension = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';

            // Determine file type
            let fileType = 'other';
            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(extension)) {
                fileType = 'image';
            } else if (['pdf'].includes(extension)) {
                fileType = 'pdf';
            } else if (['doc', 'docx'].includes(extension)) {
                fileType = 'document';
            } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
                fileType = 'spreadsheet';
            } else if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
                fileType = 'video';
            } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
                fileType = 'audio';
            }

            return {
                key,
                fileName,
                folder,
                extension,
                fileType,
                size: item.Size,
                lastModified: item.LastModified,
                publicUrl: getPublicUrl(key),
            };
        });

        // Filter out folders (size 0) and by file types
        files = files.filter(file => file.size > 0);

        if (fileTypes.length > 0) {
            files = files.filter(file => fileTypes.includes(file.fileType));
        }

        // Sort by lastModified descending
        files.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

        // Paginate
        const total = files.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedFiles = files.slice(startIndex, endIndex);

        return {
            files: paginatedFiles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error('R2 listFiles error:', error);
        throw new ApiError(500, 'Failed to list files from R2');
    }
};

/**
 * Get folders from R2 storage (media subfolders)
 */
export const getFolders = async () => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: `${UPLOAD_FOLDER}/`,
            Delimiter: '/',
        });

        const response = await s3client.send(command);
        const prefixes = response.CommonPrefixes || [];

        const folders = prefixes.map(prefix => {
            const folderPath = prefix.Prefix.replace(`${UPLOAD_FOLDER}/`, '').replace(/\/$/, '');
            return {
                name: folderPath,
                path: prefix.Prefix,
            };
        }).filter(folder => folder.name); // Filter out empty names

        return folders;
    } catch (error) {
        console.error('R2 getFolders error:', error);
        throw new ApiError(500, 'Failed to get folders from R2');
    }
};

/**
 * Delete file from R2 by key
 */
export const deleteFile = async (key) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await s3client.send(command);
        return true;
    } catch (error) {
        console.error('R2 deleteFile error:', error);
        throw new ApiError(500, 'Failed to delete file from R2');
    }
};

/**
 * Extract R2 key from public URL (or return as key if not a URL)
 */
export const urlToKey = (urlOrKey) => {
    if (!urlOrKey) return null;
    if (!urlOrKey.startsWith("http://") && !urlOrKey.startsWith("https://")) {
        return urlOrKey;
    }
    try {
        const path = new URL(urlOrKey).pathname;
        return path.replace(/^\//, "");
    } catch {
        return null;
    }
};

/**
 * Delete file from R2 by public URL or key
 */
export const deleteFileByUrl = async (urlOrKey) => {
    const key = urlToKey(urlOrKey);
    if (!key) return false;
    await deleteFile(key);
    return true;
};

/**
 * Get file info from R2
 */
export const getFileInfo = async (key) => {
    try {
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        const response = await s3client.send(command);

        const fileName = key.split('/').pop();
        const extension = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';

        return {
            key,
            fileName,
            extension,
            size: response.ContentLength,
            contentType: response.ContentType,
            lastModified: response.LastModified,
            publicUrl: getPublicUrl(key),
        };
    } catch (error) {
        console.error('R2 getFileInfo error:', error);
        throw new ApiError(404, 'File not found in R2');
    }
};

/**
 * Check if R2 is configured
 */
export const isR2Configured = () => {
    return !!(
        process.env.R2_ACCOUNT_ID &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_ACCESS_KEY &&
        process.env.R2_BUCKET_NAME
    );
};

export default {
    getPublicUrl,
    uploadFile,
    listFiles,
    getFolders,
    deleteFile,
    deleteFileByUrl,
    urlToKey,
    getFileInfo,
    isR2Configured,
};
