# 🌌 NASA Exoplanet Detection Platform

> **Discover worlds beyond our solar system with the same tools NASA uses**

A comprehensive full-stack platform for exoplanet detection and analysis, featuring real machine learning models trained on NASA Kepler, K2, and TESS mission data. Built for NASA Space Apps Challenge 2025.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://your-vercel-url.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-green?style=for-the-badge)](https://nasa-exoplanet-2025.onrender.com)
[![License](https://img.shields.io/badge/License-NASA%20Space%20Apps-orange?style=for-the-badge)](LICENSE)

## 🚀 Features

### 🤖 **Real Machine Learning**
- **Trained Models**: Random Forest classifier trained on 15,000+ NASA exoplanet candidates
- **High Accuracy**: 88.1% ROC-AUC, 83.9% accuracy on test data
- **Real Data**: Uses actual Kepler, K2, and TESS mission datasets
- **Feature Engineering**: Proper preprocessing with imputation and scaling
- **Calibrated Confidence**: Realistic probability distributions, no artificial patterns

### 🔬 **Exoplanet Analysis**
- **Tabular Analysis**: Input orbital parameters for instant classification
- **Light Curve Analysis**: Upload time-series data for transit detection
- **Multi-Mission Support**: Kepler, K2, and TESS data formats
- **Explainable AI**: Feature importance analysis with detailed explanations
- **Confidence Scoring**: Well-calibrated confidence intervals

### 💬 **AI-Powered Chat Assistant**
- **Secure Chatbot**: Comprehensive security guardrails prevent information leakage
- **Context-Aware**: Explains analysis results using actual model predictions
- **Session Management**: 3-message limit with enterprise upgrade path
- **Educational Focus**: Helps users understand exoplanet detection science

### 🎨 **Modern User Interface**
- **Glassmorphism Design**: Space-themed UI with subtle gradients
- **Responsive Layout**: Mobile-first design with smooth animations
- **Interactive Visualizations**: 3D exoplanet viewer and interactive charts
- **Performance Optimized**: React.memo, useCallback, and other optimizations
- **Accessibility**: Full keyboard navigation and screen reader support

### 📊 **Data Visualization**
- **3D Exoplanet Viewer**: Interactive 3D visualization of exoplanet systems
- **Interactive Charts**: Recharts-powered flux time series with transit highlighting
- **Real-Time Analysis**: Live updates as you input data
- **Export Functionality**: Download results as JSON or CSV

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   ML Pipeline   │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (Python)      │
│                 │    │                 │    │                 │
│ • React UI      │    │ • REST APIs     │    │ • Data Prep     │
│ • TypeScript    │    │ • ML Models      │    │ • Training      │
│ • Tailwind CSS  │    │ • Chat Security │    │ • Validation    │
│ • Framer Motion │    │ • Groq AI       │    │ • Artifacts     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom space theme
- **Animations**: Framer Motion
- **Charts**: Recharts for data visualization
- **3D Graphics**: Three.js with React Three Fiber
- **Icons**: Lucide React

### **Backend**
- **Framework**: FastAPI with Python 3.11
- **ML Libraries**: scikit-learn, pandas, numpy
- **AI Integration**: Groq API for chatbot functionality
- **Data Processing**: joblib for model serialization
- **API Documentation**: Auto-generated OpenAPI/Swagger

### **Machine Learning**
- **Algorithm**: Random Forest Classifier
- **Data Sources**: NASA Kepler, K2, TESS missions
- **Features**: 5 core exoplanet characteristics
- **Preprocessing**: Imputation, scaling, outlier clipping
- **Validation**: Stratified train/validation/test splits

## 📁 Project Structure

```
nasa-exoplanet-2025/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages and API routes
│   │   ├── components/      # React components
│   │   │   ├── forms/       # Input forms and file upload
│   │   │   ├── results/     # Analysis results display
│   │   │   ├── ui/          # UI components and chat
│   │   │   └── visualization/ # 3D exoplanet viewer
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets and sample data
├── backend/                 # FastAPI backend application
│   ├── src/app/
│   │   ├── main.py          # FastAPI app configuration
│   │   └── routers/         # API route handlers
│   │       ├── tabular.py   # ML prediction endpoints
│   │       ├── lightcurve.py # Light curve analysis
│   │       └── chat.py      # AI chatbot with security
│   └── requirements.txt     # Python dependencies
├── ML/                      # Machine learning pipeline
│   ├── Data Pipeline/       # Data preprocessing and EDA
│   │   ├── data/           # Raw and processed datasets
│   │   ├── artifacts/      # Trained models and scalers
│   │   └── reports/        # Analysis reports and visualizations
│   └── training/           # Model training scripts
├── vercel.json             # Vercel deployment configuration
├── render.yaml             # Render deployment configuration
└── README.md               # This file
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.11+
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/nasa-exoplanet-2025.git
cd nasa-exoplanet-2025
```

### **2. Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000
```

### **3. Frontend Setup**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### **4. Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Configuration

### **Environment Variables**

**Backend (.env)**
```bash
GROQ_API_KEY=your_groq_api_key_here
PYTHON_VERSION=3.11.0
```

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### **ML Model Configuration**

The ML pipeline uses these core features:
- `period_days`: Orbital period in days
- `transit_depth_ppm`: Transit depth in parts per million
- `planet_radius_re`: Planet radius in Earth radii
- `stellar_radius_rs`: Stellar radius in solar radii
- `snr`: Signal-to-noise ratio

## 📊 API Endpoints

### **Tabular Analysis**
```http
POST /v1/tabular/predict
Content-Type: application/json

{
  "mission": "KEPLER",
  "object_id": "test_001",
  "features": {
    "period_days": 5.0,
    "transit_depth_ppm": 600.0,
    "planet_radius_re": 2.0,
    "stellar_radius_rs": 1.0,
    "snr": 50.0
  }
}
```

### **Chat Assistant**
```http
POST /v1/chat/ask
Content-Type: application/json

{
  "session_id": "unique_session_id",
  "message": "What does the transit depth tell us?",
  "context": {
    "verdict": "Exoplanet Detected",
    "confidence": 88,
    "features": [...],
    "explanation": "...",
    "input_values": {...}
  }
}
```

### **Light Curve Analysis**
```http
POST /v1/lightcurve/analyze
Content-Type: application/json

{
  "mission": "TESS",
  "object_id": "TIC_123456789",
  "timeseries": [
    {"time": 0.0, "flux": 1.0, "flux_err": 0.01},
    {"time": 0.1, "flux": 0.99, "flux_err": 0.01}
  ]
}
```

## 🧪 Testing

### **Backend Testing**
```bash
# Test ML prediction
curl -X POST "http://localhost:8000/v1/tabular/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "mission": "KEPLER",
    "object_id": "test",
    "features": {
      "period_days": 5.0,
      "transit_depth_ppm": 600.0,
      "planet_radius_re": 2.0,
      "stellar_radius_rs": 1.0,
      "snr": 50.0
    }
  }'

# Test chatbot security
curl -X POST "http://localhost:8000/v1/chat/ask" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test",
    "message": "What model are you using?",
    "context": {
      "verdict": "Not an Exoplanet",
      "confidence": 66,
      "features": [],
      "explanation": "test",
      "input_values": {}
    }
  }'
```

### **Frontend Testing**
```bash
# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### **Render (Backend)**
1. Connect GitHub repository to Render
2. Configure service:
   - **Name**: `armana-backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn src.app.main:app --host 0.0.0.0 --port $PORT`
3. Set environment variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `PYTHON_VERSION`: 3.11.0

### **Vercel (Frontend)**
1. Connect GitHub repository to Vercel
2. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
3. Set environment variables:
   - `NEXT_PUBLIC_BACKEND_URL`: Your Render backend URL

### **Manual Deployment**
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn src.app.main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm run build
npm start
```

## 🔒 Security Features

### **Chatbot Security**
- **Input Validation**: Blocks probing questions about system internals
- **Response Filtering**: Prevents exposure of sensitive information
- **Session Limits**: 3-message limit per session
- **Content Filtering**: Blocks technical terms and implementation details

### **API Security**
- **Input Sanitization**: Validates all input parameters
- **Rate Limiting**: Built-in session management
- **Error Handling**: Secure error messages without information leakage

## 📈 Performance

### **Model Performance**
- **ROC-AUC**: 0.8810 (excellent discrimination)
- **Accuracy**: 83.9% on test set
- **Precision**: 68.8% for confirmed exoplanets
- **Recall**: 60.9% for confirmed exoplanets

### **Frontend Performance**
- **React Optimizations**: Memoized components and callbacks
- **Bundle Size**: Optimized with Next.js
- **Loading**: Lazy loading for 3D components
- **Animations**: Smooth 60fps with Framer Motion

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the coding standards
4. **Test thoroughly**: Ensure all tests pass
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes clearly

### **Development Guidelines**
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## 📚 Documentation

- **[Frontend README](frontend/README.md)**: Detailed frontend documentation
- **[ML Pipeline README](ML/Data%20Pipeline/README.md)**: Machine learning documentation
- **[3D Visualization README](frontend/src/components/visualization/README.md)**: 3D viewer documentation
- **[Deployment Guide](README_DEPLOYMENT.md)**: Step-by-step deployment instructions

## 🎯 Roadmap

### **Phase 1: Core Features** ✅
- [x] ML model training and deployment
- [x] Basic web interface
- [x] API endpoints
- [x] Security implementation

### **Phase 2: Enhanced Features** ✅
- [x] AI chatbot integration
- [x] 3D visualization
- [x] Performance optimizations
- [x] Security hardening

### **Phase 3: Future Enhancements** 🔄
- [ ] Real-time light curve analysis
- [ ] Advanced ML models (neural networks)
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced visualization features

## 🐛 Known Issues

- **Data Units**: Some Kepler data may require unit conversion
- **Model Calibration**: Continuous monitoring needed for drift
- **Chatbot Limits**: 3-message limit may be restrictive for some users

## 📄 License

This project is developed for **NASA Space Apps Challenge 2025**. Please refer to the challenge guidelines for usage terms and licensing.

## 🙏 Acknowledgments

- **NASA Space Apps Challenge 2025** for the inspiration
- **NASA Exoplanet Archive** for providing the training data
- **Kepler, K2, and TESS missions** for the incredible datasets
- **Groq** for AI chatbot capabilities
- **Render** and **Vercel** for hosting infrastructure
- **Open source community** for the amazing tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/nasa-exoplanet-2025/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/nasa-exoplanet-2025/discussions)
- **Email**: armanshirzad1998@gmail.com

---

**Built with ❤️ for space exploration and scientific discovery**

*"The universe is not only stranger than we imagine, it is stranger than we can imagine."* - J.B.S. Haldane
