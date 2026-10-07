export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shvetsov.studio/work/onega";
export const publicAsset = (path: string) => `${BASE_PATH}${path}`;
