# NASA Exoplanet Explorer

A futuristic, space-themed Next.js application for exoplanet detection using AI analysis. Built with modern web technologies and a stunning glassmorphism UI design.

## 🚀 Features

### Landing Page
- **Hero Section**: Space-themed background with animated elements
- **Dual Input Options**: 
  - File Upload (CSV/JSON) with drag-and-drop functionality
  - Manual Parameter Entry with expandable sections
- **Interactive UI**: Smooth animations and transitions

### Analysis Engine
- **AI-Powered Detection**: Mock API that simulates exoplanet analysis
- **Real-time Processing**: Loading states and progress indicators
- **Confidence Scoring**: Statistical significance and reliability metrics

### Results Display
- **Verdict Cards**: Clear exoplanet detection results with confidence levels
- **Detailed Analysis**: Expandable sections with key factors and recommendations
- **Data Visualization**: Interactive flux time series charts using Recharts
- **Chatbot Interface**: Conversational AI for result explanations

### Design System
- **Space Theme**: Deep space gradients and cosmic color palette
- **Glassmorphism**: Modern glass-like UI elements with backdrop blur
- **Animations**: Framer Motion for smooth, engaging interactions
- **Responsive**: Mobile-first design that works on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom space-themed configuration
- **Animations**: Framer Motion
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Language**: TypeScript
- **Fonts**: Inter (Google Fonts)

## 🎨 Design Features

### Color Palette
- **Space Blue**: Primary brand color (#0ea5e9)
- **Nebula Purple**: Secondary accent (#a855f7)
- **Cosmic Gold**: Highlight color (#facc15)
- **Deep Space**: Background gradients

### UI Components
- **Glass Cards**: Semi-transparent with backdrop blur
- **Gradient Buttons**: Multi-color gradients with hover effects
- **Animated Backgrounds**: Rotating cosmic elements
- **Custom Scrollbars**: Themed scrollbar styling

## 📁 Project Structure

```
src/
├── app/
│   ├── api/analyze/          # Mock API endpoint
│   ├── globals.css           # Global styles and space theme
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Main application page
├── components/
│   ├── forms/
│   │   ├── FileUpload.tsx    # Drag-and-drop file upload
│   │   └── ManualInputForm.tsx # Manual parameter entry
│   ├── results/
│   │   ├── ResultsCard.tsx   # Analysis results display
│   │   └── FluxVisualization.tsx # Data visualization modal
│   └── ui/
│       └── ChatInterface.tsx # Conversational AI interface
└── tailwind.config.ts        # Custom Tailwind configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎯 Usage

### File Upload Mode
1. Click "Upload Data" tab
2. Drag and drop a CSV or JSON file
3. Click "Analyze with AI"
4. View results in the chatbot interface

### Manual Input Mode
1. Click "Enter Manually" tab
2. Fill in the expandable sections:
   - **Basic Parameters**: Planet radius, orbital period
   - **Stellar Parameters**: Mass, radius, temperature
   - **Advanced Parameters**: Flux time series data
3. Click "Analyze with AI"
4. Explore detailed results and visualizations

### Results Interaction
- **Verdict Card**: Shows detection result with confidence
- **Expandable Sections**: Detailed analysis, key factors, recommendations
- **Chat Interface**: Ask questions about the analysis
- **Data Visualization**: Interactive flux time series charts

## 🔧 Customization

### Adding New Analysis Parameters
1. Update the `ManualInputForm` component
2. Modify the API route in `src/app/api/analyze/route.ts`
3. Update TypeScript interfaces

### Styling Modifications
1. Edit `tailwind.config.ts` for color palette changes
2. Modify `globals.css` for global styles
3. Update component-specific Tailwind classes

### API Integration
Replace the mock API in `src/app/api/analyze/route.ts` with your actual exoplanet detection service.

## 🌟 Key Features Implemented

✅ **Landing Page** with space-themed hero section  
✅ **Dual Input Modes** (file upload + manual entry)  
✅ **Drag-and-Drop File Upload** with validation  
✅ **Expandable Manual Form** with organized sections  
✅ **Chatbot-Style Results** with conversational AI  
✅ **Interactive Data Visualization** with Recharts  
✅ **Glassmorphism Design** with space aesthetics  
✅ **Smooth Animations** using Framer Motion  
✅ **Responsive Design** for all screen sizes  
✅ **Mock API Integration** with realistic responses  
✅ **TypeScript Support** for type safety  
✅ **Production-Ready** code structure  

## 🎨 Design Philosophy

The application embraces a **futuristic space aesthetic** with:
- Deep space color gradients
- Glassmorphism UI elements
- Smooth, purposeful animations
- Clean, minimal interface design
- Intuitive user interactions

Every element is designed to evoke the wonder of space exploration while maintaining excellent usability and accessibility.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the NASA Space Apps Challenge 2025.

---

**Built with ❤️ for space exploration and exoplanet discovery**