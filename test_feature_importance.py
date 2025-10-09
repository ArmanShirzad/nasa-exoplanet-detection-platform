#!/usr/bin/env python3
"""Test script to verify feature importance loading works correctly."""

import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend" / "src"
sys.path.insert(0, str(backend_path))

try:
    from app.routers.tabular import _get_artifacts_base, _lazy_load_artifacts
    
    print("Testing feature importance loading...")
    
    # Test artifacts base path
    artifacts_base = _get_artifacts_base()
    print(f"Artifacts base: {artifacts_base}")
    print(f"Feature importance file exists: {(artifacts_base / 'feature_importances.csv').exists()}")
    
    # Test loading
    _lazy_load_artifacts()
    
    # Import the global variable
    from app.routers.tabular import _FEATURE_IMPORTANCES
    
    print(f"Feature importances loaded: {_FEATURE_IMPORTANCES}")
    
    # Test with sample data
    sample_features = {
        "period_days": 10.5,
        "transit_depth_ppm": 1000.0,
        "planet_radius_re": 1.2,
        "stellar_radius_rs": 0.8,
        "snr": 15.0
    }
    
    print("\nSample feature importance analysis:")
    for feature_name, value in sample_features.items():
        if feature_name in _FEATURE_IMPORTANCES:
            importance = _FEATURE_IMPORTANCES[feature_name]
            print(f"{feature_name}: {importance:.4f} ({importance*100:.1f}%) - value={value}")
    
    print("\n✅ Feature importance loading test successful!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
