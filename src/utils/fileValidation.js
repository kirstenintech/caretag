/**
 * File validation utilities for image uploads
 */

// Accepted image file types
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/webp',
];

// Maximum file size (10MB in bytes)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validate image file type
 * @param {File} file - The file to validate
 * @returns {boolean} - True if valid file type
 */
export const isValidFileType = (file) => {
  return ACCEPTED_FILE_TYPES.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - The file to validate
 * @returns {boolean} - True if file size is within limit
 */
export const isValidFileSize = (file) => {
  return file.size <= MAX_FILE_SIZE;
};

/**
 * Get human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result with success status and error message
 */
export const validateImageFile = (file) => {
  if (!file) {
    return {
      isValid: false,
      error: 'No file selected',
    };
  }

  if (!isValidFileType(file)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, HEIC, or WebP image.',
    };
  }

  if (!isValidFileSize(file)) {
    return {
      isValid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds the maximum limit of ${formatFileSize(MAX_FILE_SIZE)}.`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Get accepted file types for input accept attribute
 * @returns {string} - Comma-separated list of accepted file types
 */
export const getAcceptedFileTypes = () => {
  return ACCEPTED_FILE_TYPES.join(',');
};
