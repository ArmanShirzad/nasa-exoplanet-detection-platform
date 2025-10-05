#!/usr/bin/env python3
"""
Make a KOI time-independent subset for linking with Kepler FITS light curves.

- Keeps identifiers (kepid, kepoi_name, kepler_name, disposition)
- Keeps time-independent / time-series–derived parameters (period, depth, duration, etc.)
- Adds Kepler filename stems & glob patterns (kplr{KIC9}-*_llc.fits / *_slc.fits)
- Deduplicates by kepid (keeps newest by rowupdate if present)
- Safe reader handles NASA '#' comments and odd delimiters

Usage (defaults assume your repo layout):
  python make_koi_timeseries_subset.py     --in "ML/Data Pipeline/data/raw/kepler_cumulative_koi.csv"     --out "ML/Data Pipeline/data/processed/koi_timeseries_subset.csv"
"""
import argparse
import csv
from pathlib import Path
import numpy as np
import pandas as pd

# ---- robust CSV reader (matches your pipeline) ----
def robust_read_table(path: Path) -> pd.DataFrame:
    from pandas.errors import ParserError
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        sample = f.read(65536)
        f.seek(0)
        try:
            sep = csv.Sniffer().sniff(sample, delimiters=[',', '\t', ';', '|']).delimiter
        except csv.Error:
            sep = ','
    common = dict(sep=sep, comment='#', encoding='utf-8', on_bad_lines='error', compression='infer')
    try:
        return pd.read_csv(path, engine='c', low_memory=False, **common)
    except (ParserError, ValueError):
        return pd.read_csv(path, engine='python', **common)

def main():
    # Defaults relative to typical repo layout
    default_in  = Path("ML/Data Pipeline/data/raw/kepler_cumulative_koi.csv")
    default_out = Path("ML/Data Pipeline/data/processed/koi_timeseries_subset.csv")

    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", type=Path, default=default_in, help="Path to KOI cumulative CSV")
    ap.add_argument("--out", dest="out", type=Path, default=default_out, help="Output CSV path")
    args = ap.parse_args()

    inp: Path = args.inp
    out: Path = args.out
    out.parent.mkdir(parents=True, exist_ok=True)

    if not inp.exists():
        raise SystemExit(f"Input not found: {inp}")

    df = robust_read_table(inp)

    # Columns to keep (identifiers + time-independent / time-series–derived)
    keep_map = {
        "kepid": "kepid",
        "kepoi_name": "kepoi_name",
        "kepler_name": "kepler_name",
        "koi_disposition": "koi_disposition",
        "koi_pdisposition": "koi_pdisposition",  # used only as fallback, dropped after
        "koi_period": "koi_period",
        "koi_depth": "koi_depth",
        "koi_duration": "koi_duration",
        "koi_time0bk": "koi_time0bk",
        "koi_impact": "koi_impact",
        "koi_model_snr": "koi_model_snr",
        "koi_prad": "koi_prad",
        "ra": "ra",
        "dec": "dec",
        "koi_kepmag": "koi_kepmag",
        "rowupdate": "rowupdate",  # optional, for dedupe ordering
    }
    have = [c for c in keep_map if c in df.columns]
    if not have:
        raise SystemExit("None of the expected KOI columns were found. Check the input file.")
    sub = df[have].rename(columns=keep_map).copy()

    # Fill disposition fallback if koi_disposition missing
    if "koi_disposition" in sub.columns and "koi_pdisposition" in sub.columns:
        mask = sub["koi_disposition"].isna() & sub["koi_pdisposition"].notna()
        sub.loc[mask, "koi_disposition"] = sub.loc[mask, "koi_pdisposition"]
        sub = sub.drop(columns=["koi_pdisposition"], errors="ignore")

    # Coerce numerics where applicable
    num_cols = ["kepid","koi_period","koi_depth","koi_duration","koi_time0bk",
                "koi_impact","koi_model_snr","koi_prad","ra","dec","koi_kepmag"]
    for c in num_cols:
        if c in sub.columns:
            sub[c] = pd.to_numeric(sub[c], errors="coerce")

    # Require kepid for FITS linking
    sub = sub.dropna(subset=["kepid"]).copy()
    sub["kepid"] = sub["kepid"].astype(np.int64)

    # Deduplicate by kepid (keep newest if rowupdate present)
    if "rowupdate" in sub.columns:
        sub["_t"] = pd.to_datetime(sub["rowupdate"], errors="coerce", utc=True)
        sub = sub.sort_values("_t", na_position="first").drop_duplicates(subset=["kepid"], keep="last")
        sub = sub.drop(columns=["_t"])
    else:
        sub = sub.drop_duplicates(subset=["kepid"], keep="last")

    # Build stems & glob patterns for FITS filenames
    sub["kic9"] = sub["kepid"].map(lambda k: f"{int(k):09d}")
    sub["fits_stem"] = "kplr" + sub["kic9"]
    sub["lc_llc_glob"] = sub["fits_stem"] + "-*_llc.fits"  # long cadence
    sub["lc_slc_glob"] = sub["fits_stem"] + "-*_slc.fits"  # short cadence

    # Final column order
    order = [
        "kepid","kepoi_name","kepler_name","koi_disposition",
        "koi_period","koi_depth","koi_duration","koi_time0bk","koi_impact","koi_model_snr","koi_prad",
        "ra","dec","koi_kepmag",
        "kic9","fits_stem","lc_llc_glob","lc_slc_glob"
    ]
    cols = [c for c in order if c in sub.columns]
    sub[cols].to_csv(out, index=False)
    print(f"[done] wrote {out} with {len(sub)} rows and {len(cols)} columns.")

if __name__ == "__main__":
    main()
