import { appwriteConfig } from "../lib/appwrite";

/**
 * Inference Service
 * Handles calling the Care Symbols ML inference function
 */

/**
 * Call the inference function to detect care symbols
 * @param {string} fileId - The Appwrite Storage file ID
 * @param {number} topK - Number of top predictions to return (default: 5)
 * @param {number} threshold - Confidence threshold (default: 0.5)
 * @returns {Promise<Object>} - Inference results
 * @throws {Error} - If inference fails
 */
export const detectSymbols = async (fileId, topK = 5, threshold = 0.4) => {
  try {
    const url = `${appwriteConfig.endpoint}/functions/${appwriteConfig.functionId}/executions`;

    // Appwrite expects the function parameters as a stringified JSON in the "body" field
    const payload = {
      body: JSON.stringify({
        fileId,
        topK,
        threshold,
      }),
      async: false, // Set to false to wait for execution completion
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": appwriteConfig.projectId,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const execution = await response.json();

    // If async: false was honored, the execution should already be complete
    if (execution.status === "completed") {
      const result = JSON.parse(execution.responseBody || "{}");

      if (!result.success) {
        throw new Error(result.error || "Inference failed");
      }

      return result;
    } else if (execution.status === "failed") {
      const errorMsg =
        execution.stderr || execution.responseBody || "Unknown error";
      throw new Error(`Execution failed: ${errorMsg}`);
    } else {
      // If still processing, poll for completion
      const result = await pollExecution(execution.$id);
      return result;
    }
  } catch (error) {
    console.error("Error calling inference function:", error);

    // Provide user-friendly error messages
    if (
      error.message?.includes("network") ||
      error.message?.includes("fetch")
    ) {
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    } else if (error.message?.includes("timeout")) {
      throw new Error("Request timed out. Please try again.");
    } else {
      throw new Error(
        error.message || "Failed to analyze image. Please try again."
      );
    }
  }
};

/**
 * Poll for function execution completion
 * @param {string} executionId - The execution ID to poll
 * @param {number} maxAttempts - Maximum polling attempts (default: 60)
 * @param {number} interval - Polling interval in ms (default: 1000)
 * @returns {Promise<Object>} - Execution result
 */
const pollExecution = async (
  executionId,
  maxAttempts = 60,
  interval = 1000
) => {
  const url = `${appwriteConfig.endpoint}/functions/${appwriteConfig.functionId}/executions/${executionId}`;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Appwrite-Project": appwriteConfig.projectId,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get execution status: ${response.status}`);
      }

      const execution = await response.json();

      // Check if execution is complete
      if (execution.status === "completed") {
        // Parse response body
        const result = JSON.parse(execution.responseBody || "{}");

        // Check for success
        if (!result.success) {
          throw new Error(result.error || "Inference failed");
        }

        return result;
      } else if (execution.status === "failed") {
        const errorMsg =
          execution.stderr || execution.responseBody || "Unknown error";
        throw new Error(`Execution failed: ${errorMsg}`);
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error) {
      // If it's the last attempt, throw the error
      if (attempt === maxAttempts - 1) {
        throw new Error("Analysis timed out. Please try again.");
      }

      // If it's a parsing or status error, rethrow immediately
      if (
        error.message?.includes("Execution failed") ||
        error.message?.includes("Inference failed")
      ) {
        throw error;
      }

      // Otherwise, continue polling
    }
  }

  throw new Error("Analysis timed out. Please try again.");
};
