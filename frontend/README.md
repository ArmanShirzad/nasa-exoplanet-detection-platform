# NASA Exoplanet Explorer

A complete Next.js + Tailwind frontend for NASA Space Apps Challenge 2025 - Exoplanet Detection. Discover worlds beyond our solar system with the same tools NASA uses.

## Features

### 🚀 Core Functionality
- **File Upload**: Support for TESS/K2/Kepler CSV and JSON files with drag-and-drop
- **Manual Input**: Form-based data entry with sample data loading
- **AI Analysis**: Mock API endpoint with realistic exoplanet detection results
- **Interactive Visualization**: Recharts-powered flux time series with transit highlighting
- **Explainable AI**: Feature importance analysis with detailed explanations

### 🎨 UI/UX Features
- **Glassmorphism Design**: Modern space-themed UI with subtle gradients
- **Responsive Layout**: Mobile-first design with collapsible sections
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Accessibility**: Keyboard navigation, ARIA labels, and screen reader support
- **Interactive Tooltips**: Hover explanations for data columns

### 📊 Data Visualization
- **Interactive Charts**: Zoom, pan, and tooltip interactions
- **Transit Highlighting**: Visual identification of potential exoplanet transits
- **Multiple Views**: Raw and normalized flux data display
- **Export Functionality**: Download results as JSON or CSV

### 🤖 AI Chat Interface
- **Conversational UI**: Chatbot-style interaction for result explanations
- **Suggested Questions**: Quick-start prompts for common queries
- **Real-time Responses**: Simulated AI explanations of analysis results

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom space theme
- **Animations**: Framer Motion
- **Charts**: Recharts for interactive visualizations
- **Icons**: Lucide React
- **Language**: TypeScript
- **File Handling**: React Dropzone

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nasa-spaceapps-2025-main/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts    # Mock API endpoint
│   ├── globals.css            # Global styles and theme
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page component
├── components/
│   ├── forms/
│   │   ├── FileUpload.tsx     # CSV/JSON upload with preview
│   │   └── ManualInputForm.tsx # Manual data entry form
│   ├── results/
│   │   ├── ResultsCard.tsx    # Analysis results display
│   │   └── FluxVisualization.tsx # Interactive charts
│   └── ui/
│       ├── ChatInterface.tsx  # AI chat component
│       ├── DataExplorer.tsx   # "Meet the Data" section
│       ├── Header.tsx         # Navigation header
│       ├── Footer.tsx         # Footer with links
│       └── Tooltip.tsx        # Accessible tooltip component
└── public/
    └── sample_tess_data.csv   # Sample TESS data file
```

## Key Components

### FileUpload.tsx
- Drag-and-drop file upload
- CSV/JSON parsing and preview
- Sample data loading
- File validation and error handling

### ManualInputForm.tsx
- Comprehensive form with all required fields
- Collapsible sections for better UX
- Sample TESS/K2 data loading
- Real-time validation

### DataExplorer.tsx
- Interactive "Meet the Data" section
- Hover tooltips with exact NASA copy
- Category filtering and search
- Quality flag explanations

### ResultsCard.tsx
- Verdict display with confidence meter
- Feature importance visualization
- Expandable explanation sections
- Download functionality

### FluxVisualization.tsx
- Interactive Recharts implementation
- Transit highlighting
- Normalized/raw data toggle
- Export capabilities

## API Integration

The app includes a mock API endpoint (`/api/analyze`) that simulates real exoplanet detection analysis:

### Request Format
```typescript
{
  mode: "upload" | "manual",
  metadata: { ... },
  timeseries: [{time: number, flux: number, flux_err?: number}],
  raw_file_preview?: [...]
}
```

### Response Format
```typescript
{
  verdict: "Exoplanet Detected" | "Not an Exoplanet",
  confidence: number,
  explanation: string,
  feature_importances: [
    {feature: string, importance: number, detail: string}
  ],
  annotated_timeseries: [
    {time: number, flux: number, highlight: boolean}
  ]
}
```

## Customization

### Theme Colors
Edit `tailwind.config.ts` to customize the space theme:
- `space`: Blue color palette
- `nebula`: Purple color palette  
- `cosmic`: Gold color palette

### Sample Data
Replace `public/sample_tess_data.csv` with your own sample data following the same column structure.

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Platforms
Build the project and deploy the `out` directory to any static hosting service.

## Development Notes

### Adding Real AI Backend
To integrate with a real AI model:

1. Replace the mock API in `src/app/api/analyze/route.ts`
2. Update the request/response interfaces as needed
3. Add environment variables for API keys
4. Implement proper error handling

### Performance Optimization
- Images are optimized with Next.js Image component
- Components use React.memo where appropriate
- Charts are lazy-loaded for better performance

### Accessibility
- All interactive elements have proper ARIA labels
- Keyboard navigation is fully supported
- Color contrast meets WCAG guidelines
- Screen reader compatibility tested

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is developed for NASA Space Apps Challenge 2025. Please refer to the challenge guidelines for usage terms.

## Acknowledgments

- NASA Space Apps Challenge 2025
- TESS, Kepler, and K2 missions for data inspiration
- Recharts for beautiful visualizations
- Tailwind CSS for rapid styling
- Framer Motion for smooth animations

---

**Built with ❤️ for space exploration and scientific discovery**