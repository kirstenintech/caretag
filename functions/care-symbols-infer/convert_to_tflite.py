#!/usr/bin/env python3
"""
Convert TensorFlow .keras model to TFLite format for ultralight inference.

TFLite Runtime is ~5MB vs ~590MB for full TensorFlow.

Usage:
    pip install tensorflow
    python convert_to_tflite.py
"""

import tensorflow as tf

# Path to your existing .keras model
keras_model_path = "care_symbols_model_20251009_233516.keras"
tflite_model_path = "care_symbols_model.tflite"

print(f"Loading {keras_model_path}...")
model = tf.keras.models.load_model(keras_model_path)

print("Converting to TFLite...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# Optional: Optimize for size
converter.optimizations = [tf.lite.Optimize.DEFAULT]

# Convert
tflite_model = converter.convert()

# Save
with open(tflite_model_path, 'wb') as f:
    f.write(tflite_model)

print(f"✓ Model converted successfully: {tflite_model_path}")
print(f"  Size: {len(tflite_model) / 1024 / 1024:.2f} MB")

# Test the model
print("\nTesting TFLite model...")
interpreter = tf.lite.Interpreter(model_path=tflite_model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

print(f"✓ TFLite model validated")
print(f"  Input shape: {input_details[0]['shape']}")
print(f"  Output shape: {output_details[0]['shape']}")

print(f"\nNext steps:")
print(f"1. Upload {tflite_model_path} to Appwrite Storage")
print(f"2. Update MODEL_FILE_ID environment variable")
print(f"3. Deploy the updated function with requirements.txt")
