'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Globe, 
  Star, 
  Activity,
  ArrowRight
} from 'lucide-react';

import FileUpload from '@/components/forms/FileUpload';
import ManualInputForm from '@/components/forms/ManualInputForm';
import ChatInterface from '@/components/ui/ChatInterface';
import ResultsCard from '@/components/results/ResultsCard';
import FluxVisualization from '@/components/results/FluxVisualization';
import DataExplorer from '@/components/ui/DataExplorer';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Exoplanet3DViewer from '@/components/visualization/Exoplanet3DViewer';

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

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

type InputMode = 'upload' | 'manual';
type AppState = 'landing' | 'analyzing' | 'results';

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [appState, setAppState] = useState<AppState>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // Here you would typically process the file
  };

  const handleManualSubmit = (data: unknown) => {
    console.log('Manual data submitted:', data);
    startAnalysis(data);
  };

  const startAnalysis = async (data: unknown) => {
    setIsAnalyzing(true);
    setAppState('analyzing');
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMode === 'upload' 
        ? 'I uploaded a data file for analysis'
        : 'I submitted manual data for analysis',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Call the API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      setAppState('results');
      setIsAnalyzing(false);

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Analysis complete! ${result.verdict} with ${result.confidence}% confidence. ${result.explanation}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      setAppState('landing');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, there was an error analyzing your data. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleChatMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'd be happy to help explain the analysis results. The detection algorithm uses advanced machine learning techniques to identify exoplanet signatures in the flux data. Would you like me to elaborate on any specific aspect?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const resetApp = () => {
    setAppState('landing');
    setAnalysisResult(null);
    setMessages([]);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-space-400/20 to-nebula-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1.1, 1, 1.1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-cosmic-400/20 to-pink-400/20 rounded-full blur-xl"
        />
      </div>

      {/* Header */}
      <Header onOpen3DViewer={() => setShow3DViewer(true)} />

      <div className="relative z-10 pt-16">
        {appState === 'landing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col"
          >

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-6">
              <div className="max-w-4xl w-full text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    <span className="text-gradient">NASA</span>
                    <br />
                    <span className="text-white">Exoplanet</span>
                    <br />
                    <span className="text-gradient-cosmic">Explorer</span>
                  </h1>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Discover worlds beyond our solar system with the same tools NASA uses.
                  </p>
                </motion.div>

                {/* Input Mode Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <button
                      onClick={() => setInputMode('upload')}
                      className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                        inputMode === 'upload'
                          ? 'bg-gradient-to-r from-space-500 to-nebula-500 text-white shadow-lg'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <Upload className="w-5 h-5" />
                      Upload Data
                    </button>
                    <button
                      onClick={() => setInputMode('manual')}
                      className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                        inputMode === 'manual'
                          ? 'bg-gradient-to-r from-space-500 to-nebula-500 text-white shadow-lg'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      Enter Manually
                    </button>
                  </div>

                  <div className="glass rounded-2xl p-8">
                    <AnimatePresence mode="wait">
                      {inputMode === 'upload' ? (
                        <motion.div
                          key="upload"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <FileUpload onFileSelect={handleFileUpload} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="manual"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <ManualInputForm onSubmit={handleManualSubmit} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startAnalysis({})}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cosmic-500 to-pink-500 
                             text-white font-semibold text-lg rounded-xl shadow-lg
                             hover:from-cosmic-600 hover:to-pink-600
                             focus:ring-4 focus:ring-cosmic-400/20
                             transition-all duration-200"
                  >
                    <Sparkles className="w-6 h-6" />
                    Analyze with AI
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShow3DViewer(true)}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-space-500 to-nebula-500 
                             text-white font-semibold text-lg rounded-xl shadow-lg
                             hover:from-space-600 hover:to-nebula-600
                             focus:ring-4 focus:ring-space-400/20
                             transition-all duration-200"
                  >
                    <Globe className="w-6 h-6" />
                    Explore 3D Universe
                  </motion.button>
                </div>
              </div>
            </main>

            {/* Meet the Data Section */}
            <section id="data">
              <DataExplorer />
            </section>

            {/* About Team and Challenge Section */}
            <section id="about" className="py-16 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* About Team */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-2xl p-8"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-space-500 to-nebula-500 flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      About the Team
                    </h3>
                    <blockquote className="text-gray-300 leading-relaxed italic">
                      &ldquo;I&apos;m a passionate geek at heart—my friends call me a nerd :D. Technology and AI are unlocking a brighter future for science. If solving cosmic mysteries resonates with you, join me and let&apos;s build that future together!&rdquo;
                    </blockquote>
                  </motion.div>

                  {/* About Challenge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-8"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-500 to-pink-500 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      About the Challenge
                    </h3>
                    <blockquote className="text-gray-300 leading-relaxed italic">
                      &ldquo;NASA&apos;s Astrophysics Division seeks automated AI/ML models to sift through space-based light curves and find exoplanets at scale. Train on open-source Kepler, TESS, and K2 datasets to spot those tiny transit dips—and help humanity discover its next Earth!&rdquo;
                    </blockquote>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <Footer />
          </motion.div>
        )}

        {appState === 'analyzing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto mb-8"
              >
                <Activity className="w-full h-full text-space-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Data</h2>
              <p className="text-gray-300 mb-8">Our AI is processing your astronomical data...</p>
              <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-space-400 to-nebula-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {appState === 'results' && analysisResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen p-6"
          >
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Analysis Results</h2>
                  <p className="text-gray-400">Exoplanet detection analysis complete</p>
                </div>
                <button
                  onClick={resetApp}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  New Analysis
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Results */}
                <div>
                  <ResultsCard 
                    result={analysisResult}
                    onVisualizeData={() => setShowVisualization(true)}
                  />
                </div>

                {/* Chat Interface */}
                <div>
                  <ChatInterface
                    onSendMessage={handleChatMessage}
                    messages={messages}
                    isLoading={isAnalyzing}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Visualization Modal */}
      <AnimatePresence>
        {showVisualization && analysisResult?.annotated_timeseries && (
          <FluxVisualization
            data={analysisResult.annotated_timeseries.map(p => p.flux)}
            highlightedPoints={analysisResult.annotated_timeseries
              .map((p, i) => p.highlight ? i : -1)
              .filter(i => i !== -1)}
            onClose={() => setShowVisualization(false)}
          />
        )}
      </AnimatePresence>

      {/* 3D Exoplanet Viewer Modal */}
      <AnimatePresence>
        {show3DViewer && (
          <Exoplanet3DViewer
            onClose={() => setShow3DViewer(false)}
            onPlanetSelect={(planet) => {
              console.log('Selected planet:', planet);
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating 3D Map Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShow3DViewer(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-space-500 to-nebula-500 text-white shadow-2xl hover:from-space-600 hover:to-nebula-600 transition-all duration-300 group"
        title="Open 3D Exoplanet Map"
      >
        <Globe className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">3D</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Explore 3D Universe
        </div>
      </motion.button>
    </div>
  );
}
