from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Dict, List, Optional


router = APIRouter()


class TabularFeatures(BaseModel):
    period_days: Optional[float] = None
    epoch: Optional[float] = None
    duration_hours: Optional[float] = None
    transit_depth_ppm: Optional[float] = None
    snr: Optional[float] = None
    rp_over_rs: Optional[float] = None
    impact_parameter: Optional[float] = None
    stellar_radius_rs: Optional[float] = None
    kepmag_tmag: Optional[float] = None


class TabularRequest(BaseModel):
    mission: str = Field(..., pattern=r"^(KEPLER|K2|TESS)$")
    object_id: str
    features: TabularFeatures
    raw_row: Optional[dict] = None


class TabularVectorRequest(BaseModel):
    """
    Accepts a single prediction vector in z-scored feature space with mission one-hot encoding.

    Expected order (len=8):
      [
        z_period_days,
        z_transit_depth_ppm,
        z_planet_radius_re,
        z_stellar_radius_rs,
        z_snr,
        mission_K2,
        mission_KEPLER,
        mission_TESS
      ]
    """
    input_features: List[float]


class ShapItem(BaseModel):
    feature: str
    value: float | int | str | None = None
    shap: float


class TabularResponse(BaseModel):
    label: str
    probabilities: Dict[str, float]
    calibrated_confidence: float
    reliability_band: str
    explanations: Dict[str, List[ShapItem] | str]
    validation: Dict[str, str | float | int | bool] | None = None
    version: Dict[str, str]


@router.post("/predict", response_model=TabularResponse)
def predict_tabular(req: TabularRequest) -> TabularResponse:
    # Stub: replace with real artifact loading + model inference
    probs = {"CONFIRMED": 0.7, "CANDIDATE": 0.2, "FALSE POSITIVE": 0.1}
    label = max(probs, key=probs.get)
    return TabularResponse(
        label=label,
        probabilities=probs,
        calibrated_confidence=probs[label],
        reliability_band="well-calibrated",
        explanations={
            "top_shap": [
                ShapItem(feature="transit_depth_ppm", value=req.features.transit_depth_ppm, shap=0.18),
                ShapItem(feature="snr", value=req.features.snr, shap=0.12),
                ShapItem(feature="rp_over_rs", value=req.features.rp_over_rs, shap=0.09),
            ],
            "text": "Depth strong for this SNR; geometry consistent; likely planet.",
        },
        validation={"mission_domain_check": "ok", "cross_mission_auc": 0.88},
        version={"model": "tabular-v1.0", "imputer": "numeric_imputer.joblib", "scaler": "numeric_scaler.joblib", "calibrator": "isotonic"},
    )


@router.post("/predict_vector", response_model=TabularResponse)
def predict_tabular_vector(req: TabularVectorRequest) -> TabularResponse:
    # Stub implementation using provided vector; replace with real model inference
    vec = req.input_features
    # Simple heuristic from vector to vary output slightly
    score = 0.5
    if len(vec) >= 5:
        score = max(0.0, min(1.0, 0.5 + 0.1 * float(vec[1]) + 0.05 * float(vec[4])))
    probs = {
        "CONFIRMED": round(score, 4),
        "CANDIDATE": round(max(0.0, 0.8 - score) * 0.5, 4),
        "FALSE POSITIVE": round(max(0.0, 1.0 - score - max(0.0, 0.8 - score) * 0.5), 4),
    }
    label = max(probs, key=probs.get)
    return TabularResponse(
        label=label,
        probabilities=probs,
        calibrated_confidence=probs[label],
        reliability_band="well-calibrated",
        explanations={
            "top_shap": [
                ShapItem(feature="z_transit_depth_ppm", value=vec[1] if len(vec) > 1 else None, shap=0.18),
                ShapItem(feature="z_snr", value=vec[4] if len(vec) > 4 else None, shap=0.12),
                ShapItem(feature="z_planet_radius_re", value=vec[2] if len(vec) > 2 else None, shap=0.09),
            ],
            "text": "Vector-based request processed.",
        },
        validation={"vector_len": len(vec)},
        version={"model": "tabular-v1.0", "imputer": "numeric_imputer.joblib", "scaler": "numeric_scaler.joblib", "calibrator": "isotonic"},
    )


