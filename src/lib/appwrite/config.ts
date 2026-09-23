export const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
export const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;

export function appwriteConfigured(): boolean {
  return Boolean(APPWRITE_PROJECT_ID && APPWRITE_API_KEY);
}
