import { appwriteConfig } from "../lib/appwrite";

/**
 * Construct the image URL for a symbol from Appwrite Storage
 * @param {string} imageId - The file ID in Appwrite Storage
 * @returns {string} - The public URL to access the image
 */
export const getImageUrl = (imageId) => {
  if (!imageId) return null;

  const { endpoint, projectId, bucketId } = appwriteConfig;

  // Construct the URL using Appwrite's file view endpoint
  return `${endpoint}/storage/buckets/${bucketId}/files/${imageId}/view?project=${projectId}`;
};
