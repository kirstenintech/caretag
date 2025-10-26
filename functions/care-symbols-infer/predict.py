"""
TensorFlow Lite model inference for Care Symbols classification.
TFLite is much lighter than full TensorFlow (~5MB vs ~590MB).
Loads model once and provides prediction interface.
Supports loading model from local path or Appwrite Storage.
"""

import os
import sys
from io import BytesIO

# Lazy imports to speed up cold start
# TensorFlow Lite is only imported when actually needed
numpy = None
Image = None
tflite = None


def _lazy_import_tflite():
    """Lazy import TensorFlow Lite runtime to reduce cold start time"""
    global tflite
    if tflite is None:
        print("[INFO] Importing TFLite runtime...", file=sys.stderr, flush=True)
        try:
            # Try ai-edge-litert first (newer Google package)
            from ai_edge_litert import interpreter as _tflite
        except ImportError:
            # Fallback to tflite_runtime (older package)
            from tflite_runtime import interpreter as _tflite
        tflite = _tflite
        print("[INFO] TFLite runtime imported successfully", file=sys.stderr, flush=True)
    return tflite


def _lazy_import_numpy():
    """Lazy import numpy"""
    global numpy
    if numpy is None:
        import numpy as _numpy
        numpy = _numpy
    return numpy


def _lazy_import_pil():
    """Lazy import PIL"""
    global Image
    if Image is None:
        from PIL import Image as _Image
        Image = _Image
    return Image


class CareSymbolPredictor:
    """Singleton-style predictor that loads the model once"""

    _instance = None
    _interpreter = None
    _input_details = None
    _output_details = None
    _model_loaded = False

    def __new__(cls, model_path=None, model_bucket_id=None, model_file_id=None):
        if cls._instance is None:
            cls._instance = super(CareSymbolPredictor, cls).__new__(cls)

        # Only load model once, but allow reinitialization if parameters change
        if not cls._model_loaded:
            cls._instance._load_model(model_path, model_bucket_id, model_file_id)
            cls._model_loaded = True

        return cls._instance

    def _load_model(self, model_path=None, model_bucket_id=None, model_file_id=None):
        """
        Load the TensorFlow Lite model from local path or Appwrite Storage.

        Priority:
        1. If model_path exists locally, use it
        2. Check /tmp cache for previously downloaded model
        3. If model credentials provided, download from Appwrite Storage to /tmp
        4. Raise error if neither available

        The model download is separate from loading to allow caching.
        """
        # Lazy import TensorFlow Lite only when actually loading the model
        _tflite = _lazy_import_tflite()

        # Determine the model path to load from
        final_model_path = None

        # Option 1: Load from local bundled path
        if model_path and os.path.exists(model_path):
            print(f"[INFO] Using bundled model at: {model_path}", file=sys.stderr, flush=True)
            final_model_path = model_path

        # Option 2: Check /tmp cache or download from Appwrite Storage
        elif model_bucket_id and model_file_id:
            temp_model_path = "/tmp/care_symbols_model.tflite"

            # Check if model is already cached in /tmp (from previous execution)
            if os.path.exists(temp_model_path):
                print(f"[INFO] Using cached model from {temp_model_path}", file=sys.stderr, flush=True)
                final_model_path = temp_model_path
            else:
                # Download model from Storage using direct HTTP
                print(f"[INFO] Model not cached. Downloading from Appwrite Storage (bucket={model_bucket_id}, file={model_file_id})", file=sys.stderr, flush=True)

                # Direct HTTP request to avoid SDK bug
                import requests
                endpoint = os.environ.get("APPWRITE_ENDPOINT")
                project_id = os.environ.get("APPWRITE_PROJECT_ID")
                api_key = os.environ.get("APPWRITE_API_KEY")

                url = f"{endpoint}/storage/buckets/{model_bucket_id}/files/{model_file_id}/download"
                headers = {
                    "X-Appwrite-Project": project_id,
                    "X-Appwrite-Key": api_key
                }

                response = requests.get(url, headers=headers)
                response.raise_for_status()
                model_bytes = response.content

                # Save to /tmp for caching across warm starts
                print(f"[INFO] Saving model to {temp_model_path} ({len(model_bytes)} bytes)", file=sys.stderr, flush=True)
                with open(temp_model_path, "wb") as f:
                    f.write(model_bytes)

                print(f"[INFO] Model cached successfully", file=sys.stderr, flush=True)
                final_model_path = temp_model_path

        else:
            # No valid source
            raise ValueError(
                "No valid model source provided. Either provide a local model_path "
                "or Appwrite Storage credentials (model_bucket_id, model_file_id)"
            )

        # Now load the TFLite model
        print(f"[INFO] Loading TensorFlow Lite model from {final_model_path}...", file=sys.stderr, flush=True)
        self._interpreter = _tflite.Interpreter(model_path=final_model_path)
        self._interpreter.allocate_tensors()

        # Get input and output details
        self._input_details = self._interpreter.get_input_details()
        self._output_details = self._interpreter.get_output_details()
        print(f"[INFO] Model loaded successfully", file=sys.stderr, flush=True)

    def _preprocess_image(self, image_bytes):
        """
        Preprocess image bytes for model inference.
        Adjust target_size based on your model's expected input shape.
        """
        # Lazy imports
        _Image = _lazy_import_pil()
        _np = _lazy_import_numpy()

        # Open image from bytes
        img = _Image.open(BytesIO(image_bytes))
        print(f"[DEBUG] Original image size: {img.size}, mode: {img.mode}", file=sys.stderr, flush=True)

        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Get model's expected input shape from input_details
        input_shape = self._input_details[0]['shape']
        # Shape is typically [batch, height, width, channels]
        target_size = (input_shape[1], input_shape[2])
        print(f"[DEBUG] Model expects input shape: {input_shape}, resizing to: {target_size}", file=sys.stderr, flush=True)
        img = img.resize(target_size)

        # Convert to array
        img_array = _np.array(img)

        # Check model's expected input type from input_details
        expected_dtype = self._input_details[0]['dtype']
        print(f"[DEBUG] Model expects dtype: {expected_dtype}", file=sys.stderr, flush=True)

        if expected_dtype == _np.uint8:
            # Model expects UINT8 (0-255), keep as-is
            img_array = img_array.astype('uint8')
            print(f"[DEBUG] Using UINT8 input, range: [{img_array.min()}, {img_array.max()}]", file=sys.stderr, flush=True)
        else:
            # Model expects FLOAT32, normalize to 0.0-1.0
            img_array = img_array.astype('float32') / 255.0
            print(f"[DEBUG] Using FLOAT32 input, range: [{img_array.min():.3f}, {img_array.max():.3f}]", file=sys.stderr, flush=True)

        # Add batch dimension
        img_array = _np.expand_dims(img_array, axis=0)
        print(f"[DEBUG] Final array shape: {img_array.shape}", file=sys.stderr, flush=True)

        return img_array

    def predict(self, image_bytes, top_k=5, threshold=0.1):
        """
        Run inference on image bytes using TFLite.

        Args:
            image_bytes: Raw image file bytes
            top_k: Number of top predictions to return
            threshold: Minimum confidence threshold

        Returns:
            List of dicts with 'label' and 'confidence' keys
        """
        # Preprocess
        img_array = self._preprocess_image(image_bytes)

        # Run TFLite inference
        self._interpreter.set_tensor(self._input_details[0]['index'], img_array)
        self._interpreter.invoke()

        # Get predictions - make a COPY to avoid reference issues
        predictions = self._interpreter.get_tensor(self._output_details[0]['index']).copy()

        # predictions shape: (1, num_classes)
        predictions = predictions[0]
        print(f"[DEBUG] Raw predictions shape: {predictions.shape}, top 5 values: {sorted(predictions, reverse=True)[:5]}", file=sys.stderr, flush=True)

        # Get class names
        class_names = self._get_class_names()

        # Create list of results
        results = []
        for idx, confidence in enumerate(predictions):
            if confidence >= threshold:
                label = class_names[idx] if idx < len(class_names) else f"Class_{idx}"
                results.append({
                    "label": label,
                    "confidence": float(confidence)
                })

        print(f"[DEBUG] Found {len(results)} predictions above threshold {threshold}", file=sys.stderr, flush=True)

        # Sort by confidence descending
        results.sort(key=lambda x: x["confidence"], reverse=True)

        # Return top K
        return results[:top_k]

    def _get_class_names(self):
        """
        Return the list of class names in the same order as model output.

        IMPORTANT: This order MUST match the training data!
        Order from balanced_class_info.json
        """
        return [
            "Cold Wash",
            "Cool Iron",
            "Do Not Bleach",
            "Do Not Dry Clean",
            "Do Not Iron",
            "Do Not Tumble Dry",
            "Do Not Wash",
            "Drip Dry",
            "Dry Clean Except Trichloroethylene",
            "Dry Flat",
            "Dry in the Shade",
            "Hand Wash",
            "Hang Dry",
            "Hot Iron",
            "Hot Wash",
            "Machine Wash",
            "Machine Wash: Gentle / Delicate",
            "Machine Wash: Permanent Press",
            "Non-Chlorine Bleach If Needed",
            "Normal Cycle Low Heat",
            "Normal Cycle Medium Heat",
            "Tumble Dry",
            "Warm Iron",
            "Warm Wash",
            "Warm/Hot Wash",
            "OK to Bleach",
            "Dry Clean: Any Solvent (A)",
            "Dry Clean: Petroleum Solvent Only",
            "Dry Clean",
            "Gentle Cycle Low Heat",
            "Gentle Cycle Medium Heat",
            "Gentle Cycle No Heat",
            "No Heat Dry",
            "Normal Cycle High Heat",
            "Permanent Press Low Heat",
            "Permanent Press Medium Heat",
            "Permanent Press No Heat",
            "No Steam",
            "Sanitize Wash"
        ]


