'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Globe, 
  Star, 
  Activity,
  ArrowRight
} from 'lucide-react';
import TabularMVPForm, { TabularFeaturesInput } from '@/components/forms/TabularMVPForm';
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

type InputMode = 'manual';
type AppState = 'landing' | 'analyzing' | 'results';

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>('manual');
  const [appState, setAppState] = useState<AppState>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);
  
  // Chat session management
  const [sessionId, setSessionId] = useState<string>('');
  const [messageCount, setMessageCount] = useState(0);
  const [chatLimitReached, setChatLimitReached] = useState(false);
  const [lastSubmittedFeatures, setLastSubmittedFeatures] = useState<TabularFeaturesInput | null>(null);

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  const handleManualSubmit = (data: unknown) => {
    console.log('Manual data submitted:', data);
    startAnalysis(data);
  };

  const submitTabularMVP = async (features: TabularFeaturesInput) => {
    setIsAnalyzing(true);
    setAppState('analyzing');
    setLastSubmittedFeatures(features); // Store features for chat context
    try {
      const resp = await fetch('/api/tabular/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: {
          period_days: Number(features.period_days),
          transit_depth_ppm: Number(features.transit_depth_ppm),
          planet_radius_re: Number(features.planet_radius_re),
          stellar_radius_rs: Number(features.stellar_radius_rs),
          snr: Number(features.snr),
        }, mission: 'KEPLER', object_id: 'UI-MVP' }),
      });
      const data = await resp.json();
      // Map backend TabularResponse -> AnalysisResult UI shape
      const result = {
        verdict: data.label === 'CONFIRMED' ? 'Exoplanet Detected' : 'Not an Exoplanet',
        confidence: Math.round((data.calibrated_confidence ?? data.probabilities?.CONFIRMED ?? 0) * 100),
        explanation: typeof data.explanations?.text === 'string' ? data.explanations.text : 'Baseline RF prediction.',
        feature_importances: (Array.isArray(data.explanations?.top_shap) ? data.explanations.top_shap : []).map((s: any) => ({
          feature: String(s.feature),
          importance: Math.abs(Number(s.shap) || 0),
          detail: `value=${s.value}`
        })),
      } as AnalysisResult;
      setAnalysisResult(result);
      setAppState('results');
    } catch (e) {
      console.error(e);
      setAppState('landing');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startAnalysis = async (data: unknown) => {
    setIsAnalyzing(true);
    setAppState('analyzing');
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'I submitted manual data for analysis',
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

  const handleChatMessage = async (message: string) => {
    // Check if limit reached
    if (messageCount >= 3 || chatLimitReached) {
      const limitMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: "You've reached the 3-message limit for this session. Please contact us for enterprise services for more AI answers.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Add typing indicator
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Prepare context for chat API
      if (!analysisResult || !lastSubmittedFeatures) {
        throw new Error('No analysis result available');
      }

      const context = {
        verdict: analysisResult.verdict,
        confidence: analysisResult.confidence,
        features: analysisResult.feature_importances,
        explanation: analysisResult.explanation,
        input_values: lastSubmittedFeatures
      };

      const response = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: message,
          context: context
        }),
      });

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      
      // Update message count and limit status
      setMessageCount(prev => prev + 1);
      setChatLimitReached(data.limit_reached);

      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: 'Unable to reach AI assistant. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleNavigateToSection = (section: string) => {
    // First go to landing page if not already there
    if (appState !== 'landing') {
      setAppState('landing');
      // Wait for the landing page to render, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on landing page, just scroll to section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavigateHome = () => {
    // Go to landing page and scroll to top
    setAppState('landing');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const resetApp = () => {
    setAppState('landing');
    setAnalysisResult(null);
    setMessages([]);
    setIsAnalyzing(false);
    // Reset chat state
    setMessageCount(0);
    setChatLimitReached(false);
    setLastSubmittedFeatures(null);
    // Generate new session ID
    setSessionId(crypto.randomUUID());
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
      <Header 
        onOpen3DViewer={() => setShow3DViewer(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateToSection={handleNavigateToSection}
      />

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

                {/* Manual Input Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <div className="glass rounded-2xl p-8">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {/* MVP: Simple five-field tabular input only */}
                      <div className="mb-6">
                        <TabularMVPForm onSubmit={submitTabularMVP} />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <div className="flex justify-center">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
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
                      <p className="mb-4">We are the Aramana Team, a diverse group of scientists, engineers, and dreamers brought together by curiosity and code. Based at BTU Cottbus-Senftenberg in Germany, we believe in open source, collaborative exploration, and pushing the boundaries of what AI can do for space science.</p>
                      <p className="mb-4">
                        Learn more about us at: <a href="https://teamarmana-nasaspaceapp2025.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">teamarmana-nasaspaceapp2025.vercel.app</a>
                      </p>
                      <p>If you love turning data into discovery, come join us on this cosmic journey.</p>
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
                      <p>Aramana Team aims to harness the power of AI/ML to sift through NASA’s publicly available exoplanet datasets and automatically detect exoplanets at scale. We train on data from missions like Kepler, TESS, and K2, and large set of open source light  curve data of  Nasa automating what is today a largely manual process spotting those subtle transit dips and helping humanity find its next Earth.</p>
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
                    remainingMessages={3 - messageCount}
                    limitReached={chatLimitReached}
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
