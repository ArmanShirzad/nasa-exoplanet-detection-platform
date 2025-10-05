#!/usr/bin/env python3
"""
predict_one.py — use the trained baseline model to classify a new planet candidate.
"""

import numpy as np
import pandas as pd
import joblib
from pathlib import Path

# Set correct paths
BASE = Path(__file__).resolve().parent.parent / "Data Pipeline"
ART = BASE / "artifacts"

# Load artifacts
imputer = joblib.load(ART / "numeric_imputer.joblib")
scaler = joblib.load(ART / "numeric_scaler.joblib")
model = joblib.load(ART / "rf_baseline.joblib")

FEATURES = ["period_days", "transit_depth_ppm", "planet_radius_re", "stellar_radius_rs", "snr"]

def predict_exoplanet(input_dict: dict):
    """
    Example:
        input_dict = {
            "period_days": 365,
            "transit_depth_ppm": 500,
            "planet_radius_re": 1.0,
            "stellar_radius_rs": 1.0,
            "snr": 15
        }
    """
    x = pd.DataFrame([input_dict])[FEATURES]
    x_imp = imputer.transform(x)
    x_scaled = scaler.transform(x_imp)
    proba = model.predict_proba(x_scaled)[0, 1]
    label = "CONFIRMED" if proba >= 0.5 else "CANDIDATE"
    return label, float(proba)

if __name__ == "__main__":
    example = {
        "period_days": 5,
        "transit_depth_ppm": 200,
        "planet_radius_re": 0.5,
        "stellar_radius_rs": 0.9,
        "snr": 1
    }

    label, proba = predict_exoplanet(example)
    print(f"Prediction: {label} (probability={proba:.3f})")