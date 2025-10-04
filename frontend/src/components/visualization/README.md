# 3D Exoplanet Visualization

This directory contains 3D visualization components for exploring exoplanets in space, inspired by the NASA Space Apps Challenge 2024 winning project "HWO Exoplanet Characterization Platform - Speculo".

## Components

### Exoplanet3DViewer.tsx
A full-featured 3D exoplanet visualization component with:
- Interactive 3D scene with orbit controls
- Real exoplanet data from NASA Exoplanet Archive
- Habitability scoring and classification
- Planet selection and detailed information panels
- Auto-rotation and manual controls
- Responsive design with mobile support

### Simple3DViewer.tsx
A lightweight 3D viewer for embedding in other components:
- Simplified interface for quick integration
- Basic planet visualization with hover effects
- Compact information display
- Perfect for dashboard or preview use

## Features

### 3D Visualization
- **Celestial Coordinates**: Converts RA/Dec coordinates to 3D positions
- **Distance Scaling**: Logarithmic scaling for better visualization
- **Planet Classification**: Color-coded by planet type (Terrestrial, Super Earth, Gas Giant, Neptunian)
- **Habitability Indicators**: Visual rings showing habitability scores
- **Interactive Controls**: Zoom, pan, rotate, and auto-rotation

### Data Processing
- **Habitability Scoring**: Multi-factor calculation based on:
  - Distance from habitable zone (insolation flux)
  - Planet size (Earth-like preference)
  - Equilibrium temperature
  - Orbital eccentricity
  - Stellar type
- **Planet Classification**: Automatic categorization based on radius and temperature
- **SNR Calculation**: Signal-to-noise ratio for characterization potential

### User Interface
- **Planet Selection**: Click to select and view detailed information
- **Information Panels**: Detailed planet properties and habitability metrics
- **Legend**: Color-coded planet categories
- **Controls**: Auto-rotation toggle, info display, view reset

## Data Sources

The visualization uses real exoplanet data including:
- **Kepler-442b**: Super Earth with high habitability potential
- **Kepler-186f**: First Earth-size planet in habitable zone
- **Proxima Centauri b**: Closest known exoplanet
- **TRAPPIST-1e**: Highly habitable terrestrial planet
- **Kepler-452b**: "Earth's cousin" in habitable zone

## Technical Implementation

### Technologies Used
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers and abstractions
- **Three.js**: 3D graphics library
- **Framer Motion**: Smooth animations and transitions
- **TypeScript**: Type-safe development

### Key Functions
- `celestialToCartesian()`: Converts astronomical coordinates to 3D positions
- `calculateHabitabilityScore()`: Multi-factor habitability assessment
- `classifyExoplanet()`: Automatic planet type classification
- `getCategoryColor()`: Color mapping for planet types

## Integration

### In DataExplorer Component
The Simple3DViewer is integrated into the DataExplorer section to provide an interactive preview of exoplanet data.

### In Main Page
The full Exoplanet3DViewer can be opened as a modal from the main page's "Explore 3D Universe" button.

### Customization
Both components accept props for:
- `onPlanetSelect`: Callback when a planet is selected
- `className`: Custom styling
- `onClose`: Modal close handler (for full viewer)

## Future Enhancements

- **Real-time Data**: Integration with NASA Exoplanet Archive API
- **More Planets**: Expand dataset to include all confirmed exoplanets
- **Advanced Filtering**: Filter by habitability, distance, discovery year
- **Orbital Mechanics**: Show planet orbits and orbital periods
- **Stellar Systems**: Visualize multi-planet systems
- **VR Support**: Virtual reality exploration mode

## Performance Considerations

- **LOD (Level of Detail)**: Simplified geometry for distant planets
- **Instanced Rendering**: Efficient rendering of many similar objects
- **Frustum Culling**: Only render visible objects
- **Memory Management**: Proper cleanup of Three.js resources

## Browser Support

- **WebGL**: Required for 3D rendering
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: Responsive design with touch controls
- **Fallback**: Graceful degradation for unsupported browsers

## References

- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)
- [HWO Exoplanet Characterization Platform](https://github.com/KlausMikhaelson/asteroid-destroyers-nasa-app-challenge)
