"""
Appwrite Function: Care Symbols Inference
Accepts an uploaded image file ID, runs TensorFlow inference, and enriches results
with care symbol metadata from the Appwrite database.
"""

import os
import json
import sys
from appwrite.client import Client
from appwrite.query import Query

# Import with package-relative import for Appwrite Open Runtimes
try:
    from .predict import CareSymbolPredictor  # when loaded as package "function"
except ImportError:
    from predict import CareSymbolPredictor   # fallback for local runs


def log(message, level="INFO"):
    """Simple logging helper"""
    print(f"[{level}] {message}", file=sys.stderr, flush=True)


def get_env_var(key, required=True):
    """Get environment variable with validation"""
    value = os.environ.get(key)
    if required and not value:
        raise ValueError(f"Missing required environment variable: {key}")
    return value


def init_appwrite_client():
    """Initialize Appwrite client with credentials from environment"""
    endpoint = get_env_var("APPWRITE_ENDPOINT")
    project_id = get_env_var("APPWRITE_PROJECT_ID")
    api_key = get_env_var("APPWRITE_API_KEY")

    client = Client()
    client.set_endpoint(endpoint)
    client.set_project(project_id)
    client.set_key(api_key)

    return client


def download_image(client, bucket_id, file_id):
    """Download image bytes from Appwrite Storage using direct HTTP call"""
    log(f"Downloading file {file_id} from bucket {bucket_id}")

    try:
        # Direct HTTP request to avoid SDK bug with GET requests
        import requests
        import hashlib
        endpoint = os.environ.get("APPWRITE_ENDPOINT")
        project_id = os.environ.get("APPWRITE_PROJECT_ID")
        api_key = os.environ.get("APPWRITE_API_KEY")

        url = f"{endpoint}/storage/buckets/{bucket_id}/files/{file_id}/download"
        headers = {
            "X-Appwrite-Project": project_id,
            "X-Appwrite-Key": api_key
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()

        content = response.content
        # Log hash to verify we're getting different images
        content_hash = hashlib.md5(content).hexdigest()
        log(f"Downloaded {len(content)} bytes, MD5: {content_hash[:8]}")

        return content
    except Exception as e:
        log(f"Failed to download image: {str(e)}", "ERROR")
        raise


def enrich_predictions(database_id, collection_id, predictions):
    """
    Query Appwrite database for predicted labels and enrich with metadata.
    Uses direct HTTP requests to avoid SDK bug. Fetches all docs once for efficiency.

    Args:
        database_id: Database ID
        collection_id: Collection ID for care_symbols
        predictions: List of dicts with 'label' and 'confidence'

    Returns:
        List of enriched results with title, confidence, shortDescription, dos, donts, image, category
    """
    log(f"Enriching {len(predictions)} predictions with database metadata")

    if not predictions:
        return []

    # Get credentials for direct HTTP calls
    import requests
    endpoint = os.environ.get("APPWRITE_ENDPOINT")
    project_id = os.environ.get("APPWRITE_PROJECT_ID")
    api_key = os.environ.get("APPWRITE_API_KEY")

    # Fetch documents one by one (simple and reliable)
    url = f"{endpoint}/databases/{database_id}/collections/{collection_id}/documents"
    headers = {
        "X-Appwrite-Project": project_id,
        "X-Appwrite-Key": api_key
    }

    by_title = {}
    for pred in predictions:
        label = pred["label"]
        try:
            # Use Query class to build proper query string
            query_str = Query.equal("title", [label])
            limit_str = Query.limit(1)

            params = [
                ("queries[]", query_str),
                ("queries[]", limit_str)
            ]

            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()
            docs = data.get("documents", [])
            if docs:
                by_title[label] = docs[0]
                log(f"Found metadata for '{label}'")
        except Exception as e:
            log(f"Error querying for '{label}': {str(e)}", "WARN")
            continue

    log(f"Fetched {len(by_title)} documents from database")

    # Now build enriched results
    enriched_results = []
    for pred in predictions:
        label = pred["label"]
        confidence = pred["confidence"]

        doc = by_title.get(label)
        if doc:
            enriched_results.append({
                "title": doc.get("title", label),
                "confidence": confidence,
                "shortDescription": doc.get("shortDescription", ""),
                "dos": doc.get("dos", ""),
                "donts": doc.get("donts", ""),
                "image": doc.get("image", ""),
                "category": doc.get("category", "")
            })
            log(f"Enriched '{label}' (confidence: {confidence:.3f})")
        else:
            # No match found, return basic info
            log(f"No database match for '{label}', returning basic info", "WARN")
            enriched_results.append({
                "title": label,
                "confidence": confidence,
                "shortDescription": "",
                "dos": "",
                "donts": "",
                "image": "",
                "category": ""
            })

    return enriched_results


def main(context):
    """
    Appwrite Function entrypoint

    Expected payload: { "fileId": "..." }
    Optional: { "fileId": "...", "topK": 5, "threshold": 0.1 }

    Returns: { "success": true, "results": [...] }
    """
    try:
        log("=== Care Symbols Inference Function Started ===")

        # Parse request payload
        try:
            if context.req.body:
                payload = json.loads(context.req.body)
            else:
                payload = {}
        except json.JSONDecodeError as e:
            return context.res.json({
                "success": False,
                "error": f"Invalid JSON payload: {str(e)}"
            })

        # Validate fileId
        file_id = payload.get("fileId")
        if not file_id:
            return context.res.json({
                "success": False,
                "error": "Missing required parameter: fileId"
            })

        # Optional parameters
        top_k = payload.get("topK", 5)
        threshold = payload.get("threshold", 0.5)  # Match local testing threshold

        log(f"Processing fileId={file_id}, topK={top_k}, threshold={threshold}")

        # Get environment configuration
        bucket_id = get_env_var("BUCKET_ID")
        database_id = get_env_var("DATABASE_ID")
        collection_id = get_env_var("COLLECTION_ID")

        # Model configuration - supports local path OR Appwrite Storage
        model_path = get_env_var("MODEL_PATH", required=False)
        model_bucket_id = get_env_var("MODEL_BUCKET_ID", required=False)
        model_file_id = get_env_var("MODEL_FILE_ID", required=False)

        # Initialize Appwrite client
        client = init_appwrite_client()

        # Download image (using direct HTTP to avoid SDK bug)
        image_bytes = download_image(client, bucket_id, file_id)
        log(f"Downloaded {len(image_bytes)} bytes")

        # Load model and run inference
        log("Running inference...")
        predictor = CareSymbolPredictor(
            model_path=model_path,
            model_bucket_id=model_bucket_id,
            model_file_id=model_file_id
        )
        predictions = predictor.predict(image_bytes, top_k=top_k, threshold=threshold)
        log(f"Got {len(predictions)} predictions")

        # Enrich with database metadata (using direct HTTP to avoid SDK bug)
        enriched_results = enrich_predictions(
            database_id, collection_id, predictions
        )

        log(f"=== Function completed successfully with {len(enriched_results)} results ===")

        return context.res.json({
            "success": True,
            "fileId": file_id,
            "results": enriched_results
        })

    except ValueError as e:
        # Configuration errors
        log(f"Configuration error: {str(e)}", "ERROR")
        return context.res.json({
            "success": False,
            "error": f"Configuration error: {str(e)}"
        })

    except Exception as e:
        # Unexpected errors
        log(f"Unexpected error: {str(e)}", "ERROR")
        import traceback
        traceback.print_exc()

        return context.res.json({
            "success": False,
            "error": str(e)
        })
