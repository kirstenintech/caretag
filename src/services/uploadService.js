import { storage, appwriteConfig } from '../lib/appwrite';
import { ID } from 'appwrite';

/**
 * Upload Service
 * Handles uploading images to Appwrite Storage
 */

/**
 * Upload an image file to Appwrite Storage
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The file ID of the uploaded file
 * @throws {Error} - If upload fails
 */
export const uploadImage = async (file) => {
  try {
    // Upload file to Appwrite Storage
    const response = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );

    return response.$id;
  } catch (error) {
    console.error('Error uploading image to Appwrite:', error);

    // Provide user-friendly error messages
    if (error.code === 401) {
      throw new Error('Authentication failed. Please check your configuration.');
    } else if (error.code === 404) {
      throw new Error('Storage bucket not found. Please check your configuration.');
    } else if (error.message?.includes('size')) {
      throw new Error('File size exceeds the allowed limit.');
    } else {
      throw new Error('Failed to upload image. Please try again.');
    }
  }
};

/**
 * Delete an image file from Appwrite Storage
 * @param {string} fileId - The file ID to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (fileId) => {
  try {
    await storage.deleteFile(appwriteConfig.bucketId, fileId);
  } catch (error) {
    console.error('Error deleting image from Appwrite:', error);
    // Don't throw - deletion failures shouldn't block the user
  }
};
