import { databases, appwriteConfig } from '../lib/appwrite';
import { Query } from 'appwrite';

/**
 * Symbol Service
 * Handles fetching care symbols from Appwrite
 */

/**
 * Fetch all care symbols from Appwrite
 * Returns data as-is from Appwrite, filtering happens on frontend
 * @returns {Promise<Array>} - Array of symbol objects
 */
export const getAllSymbols = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.symbolsCollectionId,
      [
        Query.limit(50)
      ]
    );

    // Return documents as-is
    return response.documents;
  } catch (error) {
    console.error('Error fetching symbols from Appwrite:', error);
    throw new Error('Failed to load symbols. Please try again later.');
  }
};
