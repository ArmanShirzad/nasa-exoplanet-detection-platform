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
  ChevronRight,
  ArrowRight
} from 'lucide-react';

import FileUpload from '@/components/forms/FileUpload';
import ManualInputForm from '@/components/forms/ManualInputForm';
import ChatInterface from '@/components/ui/ChatInterface';
import ResultsCard from '@/components/results/ResultsCard';
import FluxVisualization from '@/components/results/FluxVisualization';

interface AnalysisResult {
  verdict: 'Exoplanet Detected' | 'Not an Exoplanet';
  confidence: number;
  explanation: string;
  details?: {
    keyFactors: string[];
    statisticalSignificance: number;
    alternativeHypotheses: string[];
    recommendations: string[];
  };
  fluxData?: number[];
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

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // Here you would typically process the file
  };

  const handleManualSubmit = (data: any) => {
    console.log('Manual data submitted:', data);
    startAnalysis(data);
  };

  const startAnalysis = async (data: any) => {
    setIsAnalyzing(true);
    setAppState('analyzing');
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMode === 'upload' 
        ? 'I uploaded a data file for analysis'
        : `I submitted manual data: Planet Radius: ${data.planetRadius}, Orbital Period: ${data.orbitalPeriod}`,
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

      <div className="relative z-10">
        {appState === 'landing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col"
          >
            {/* Header */}
            <header className="p-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-space-500 to-nebula-500 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-white">NASA Exoplanet Explorer</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4" />
                  <span>Powered by AI</span>
                </div>
              </motion.div>
            </header>

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
                    Discover exoplanets using advanced AI analysis. Upload your astronomical data 
                    or enter parameters manually to detect potential planetary companions.
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

                {/* CTA Button */}
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
              </div>
            </main>
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
                    onVisualizeData={(data) => setShowVisualization(true)}
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
        {showVisualization && analysisResult?.fluxData && (
          <FluxVisualization
            data={analysisResult.fluxData}
            onClose={() => setShowVisualization(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
