# Care Symbols Inference - Appwrite Function

An Appwrite Function that accepts an uploaded image file ID, runs TensorFlow multi-label classification to identify care symbols, and enriches the results with detailed care instructions from the Appwrite database.

## Overview

This function:

1. Accepts a `fileId` from Appwrite Storage
2. Downloads the image file
3. Downloads the TensorFlow model from Appwrite Storage (on first run)
4. Runs inference using the cached model
5. Returns top predictions with confidence scores
6. Enriches each prediction with metadata from the `care_symbols` collection (title, shortDescription, dos, donts, image, category)

## Project Structure

```
.
├── main.py              # Appwrite Function entrypoint
├── predict.py           # Model loading and inference logic
├── requirements.txt     # Python dependencies
└── README.md            # This file
```

**Note**: The TensorFlow model is NOT included in this repository. It is stored in Appwrite Storage and downloaded at runtime.

## Setup

### 1. Prerequisites

- Appwrite Cloud account
- TensorFlow model file

### 2. Upload Model to Appwrite Storage

1. Go to **Storage** in the Appwrite dashboard
2. Create a new bucket (e.g., `models`) or use an existing one
3. Upload your `care_symbols_model_*.keras` file
4. Copy the **File ID** from the uploaded file
5. Note the **Bucket ID**

You'll need these IDs for the environment variables.

### 3. Environment Variables

Configure these environment variables in your Appwrite Function settings:

| Variable              | Description                                                   | Example                        | Required |
| --------------------- | ------------------------------------------------------------- | ------------------------------ | -------- |
| `APPWRITE_ENDPOINT`   | Appwrite API endpoint                                         | `https://cloud.appwrite.io/v1` | Yes      |
| `APPWRITE_PROJECT_ID` | Your Appwrite project ID                                      | `abc123def456`                 | Yes      |
| `APPWRITE_API_KEY`    | Server API key with Storage read + Databases read permissions | `secret_key_here`              | Yes      |
| `BUCKET_ID`           | Bucket ID where user images are uploaded                      | `uploads`                      | Yes      |
| `DATABASE_ID`         | Database ID containing care_symbols collection                | `68e6f397000c5435ebee`         | Yes      |
| `COLLECTION_ID`       | Collection ID for care symbols                                | `care_symbols`                 | Yes      |
| `MODEL_BUCKET_ID`     | Bucket ID where TensorFlow model is stored                    | `models`                       | Yes      |
| `MODEL_FILE_ID`       | File ID of the model in Storage                               | `abc123def`                    | Yes      |

### 4. Create and Deploy Function

1. Go to **Functions** in the Appwrite dashboard
2. Click **Create Function**
3. Upload the function code (main.py, predict.py, requirements.txt)
4. Configure the function settings:
   - **Runtime**: Python 3.11
   - **Entrypoint**: `main.py`
   - **Timeout**: 60 seconds
   - **Memory**: 1024 MB (TensorFlow requires significant memory)
5. Add all **Environment Variables** from the table above
6. Deploy the function

The model will be automatically downloaded from Appwrite Storage when the function runs.

## Usage

### Request Format

**Endpoint**: `POST /v1/functions/{functionId}/executions`

**Headers**:

```json
{
  "X-Appwrite-Project": "your_project_id",
  "X-Appwrite-Key": "your_api_key"
}
```

**Body**:

```json
{
  "fileId": "67890abcdef",
  "topK": 5,
  "threshold": 0.4
}
```

**Parameters**:

- `fileId` (required): ID of the uploaded image in Appwrite Storage
- `topK` (optional, default: 5): Number of top predictions to return
- `threshold` (optional, default: 0.4): Minimum confidence threshold (0-1)

### Response Format

**Success Response** (200):

```json
{
  "success": true,
  "fileId": "67890abcdef",
  "results": [
    {
      "title": "Do Not Bleach",
      "confidence": 0.9977,
      "shortDescription": "Do not use bleach on this garment. It's shown as a triangle with an X over it.",
      "dos": "Use color-safe alternatives",
      "donts": "Don't use any type of bleach",
      "image": "68e81a0a000ac612b755",
      "category": "bleach"
    },
    {
      "title": "Cool Iron",
      "confidence": 0.9853,
      "shortDescription": "Iron on low temperature, ~110 °C. It's shown as an iron with one dot.",
      "dos": "Iron inside out or with a cloth on low heat",
      "donts": "Don't apply medium or high heat",
      "image": "68e82e17002421e949ba",
      "category": "ironing"
    }
  ]
}
```

**Error Response** (400/500):

```json
{
  "success": false,
  "error": "Missing required parameter: fileId"
}
```

## Testing

1. Upload a test image to your Appwrite Storage bucket
2. Go to **Functions** → Your function → **Execute**
3. Enter the test parameters:
   ```json
   {
     "fileId": "your_uploaded_file_id",
     "topK": 5,
     "threshold": 0.4
   }
   ```
4. Click **Execute** and view the results

## How It Works

### Model Loading Strategy

The function uses Appwrite Storage to store and load the TensorFlow model:

1. **First Run (Cold Start)**:

   - Downloads model from Appwrite Storage using `MODEL_BUCKET_ID` and `MODEL_FILE_ID`
   - Caches model in `/tmp` directory
   - Loads model into memory
   - **Duration**: ~3-5 seconds

2. **Subsequent Runs (Warm)**:
   - Reuses cached model from `/tmp`
   - Model already loaded in memory
   - **Duration**: ~500ms-1s

**Benefits**:

- Small deployment package (~2MB vs ~615MB)
- Faster deployments
- Easy model updates (just replace file in Storage)
- No deployment size limits

### Image Preprocessing

The model expects images of size `224x224` pixels (standard for transfer learning models). If your model uses a different input size, update `target_size` in `predict.py`.

## Important Notes

### Model Class Names

The `predict.py` file contains a hardcoded list of class names in the `_get_class_names()` method. **This must match the exact order of classes used during model training.**

If your model was trained with a different order or different classes, update the list in `predict.py`.

### Required Permissions

The API key specified in `APPWRITE_API_KEY` must have:

- **Storage**: Read permission for both user images bucket and model bucket
- **Database**: Read permission for the care_symbols collection

## Error Handling

The function includes comprehensive error handling:

- **400 Bad Request**: Missing `fileId` or invalid JSON
- **500 Internal Server Error**: Configuration errors, model loading failures, or unexpected errors
- Logs are written to stderr for debugging

## Performance Considerations

- **Cold Start**: First execution downloads and loads the model (~3-5 seconds)
- **Warm Execution**: Subsequent executions reuse loaded model (~500ms-1s)
- **Timeout**: Set function timeout to at least 60 seconds
- **Memory**: TensorFlow model requires ~512MB-1GB RAM
- **Cache Duration**: Model cached in `/tmp` persists across warm executions

## Troubleshooting

### Model Loading Errors

- Verify `MODEL_BUCKET_ID` and `MODEL_FILE_ID` are correct
- Ensure API key has Storage read permissions for model bucket
- Check that model file is accessible in Storage
- Review function execution logs for specific error messages

### Prediction Errors

- Verify image preprocessing matches training preprocessing
- Check class names order in `_get_class_names()`
- Ensure model file is not corrupted
- Review function execution logs

### Database Query Errors

- Verify `DATABASE_ID` and `COLLECTION_ID` are correct
- Ensure API key has database read permissions
- Check that `title` field in collection matches model labels exactly

## License

MIT
