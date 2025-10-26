# Care Symbols Inference - Appwrite Function

An Appwrite Function that accepts an uploaded image file ID, runs TensorFlow multi-label classification to identify care symbols, and enriches the results with detailed care instructions from the Appwrite database.

## Overview

This function:
1. Accepts a `fileId` from Appwrite Storage
2. Downloads the image file
3. Runs inference using a TensorFlow model
4. Returns top predictions with confidence scores
5. Enriches each prediction with metadata from the `care_symbols` collection (title, shortDescription, dos, donts, image, category)

## Project Structure

```
.
├── main.py                                    # Appwrite Function entrypoint
├── predict.py                                 # Model loading and inference logic
├── requirements.txt                           # Python dependencies
├── care_symbols_model_20251009_233516.keras  # TensorFlow model file
├── .env.example                               # Environment variable template
└── README.md                                  # This file
```

## Setup

### 1. Prerequisites

- Appwrite instance (Cloud or self-hosted)
- Appwrite CLI installed (`npm install -g appwrite`)
- Python 3.9+ for local testing

### 2. Upload Model to Appwrite Storage (Recommended)

To reduce deployment size, upload your model file to Appwrite Storage:

```bash
# Via Console:
# 1. Go to Storage → Create a new bucket (e.g., "models")
# 2. Upload care_symbols_model_20251009_233516.keras
# 3. Copy the File ID from the uploaded file

# Via CLI (if you have appwrite CLI configured):
appwrite storage createFile \
  --bucketId "models" \
  --fileId "unique()" \
  --file "./care_symbols_model_20251009_233516.keras"
```

Note the `bucketId` and `fileId` - you'll need these for environment variables.

### 3. Environment Variables

Configure these environment variables in your Appwrite Function settings:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `APPWRITE_ENDPOINT` | Appwrite API endpoint | `https://cloud.appwrite.io/v1` | Yes |
| `APPWRITE_PROJECT_ID` | Your Appwrite project ID | `abc123def456` | Yes |
| `APPWRITE_API_KEY` | Server API key with Storage read + Databases read permissions | `secret_key_here` | Yes |
| `BUCKET_ID` | Bucket ID where images are uploaded | `uploads` | Yes |
| `DATABASE_ID` | Database ID containing care_symbols collection | `68e6f397000c5435ebee` | Yes |
| `COLLECTION_ID` | Collection ID for care symbols | `care_symbols` | Yes |
| `MODEL_BUCKET_ID` | Bucket ID where model is stored | `models` | If using Storage |
| `MODEL_FILE_ID` | File ID of the model in Storage | `abc123def` | If using Storage |
| `MODEL_PATH` | Local path to bundled model file | `./model.keras` | If bundling |

**Choose ONE model loading strategy:**
- **Option A (Recommended)**: Set `MODEL_BUCKET_ID` and `MODEL_FILE_ID` to download from Storage
- **Option B**: Set `MODEL_PATH` and include model file in deployment

See `.env.example` for a template.

### 4. Create Appwrite Function

```bash
# Login to Appwrite
appwrite login

# Initialize function
appwrite init function

# Follow prompts and select:
# - Runtime: Python 3.11 (or latest Python runtime)
# - Entrypoint: main.py
```

### 5. Configure Function Settings

In your Appwrite Console:

1. Go to **Functions** → Your function
2. Add **Environment Variables** (see table above)
3. Set **Runtime**: Python 3.11
4. Set **Entrypoint**: `main.py`
5. Set **Timeout**: 60 seconds (adjust based on model size)

### 6. Deploy

**If using Storage for model (Option A - Recommended):**

Deploy WITHOUT the model file to keep package small:

```bash
# Deploy only code files
appwrite deploy function

# Or create tarball manually:
tar -czf function.tar.gz main.py predict.py requirements.txt
```

Upload `function.tar.gz` via Console with Build Commands: `pip install -r requirements.txt`

**If bundling model (Option B):**

Include model file in deployment:

```bash
# Deploy all files including model
appwrite deploy function

# Or create tarball:
tar -czf function.tar.gz main.py predict.py requirements.txt care_symbols_model_20251009_233516.keras
```

Note: Deployment will be ~615MB and may take longer.

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
  "threshold": 0.1
}
```

**Parameters**:
- `fileId` (required): ID of the uploaded image in Appwrite Storage
- `topK` (optional, default: 5): Number of top predictions to return
- `threshold` (optional, default: 0.1): Minimum confidence threshold (0-1)

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

### Local Testing

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
export APPWRITE_PROJECT_ID="your_project_id"
export APPWRITE_API_KEY="your_api_key"
export BUCKET_ID="uploads"
export DATABASE_ID="your_database_id"
export COLLECTION_ID="care_symbols"
export MODEL_PATH="./care_symbols_model_20251009_233516.keras"
```

3. Test prediction module:
```python
from predict import CareSymbolPredictor

predictor = CareSymbolPredictor("./care_symbols_model_20251009_233516.keras")

# Test with image bytes
with open("test_image.jpg", "rb") as f:
    image_bytes = f.read()

results = predictor.predict(image_bytes, top_k=5, threshold=0.1)
print(results)
```

### Production Testing

1. Upload a test image to your Appwrite Storage bucket
2. Get the `fileId` from the upload response
3. Execute the function via Appwrite Console or API:

```bash
curl -X POST \
  https://cloud.appwrite.io/v1/functions/{functionId}/executions \
  -H "X-Appwrite-Project: your_project_id" \
  -H "X-Appwrite-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"fileId": "your_file_id"}'
```

## Important Notes

### Model Class Names

The `predict.py` file contains a hardcoded list of class names in the `_get_class_names()` method. **This must match the exact order of classes used during model training.**

If your model was trained with a different order or different classes, update the list in `predict.py:98`.

### Image Preprocessing

The model expects images of size `224x224` pixels (common for transfer learning models). If your model uses a different input size, update `target_size` in `predict.py:31`.

### Model Storage Options

**Option A: Storage (Recommended)**
- Upload model to Appwrite Storage
- Downloaded on first run and cached in `/tmp`
- Set `MODEL_BUCKET_ID` and `MODEL_FILE_ID` env vars
- Pros:
  - Much smaller deployment package (~2MB vs ~615MB)
  - Easier model updates (just replace file in Storage)
  - Faster deployments
- Cons:
  - Slightly slower cold start (~3-5 seconds to download model)
  - Requires Storage bucket setup

**Option B: Bundle with Function**
- Include model file in deployment package
- Set `MODEL_PATH=./care_symbols_model_20251009_233516.keras`
- Pros:
  - Fastest cold start (model already local)
  - No external dependencies
- Cons:
  - Very large deployment package (~615MB)
  - Longer deployment times
  - May hit Appwrite deployment size limits

## Error Handling

The function includes comprehensive error handling:

- **400 Bad Request**: Missing `fileId` or invalid JSON
- **500 Internal Server Error**: Configuration errors, model loading failures, or unexpected errors
- Logs are written to stderr for debugging in Appwrite Console

## Performance Considerations

- **Cold Start**: First execution loads the model (~2-5 seconds)
- **Warm Execution**: Subsequent executions reuse loaded model (~500ms-1s)
- **Timeout**: Set function timeout to at least 60 seconds
- **Memory**: TensorFlow model requires ~512MB-1GB RAM

## Troubleshooting

### Model Loading Errors
- Verify model file is included in deployment
- Check `MODEL_PATH` environment variable
- Ensure TensorFlow version matches training version

### Prediction Errors
- Verify image preprocessing matches training preprocessing
- Check class names order in `_get_class_names()`
- Review logs in Appwrite Console

### Database Query Errors
- Verify `DATABASE_ID` and `COLLECTION_ID` are correct
- Ensure API key has database read permissions
- Check that `title` field in collection matches model labels exactly

## License

MIT

## Support

For issues or questions, please open an issue in this repository.
