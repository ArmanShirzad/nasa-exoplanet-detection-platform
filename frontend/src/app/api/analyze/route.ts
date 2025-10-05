import { NextRequest, NextResponse } from 'next/server';

interface AnalysisRequest {
  mode: 'upload' | 'manual';
  metadata?: {
    targetId?: string;
    raObj?: string;
    decObj?: string;
    keptmagTmag?: string;
    teff?: string;
    logg?: string;
    feh?: string;
    radius?: string;
    mass?: string;
    quality?: string;
    sectorQuarter?: string;
    camera?: string;
    ccd?: string;
  };
  timeseries?: Array<{
    time: number;
    flux: number;
    flux_err?: number;
  }>;
  raw_file_preview?: unknown[];
}

interface FeatureImportance {
  feature: string;
  importance: number;
  detail: string;
}

interface AnalysisResult {
  verdict: 'Exoplanet Detected' | 'Not an Exoplanet';
  confidence: number;
  explanation: string;
  feature_importances: FeatureImportance[];
  annotated_timeseries?: Array<{
    time: number;
    flux: number;
    highlight: boolean;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const data: AnalysisRequest = await request.json();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis logic
    const isExoplanet = Math.random() > 0.4; // 60% chance of exoplanet detection
    const confidence = Math.floor(Math.random() * 30) + 70; // 70-100% confidence
    
    // Generate feature importances
    const featureImportances: FeatureImportance[] = isExoplanet ? [
      {
        feature: "Transit Depth",
        importance: 0.34,
        detail: "Depth corresponds to ~1.2 Earth radii planet."
      },
      {
        feature: "SNR",
        importance: 0.22,
        detail: "High signal-to-noise ratio after detrending."
      },
      {
        feature: "Duration",
        importance: 0.18,
        detail: "Transit duration consistent with orbital mechanics."
      },
      {
        feature: "Odd-Even Depth",
        importance: 0.12,
        detail: "Consistent depths across multiple transits."
      },
      {
        feature: "Stellar Activity",
        importance: 0.08,
        detail: "Low stellar variability, clean transit signal."
      },
      {
        feature: "Period Consistency",
        importance: 0.06,
        detail: "Regular periodicity matches orbital prediction."
      }
    ] : [
      {
        feature: "Transit Depth",
        importance: 0.25,
        detail: "Depth variations inconsistent with planetary transits."
      },
      {
        feature: "Stellar Activity",
        importance: 0.30,
        detail: "High stellar variability masks potential signals."
      },
      {
        feature: "Noise Level",
        importance: 0.20,
        detail: "Instrumental noise exceeds signal detection threshold."
      },
      {
        feature: "Periodicity",
        importance: 0.15,
        detail: "No clear periodic pattern detected."
      },
      {
        feature: "Quality Flags",
        importance: 0.10,
        detail: "Data quality flags indicate systematic issues."
      }
    ];
    
    // Generate annotated timeseries
    const annotatedTimeseries = data.timeseries?.map(point => ({
      time: point.time,
      flux: point.flux,
      highlight: isExoplanet && Math.random() > 0.85 // Highlight some points as potential transits
    })) || Array.from({ length: 100 }, (_, i) => {
      const time = 2454833 + i * 0.1;
      const baseFlux = 1.0;
      const noise = (Math.random() - 0.5) * 0.01;
      const transitDepth = isExoplanet && i > 40 && i < 60 ? -0.02 : 0;
      const highlight = isExoplanet && i > 40 && i < 60;
      
      return {
        time,
        flux: baseFlux + transitDepth + noise,
        highlight
      };
    });
    
    const result: AnalysisResult = {
      verdict: isExoplanet ? 'Exoplanet Detected' : 'Not an Exoplanet',
      confidence,
      explanation: isExoplanet 
        ? "The flux pattern matches known exoplanet signatures: periodic transit dips with consistent depth and duration. The detected signal shows characteristics typical of a planetary companion with a radius of approximately 1.2 Earth radii orbiting in the stellar habitable zone."
        : "The flux variations observed are inconsistent with planetary transit signatures. The data shows irregular patterns more characteristic of stellar activity, instrumental noise, or other astrophysical phenomena. No statistically significant exoplanet signal was detected.",
      feature_importances: featureImportances,
      annotated_timeseries: annotatedTimeseries
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze data' },
      { status: 500 }
    );
  }
}

