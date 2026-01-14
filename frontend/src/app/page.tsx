'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Globe,
  Activity
} from 'lucide-react';
import TabularMVPForm, { TabularFeaturesInput } from '@/components/forms/TabularMVPForm';
import ChatInterface from '@/components/ui/ChatInterface';
import ResultsCard from '@/components/results/ResultsCard';
import FluxVisualization from '@/components/results/FluxVisualization';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Exoplanet3DViewer from '@/components/visualization/Exoplanet3DViewer';
import ExoplanetExplorer from '@/components/explorer/ExoplanetExplorer';
import AboutModal from '@/components/ui/AboutModal';
import { processedExoplanetData, ExoplanetData } from '@/utils/exoplanetData';

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
  const [appState, setAppState] = useState<AppState>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<ExoplanetData | null>(null);
  const [activeTab, setActiveTab] = useState<'explore' | 'analyze'>('explore');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Chat session management
  const [sessionId, setSessionId] = useState<string>('');
  const [messageCount, setMessageCount] = useState(0);
  const [chatLimitReached, setChatLimitReached] = useState(false);
  const [lastSubmittedFeatures, setLastSubmittedFeatures] = useState<TabularFeaturesInput | null>(null);

  // Create a wrapper component for search params logic to avoid hydration issues
  function URLStateHandler({
    onOpen3D,
    onSelectPlanet,
    onSetTab
  }: {
    onOpen3D: () => void;
    onSelectPlanet: (planet: ExoplanetData) => void;
    onSetTab: (tab: 'explore' | 'analyze') => void;
  }) {
    const searchParams = useSearchParams();

    useEffect(() => {
      const view = searchParams.get('view');
      const planetId = searchParams.get('planet');
      const mode = searchParams.get('mode');

      if (view === '3d') {
        onOpen3D();
      }

      if (planetId) {
        const planet = processedExoplanetData.find(p => p.id === planetId);
        if (planet) {
          onSelectPlanet(planet);
        }
      }

      if (mode === 'analyze') {
        onSetTab('analyze');
      } else {
        onSetTab('explore');
      }
    }, [searchParams, onOpen3D, onSelectPlanet, onSetTab]);

    return null;
  }

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  const submitTabularMVP = async (features: TabularFeaturesInput) => {
    setIsAnalyzing(true);
    setAppState('analyzing');
    setLastSubmittedFeatures(features); // Store features for chat context
    try {
      const resp = await fetch('/api/tabular/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: {
            period_days: Number(features.period_days),
            transit_depth_ppm: Number(features.transit_depth_ppm),
            planet_radius_re: Number(features.planet_radius_re),
            stellar_radius_rs: Number(features.stellar_radius_rs),
            snr: Number(features.snr),
          }, mission: 'KEPLER', object_id: 'UI-MVP'
        }),
      });
      const data = await resp.json();
      // Map backend TabularResponse -> AnalysisResult UI shape
      const result = {
        verdict: data.label === 'CONFIRMED' ? 'Exoplanet Detected' : 'Not an Exoplanet',
        confidence: Math.round((data.calibrated_confidence ?? data.probabilities?.CONFIRMED ?? 0) * 100),
        explanation: typeof data.explanations?.text === 'string' ? data.explanations.text : 'Baseline RF prediction.',
        feature_importances: (Array.isArray(data.explanations?.top_shap) ? data.explanations.top_shap : []).map((s: { feature: string | number; shap: unknown; value: unknown }) => ({
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

  const handleChatMessage = useCallback(async (message: string) => {
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
  }, [messageCount, chatLimitReached, analysisResult, lastSubmittedFeatures, sessionId]);

  const updateTab = (tab: 'explore' | 'analyze') => {
    setActiveTab(tab);
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('mode', tab);
    window.history.pushState({}, '', url);
  };

  const handleNavigateToSection = (section: string) => {
    if (section === 'about') {
      setIsAboutOpen(true);
      return;
    }
    if (section === 'data') {
      updateTab('explore');
      // Small timeout to allow tab switch to render before scrolling
      setTimeout(() => {
        const element = document.getElementById('data');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }
    if (section === 'analysis') {
      updateTab('analyze');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (section === 'home') {
      updateTab('explore');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default behavior for other sections if they exist in valid states
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateHome = () => {
    updateTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <Suspense fallback={null}>
        <URLStateHandler
          onOpen3D={() => setShow3DViewer(true)}
          onSelectPlanet={(planet) => {
            setSelectedPlanet(planet);
            // Update URL
            const url = new URL(window.location.href);
            if (planet) {
              url.searchParams.set('planet', planet.id);
            } else {
              url.searchParams.delete('planet');
            }
            window.history.pushState({}, '', url);
          }}
          onSetTab={setActiveTab}
        />
      </Suspense>
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

      {/* Custom Header Actions */}
      <div className="absolute top-4 right-20 z-50 flex gap-4">
        {/* We can place the About button here if needed */}
      </div>

      <div className="relative z-10 pt-24 pb-12 px-6 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 max-w-7xl mx-auto w-full flex flex-col"
        >
          {/* Hero Section - Compact */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">NASA</span> <span className="text-white">Exoplanet</span> <span className="text-gradient-cosmic">Explorer</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-4">
              Instantly analyze light curve data to detect exoplanet transits using our AI model.
              <br />Visualize confirm/false-positive signals in seconds.
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest border-t border-white/5 pt-4 inline-block px-8">
              <Activity className="w-3 h-3 inline mr-1" />
              Data Source: NASA Exoplanet Archive (Kepler & TESS) • Updated Daily via API
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex gap-2">
              <button
                onClick={() => updateTab('explore')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'explore'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Explore Data
                </span>
              </button>
              <button
                onClick={() => updateTab('analyze')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'analyze'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI Prediction
                </span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div id="data" className="flex-1 min-h-[600px] bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 p-1 md:p-6 shadow-2xl overflow-hidden relative">

            {/* Explore Tab */}
            {activeTab === 'explore' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <ExoplanetExplorer
                  onSelectPlanet={(planet) => {
                    setSelectedPlanet(planet);
                    // Update URL
                    const url = new URL(window.location.href);
                    if (planet) {
                      url.searchParams.set('planet', planet.id);
                    } else {
                      url.searchParams.delete('planet');
                    }
                    window.history.pushState({}, '', url);
                  }}
                  selectedPlanetId={selectedPlanet?.id}
                />
              </motion.div>
            )}

            {/* Analyze Tab */}
            {activeTab === 'analyze' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >

                {appState === 'landing' && (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="max-w-2xl w-full">
                      <div className="glass rounded-2xl p-8 mb-8">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">Input Kepler Light Curve Parameters</h3>
                        <TabularMVPForm onSubmit={submitTabularMVP} />
                      </div>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm mb-4">Or try sample data to see how it works</p>
                        <button
                          onClick={() => submitTabularMVP({
                            period_days: '365',
                            transit_depth_ppm: '100',
                            planet_radius_re: '1',
                            stellar_radius_rs: '1',
                            snr: '10'
                          })}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm border border-white/10 transition-colors"
                        >
                          Load Earth-like Sample
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {appState === 'analyzing' && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 mx-auto mb-8"
                      >
                        <Activity className="w-full h-full text-space-400" />
                      </motion.div>
                      <h2 className="text-3xl font-bold text-white mb-4">Analyzing Signal</h2>
                      <p className="text-gray-300">Running Random Forest Classifier...</p>
                    </div>
                  </div>
                )}

                {appState === 'results' && analysisResult && (
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid lg:grid-cols-2 gap-8 h-full">
                      {/* Results */}
                      <div>
                        <ResultsCard
                          result={analysisResult}
                          onVisualizeData={() => setShowVisualization(true)}
                        />
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => setAppState('landing')}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
                          >
                            Analyze Another Candidate
                          </button>
                        </div>
                      </div>

                      {/* Chat Interface */}
                      <div className="h-[500px] lg:h-auto">
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
                )}

              </motion.div>
            )}

          </div>

          {/* Footer Elements moved to bottom of page naturally via flex layout */}
        </motion.div>
      </div>

      {/* Footer */}
      <Footer onNavigateToSection={handleNavigateToSection} />

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

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
            selectedPlanet={selectedPlanet}
            onPlanetSelect={setSelectedPlanet}
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
