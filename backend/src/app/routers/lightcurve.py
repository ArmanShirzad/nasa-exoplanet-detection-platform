from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Dict, List, Optional


router = APIRouter()


class LCInput(BaseModel):
    source: str = Field(..., pattern=r"^(upload|fits|csv|remote)$")
    mission: Optional[str] = Field(None, pattern=r"^(KEPLER|K2|TESS)$")
    object_id: Optional[str] = None
    urls: Optional[Dict[str, str]] = None


class LCData(BaseModel):
    time: List[float]
    flux: List[float]
    flux_err: Optional[List[float]] = None
    quality: Optional[List[int]] = None


class LCRequest(BaseModel):
    input: LCInput
    data: Optional[LCData] = None


class Vetting(BaseModel):
    odd_even_consistent: bool
    secondary_candidate: bool
    centroid_warning: str
    duty_cycle_ok: bool
    snr: float


class TransitParams(BaseModel):
    period_days: float
    epoch_bjd: float
    duration_hours: float
    depth_ppm: float
    rp_over_rs: float
    impact_parameter: float


class PlotLinks(BaseModel):
    raw_lightcurve_png: str
    detrended_png: str
    periodogram_png: str
    phase_fold_png: str
    odd_even_overlay_png: str


class ShapItem(BaseModel):
    feature: str
    value: float | int | str | None = None
    shap: float


class LCResponse(BaseModel):
    label: str
    probability: float
    reliability_band: str
    transit_params: TransitParams
    vetting: Vetting
    plots: PlotLinks
    explanations: Dict[str, List[ShapItem] | str]
    report: Dict[str, str]
    version: Dict[str, str]


@router.post("/analyze", response_model=LCResponse)
def analyze_lightcurve(req: LCRequest) -> LCResponse:
    # Stub: replace with real LC pipeline (detrend → TLS/BLS → fit → vetting → classify)
    params = TransitParams(
        period_days=12.345,
        epoch_bjd=2457001.234,
        duration_hours=2.8,
        depth_ppm=950.0,
        rp_over_rs=0.03,
        impact_parameter=0.35,
    )
    return LCResponse(
        label="CONFIRMED",
        probability=0.83,
        reliability_band="well-calibrated",
        transit_params=params,
        vetting=Vetting(
            odd_even_consistent=True,
            secondary_candidate=False,
            centroid_warning="none",
            duty_cycle_ok=True,
            snr=11.2,
        ),
        plots=PlotLinks(
            raw_lightcurve_png="/static/plots/raw.png",
            detrended_png="/static/plots/detrended.png",
            periodogram_png="/static/plots/periodogram.png",
            phase_fold_png="/static/plots/phasefold.png",
            odd_even_overlay_png="/static/plots/oddeven.png",
        ),
        explanations={
            "top_shap": [
                ShapItem(feature="depth_ppm", value=params.depth_ppm, shap=0.16),
                ShapItem(feature="duration_hours", value=params.duration_hours, shap=0.12),
            ],
            "text": "Clear periodicity; no secondary; centroid clean. Planet likely.",
        },
        report={"download_url": "/static/reports/last_report.json"},
        version={
            "pipeline": "lc-v1.0",
            "detrend": "wotan",
            "search": "TLS",
            "fit": "batman",
            "classifier": "lc-small-v1",
        },
    )


