#!/usr/bin/env python3
"""
Evaluate the trained baseline model on a sample of KEPLER rows
from the unified *raw* table (real units), using the saved artifacts.

Assumptions:
- You already ran prepare_exoplanet_data.py and train_baseline.py
- Files exist under: ML/Data Pipeline/{data/processed, artifacts}

Run from repo root or adjust BASE below:
  python ML/training/test_on_kepler_samples.py
"""
from pathlib import Path
import numpy as np
import pandas as pd
import joblib
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score, average_precision_score
)

# ---------- Paths (adjust if needed) ----------
THIS = Path(__file__).resolve()
BASE = THIS.parent.parent / "Data Pipeline"   # ML/training -> ML -> Data Pipeline
PROC = BASE / "data" / "processed"
ART  = BASE / "artifacts"

print("BASE =", BASE)

# ---------- Load artifacts ----------
imputer = joblib.load(ART / "numeric_imputer.joblib")
scaler  = joblib.load(ART / "numeric_scaler.joblib")
model   = joblib.load(ART / "rf_baseline.joblib")

FEATURES = ["period_days","transit_depth_ppm","planet_radius_re","stellar_radius_rs","snr"]

# ---------- Load KEPLER subset from unified_raw ----------
df = pd.read_csv(PROC / "unified_raw.csv")
df = df[df["mission"].str.upper() == "KEPLER"].copy()

# keep only rows with labels and at least one non-null feature
df = df.dropna(subset=["label_binary"]).copy()
df["label_binary"] = df["label_binary"].astype(int)

# Limit to features + label + id for inspection
have_cols = [c for c in FEATURES if c in df.columns]
missing = [c for c in FEATURES if c not in df.columns]
if missing:
    raise SystemExit(f"Missing expected feature columns in unified_raw: {missing}")

# Optionally choose a sample size
SAMPLE_SIZE = 500  # change if you want more/less
if len(df) > SAMPLE_SIZE:
    df = df.sample(SAMPLE_SIZE, random_state=42).copy()

# ---------- Transform with artifacts ----------
X_raw = df[FEATURES].astype(float).values
X_imp = imputer.transform(X_raw)
X_z   = scaler.transform(X_imp)

y = df["label_binary"].values

# ---------- Predict ----------
proba = model.predict_proba(X_z)[:,1]
pred  = (proba >= 0.5).astype(int)

# ---------- Metrics ----------
report = classification_report(y, pred, digits=3)
cm     = confusion_matrix(y, pred)
roc    = roc_auc_score(y, proba)
pr     = average_precision_score(y, proba)

print("\n== KEPLER SAMPLE EVAL ==")
print(report)
print("ROC-AUC:", round(roc, 4))
print("PR-AUC :", round(pr, 4))
print("Confusion matrix:\n", cm)

# ---------- Save artifacts ----------
ART.mkdir(parents=True, exist_ok=True)
(ART / "kepler_sample_eval.txt").write_text(
    "\n".join([
        "== KEPLER SAMPLE EVAL ==",
        report,
        f"ROC-AUC: {roc:.4f}",
        f"PR-AUC : {pr:.4f}",
        f"Confusion matrix:\n{cm}",
        ""
    ])
)

# Save a few example predictions for inspection
out = df.copy()
out["prob_confirmed"] = proba
out["pred_binary"] = pred
keep_cols = ["source_id","mission","label_coarse","label_binary","prob_confirmed","pred_binary"] + FEATURES
cols = [c for c in keep_cols if c in out.columns]
out[cols].sort_values("prob_confirmed", ascending=False).to_csv(ART / "kepler_sample_predictions.csv", index=False)

print("\nSaved ->", ART / "kepler_sample_eval.txt")
print("Saved ->", ART / "kepler_sample_predictions.csv")
