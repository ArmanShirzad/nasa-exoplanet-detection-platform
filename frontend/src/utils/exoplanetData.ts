// Exoplanet data processing utilities
// Based on NASA Exoplanet Archive data structure

export interface ExoplanetData {
  id: string;
  name: string;
  ra: number; // Right Ascension in degrees
  dec: number; // Declination in degrees
  distance: number; // Distance in parsecs
  radius: number; // Planet radius in Earth radii
  mass: number; // Planet mass in Earth masses
  temperature: number; // Equilibrium temperature in Kelvin
  period: number; // Orbital period in days
  habitability: number; // Habitability score (0-1)
  category: 'Gas Giant' | 'Super Earth' | 'Terrestrial' | 'Neptunian';
  starType: string;
  discoveryYear: number;
  stellarRadius?: number; // Stellar radius in solar radii
  stellarMass?: number; // Stellar mass in solar masses
  stellarTemperature?: number; // Stellar effective temperature in Kelvin
  orbitalEccentricity?: number; // Orbital eccentricity
  insolationFlux?: number; // Insolation flux relative to Earth
  radiusErrorMax?: number;
  radiusErrorMin?: number;
  massErrorMax?: number;
  massErrorMin?: number;
}

// Extended exoplanet data from NASA Exoplanet Archive
export const extendedExoplanetData: ExoplanetData[] = [
  {
    id: 'kepler-442b',
    name: 'Kepler-442b',
    ra: 19.01,
    dec: 39.18,
    distance: 342,
    radius: 1.34,
    mass: 2.3,
    temperature: 233,
    period: 112.3,
    habitability: 0.84,
    category: 'Super Earth',
    starType: 'K',
    discoveryYear: 2015,
    stellarRadius: 0.6,
    stellarMass: 0.61,
    stellarTemperature: 4402,
    orbitalEccentricity: 0.04,
    insolationFlux: 0.7
  },
  {
    id: 'kepler-186f',
    name: 'Kepler-186f',
    ra: 19.54,
    dec: 43.91,
    distance: 492,
    radius: 1.17,
    mass: 1.4,
    temperature: 188,
    period: 129.9,
    habitability: 0.64,
    category: 'Terrestrial',
    starType: 'M',
    discoveryYear: 2014,
    stellarRadius: 0.47,
    stellarMass: 0.48,
    stellarTemperature: 3788,
    orbitalEccentricity: 0.04,
    insolationFlux: 0.32
  },
  {
    id: 'proxima-centauri-b',
    name: 'Proxima Centauri b',
    ra: 14.29,
    dec: -62.68,
    distance: 1.3,
    radius: 1.3,
    mass: 1.27,
    temperature: 234,
    period: 11.2,
    habitability: 0.87,
    category: 'Terrestrial',
    starType: 'M',
    discoveryYear: 2016,
    stellarRadius: 0.15,
    stellarMass: 0.12,
    stellarTemperature: 3042,
    orbitalEccentricity: 0.35,
    insolationFlux: 0.65
  },
  {
    id: 'trappist-1e',
    name: 'TRAPPIST-1e',
    ra: 23.06,
    dec: -5.04,
    distance: 12.4,
    radius: 0.92,
    mass: 0.69,
    temperature: 251,
    period: 6.1,
    habitability: 0.95,
    category: 'Terrestrial',
    starType: 'M',
    discoveryYear: 2017,
    stellarRadius: 0.12,
    stellarMass: 0.09,
    stellarTemperature: 2559,
    orbitalEccentricity: 0.01,
    insolationFlux: 0.6
  },
  {
    id: 'kepler-452b',
    name: 'Kepler-452b',
    ra: 19.44,
    dec: 44.27,
    distance: 1402,
    radius: 1.63,
    mass: 5.0,
    temperature: 265,
    period: 384.8,
    habitability: 0.83,
    category: 'Super Earth',
    starType: 'G',
    discoveryYear: 2015,
    stellarRadius: 1.11,
    stellarMass: 1.04,
    stellarTemperature: 5757,
    orbitalEccentricity: 0.0,
    insolationFlux: 1.1
  },
  {
    id: 'kepler-1649c',
    name: 'Kepler-1649c',
    ra: 19.11,
    dec: 41.88,
    distance: 300,
    radius: 1.06,
    mass: 1.2,
    temperature: 237,
    period: 19.5,
    habitability: 0.91,
    category: 'Terrestrial',
    starType: 'M',
    discoveryYear: 2020,
    stellarRadius: 0.23,
    stellarMass: 0.2,
    stellarTemperature: 3240,
    orbitalEccentricity: 0.0,
    insolationFlux: 0.75
  },
  {
    id: 'toi-715b',
    name: 'TOI-715b',
    ra: 19.25,
    dec: -79.32,
    distance: 137,
    radius: 1.55,
    mass: 3.0,
    temperature: 234,
    period: 19.3,
    habitability: 0.78,
    category: 'Super Earth',
    starType: 'M',
    discoveryYear: 2023,
    stellarRadius: 0.24,
    stellarMass: 0.25,
    stellarTemperature: 3075,
    orbitalEccentricity: 0.0,
    insolationFlux: 0.67
  },
  {
    id: 'kepler-22b',
    name: 'Kepler-22b',
    ra: 19.16,
    dec: 47.89,
    distance: 600,
    radius: 2.38,
    mass: 6.4,
    temperature: 262,
    period: 289.9,
    habitability: 0.71,
    category: 'Super Earth',
    starType: 'G',
    discoveryYear: 2011,
    stellarRadius: 0.98,
    stellarMass: 0.97,
    stellarTemperature: 5518,
    orbitalEccentricity: 0.0,
    insolationFlux: 0.53
  },
  {
    id: 'hd-40307g',
    name: 'HD 40307g',
    ra: 5.54,
    dec: -60.03,
    distance: 42.4,
    radius: 2.0,
    mass: 7.1,
    temperature: 278,
    period: 197.8,
    habitability: 0.66,
    category: 'Super Earth',
    starType: 'K',
    discoveryYear: 2012,
    stellarRadius: 0.72,
    stellarMass: 0.77,
    stellarTemperature: 4977,
    orbitalEccentricity: 0.22,
    insolationFlux: 0.62
  },
  {
    id: 'gj-667cc',
    name: 'GJ 667Cc',
    ra: 17.19,
    dec: -34.99,
    distance: 22.7,
    radius: 1.5,
    mass: 3.8,
    temperature: 277,
    period: 28.1,
    habitability: 0.85,
    category: 'Super Earth',
    starType: 'M',
    discoveryYear: 2011,
    stellarRadius: 0.42,
    stellarMass: 0.33,
    stellarTemperature: 3700,
    orbitalEccentricity: 0.0,
    insolationFlux: 0.9
  }
];

// Calculate habitability score based on multiple factors
export function calculateHabitabilityScore(planet: Partial<ExoplanetData>): number {
  let score = 0;
  let factors = 0;
  
  // Distance from habitable zone (insolation flux)
  if (planet.insolationFlux !== undefined) {
    const hzScore = Math.exp(-Math.pow((planet.insolationFlux - 1) / 0.3, 2));
    score += hzScore * 0.3;
    factors += 0.3;
  }
  
  // Planet size (prefer Earth-like sizes)
  if (planet.radius !== undefined) {
    const sizeScore = Math.exp(-Math.pow((planet.radius - 1) / 0.5, 2));
    score += sizeScore * 0.25;
    factors += 0.25;
  }
  
  // Equilibrium temperature
  if (planet.temperature !== undefined) {
    const tempScore = Math.exp(-Math.pow((planet.temperature - 288) / 50, 2));
    score += tempScore * 0.2;
    factors += 0.2;
  }
  
  // Orbital eccentricity (prefer circular orbits)
  if (planet.orbitalEccentricity !== undefined) {
    const eccScore = Math.exp(-planet.orbitalEccentricity * 10);
    score += eccScore * 0.15;
    factors += 0.15;
  }
  
  // Stellar type (prefer G and K stars)
  if (planet.starType) {
    const stellarScore = planet.starType === 'G' ? 1.0 : 
                        planet.starType === 'K' ? 0.9 : 
                        planet.starType === 'M' ? 0.7 : 0.5;
    score += stellarScore * 0.1;
    factors += 0.1;
  }
  
  return factors > 0 ? score / factors : 0;
}

// Classify exoplanet based on radius and temperature
export function classifyExoplanet(radius: number, temperature: number): ExoplanetData['category'] {
  if (radius > 10 && temperature > 1000) {
    return 'Gas Giant';
  } else if (radius >= 1.25 && radius <= 2 && temperature >= 250 && temperature <= 500) {
    return 'Super Earth';
  } else if (radius <= 1.25 && temperature >= 250 && temperature <= 350) {
    return 'Terrestrial';
  } else if (radius >= 2 && radius <= 10 && temperature < 1000) {
    return 'Neptunian';
  } else {
    return 'Super Earth'; // Default classification
  }
}

// Convert celestial coordinates to 3D position
export function celestialToCartesian(ra: number, dec: number, distance: number): [number, number, number] {
  // Convert RA and Dec to radians
  const raRad = (ra * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  
  // Scale distance for visualization (logarithmic scale)
  const scaledDistance = Math.log10(distance + 1) * 5;
  
  // Convert to Cartesian coordinates
  const x = scaledDistance * Math.cos(decRad) * Math.cos(raRad);
  const y = scaledDistance * Math.sin(decRad);
  const z = scaledDistance * Math.cos(decRad) * Math.sin(raRad);
  
  return [x, y, z];
}

// Get color based on exoplanet category
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Terrestrial': return '#4ade80'; // Green
    case 'Super Earth': return '#60a5fa'; // Blue
    case 'Gas Giant': return '#f59e0b'; // Orange
    case 'Neptunian': return '#8b5cf6'; // Purple
    default: return '#6b7280'; // Gray
  }
}

// Get color based on habitability score
export function getHabitabilityColor(score: number): string {
  if (score >= 0.8) return '#10b981'; // Green
  if (score >= 0.6) return '#f59e0b'; // Yellow
  if (score >= 0.4) return '#f97316'; // Orange
  return '#ef4444'; // Red
}

// Filter exoplanets by criteria
export function filterExoplanets(
  planets: ExoplanetData[],
  filters: {
    category?: string;
    minHabitability?: number;
    maxDistance?: number;
    starType?: string;
    discoveryYear?: number;
  }
): ExoplanetData[] {
  return planets.filter(planet => {
    if (filters.category && planet.category !== filters.category) return false;
    if (filters.minHabitability && planet.habitability < filters.minHabitability) return false;
    if (filters.maxDistance && planet.distance > filters.maxDistance) return false;
    if (filters.starType && planet.starType !== filters.starType) return false;
    if (filters.discoveryYear && planet.discoveryYear < filters.discoveryYear) return false;
    return true;
  });
}

// Sort exoplanets by various criteria
export function sortExoplanets(
  planets: ExoplanetData[],
  sortBy: 'distance' | 'habitability' | 'radius' | 'temperature' | 'discoveryYear',
  ascending: boolean = true
): ExoplanetData[] {
  return [...planets].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (ascending) {
      return aVal - bVal;
    } else {
      return bVal - aVal;
    }
  });
}

// Calculate SNR (Signal-to-Noise Ratio) for exoplanet characterization
export function calculateSNR(
  stellarRadius: number,
  planetaryRadius: number,
  telescopeDiameter: number,
  distance: number
): number {
  // Simplified SNR calculation
  const transitDepth = Math.pow(planetaryRadius / stellarRadius, 2);
  const stellarFlux = Math.pow(stellarRadius, 2) / Math.pow(distance, 2);
  const noise = 1 / Math.sqrt(telescopeDiameter);
  
  return (transitDepth * stellarFlux) / noise;
}

// Export processed data with calculated fields
export const processedExoplanetData: ExoplanetData[] = extendedExoplanetData.map(planet => ({
  ...planet,
  habitability: calculateHabitabilityScore(planet),
  category: classifyExoplanet(planet.radius, planet.temperature)
}));
