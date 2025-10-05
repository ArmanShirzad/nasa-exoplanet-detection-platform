#!/usr/bin/env python3
"""Train a simple, strong baseline model on the prepared splits.

Inputs (created by prepare_exoplanet_data.py):
- data/processed/X_train.npy, X_val.npy, X_test.npy   (already imputed + scaled)
- data/processed/y_train.csv, y_val.csv, y_test.csv   (with column y_binary)

Outputs:
- artifacts/rf_baseline.joblib                        (trained model)
- artifacts/baseline_report.txt                       (metrics summary)
- artifacts/feature_importances.csv                   (Gini importances)

Run:
  python train_baseline.py
"""
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score, average_precision_score
)
import joblib

BASE = Path(__file__).resolve().parent.parent.joinpath("Data Pipeline")
print(BASE)
PROC = BASE / "data" / "processed"
ART  = BASE / "artifacts"

FEATURES_ORDER = ["period_days","transit_depth_ppm","planet_radius_re","stellar_radius_rs","snr"]

def load_splits():
    X_train = np.load(PROC / "X_train.npy")
    X_val   = np.load(PROC / "X_val.npy")
    X_test  = np.load(PROC / "X_test.npy")

    y_train = pd.read_csv(PROC / "y_train.csv")["y_binary"].astype(int).values
    y_val   = pd.read_csv(PROC / "y_val.csv")["y_binary"].astype(int).values
    y_test  = pd.read_csv(PROC / "y_test.csv")["y_binary"].astype(int).values
    return (X_train, y_train), (X_val, y_val), (X_test, y_test)

def evaluate(name, clf, X, y):
    proba = clf.predict_proba(X)[:, 1]
    pred  = (proba >= 0.5).astype(int)

    report = classification_report(y, pred, digits=3)
    cm     = confusion_matrix(y, pred)
    roc    = roc_auc_score(y, proba)
    pr     = average_precision_score(y, proba)

    lines = []
    lines.append(f"== {name} ==")
    lines.append(report.strip())
    lines.append(f"ROC-AUC: {roc:.4f}")
    lines.append(f"PR-AUC : {pr:.4f}")
    lines.append("Confusion matrix [ [TN FP]\n                   [FN TP] ]:")
    lines.append(str(cm))
    return "\n".join(lines) + "\n\n"

def main():
    (X_train, y_train), (X_val, y_val), (X_test, y_test) = load_splits()

    # Simple, strong baseline
    clf = RandomForestClassifier(
        n_estimators=400,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    clf.fit(X_train, y_train)

    # Evaluate and save report
    ART.mkdir(parents=True, exist_ok=True)
    report_text  = []
    report_text.append(evaluate("VAL",  clf, X_val,  y_val))
    report_text.append(evaluate("TEST", clf, X_test, y_test))

    report_full = "\n".join(report_text)
    print(report_full)
    (ART / "baseline_report.txt").write_text(report_full)

    # Save model
    joblib.dump(clf, ART / "rf_baseline.joblib")
    
    # Save feature importances (Gini)
    importances = getattr(clf, "feature_importances_", None)
    if importances is not None:
        import pandas as pd
        fi = pd.DataFrame({
            "feature": FEATURES_ORDER,
            "importance": importances,
        }).sort_values("importance", ascending=False)
        fi.to_csv(ART / "feature_importances.csv", index=False)

    print("Saved model ->", ART / "rf_baseline.joblib")
    print("Saved report ->", ART / "baseline_report.txt")
    if (ART / "feature_importances.csv").exists():
        print("Saved feature importances ->", ART / "feature_importances.csv")

if __name__ == "__main__":
    main()
