// Re-export R2 helpers for backward compatibility
import { getPublicUrl, uploadFile } from "../service/r2Service.js";

export { getPublicUrl };
export const uploadToR2 = uploadFile;
