'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  BarChart3, 
  Info, 
  Star,
  Activity,
  TrendingUp
} from 'lucide-react';

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

interface ResultsCardProps {
  result: AnalysisResult;
  onVisualizeData?: (data: number[]) => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, onVisualizeData }) => {
  const [expandedSections, setExpandedSections] = useState({
    explanation: true,
    features: false,
    visualization: false
  });

  const isExoplanet = result.verdict === 'Exoplanet Detected';
  const confidenceColor = result.confidence >= 80 ? 'text-green-400' : 
                         result.confidence >= 60 ? 'text-yellow-400' : 'text-red-400';

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ 
    title, 
    section, 
    icon: Icon, 
    badge 
  }: {
    title: string;
    section: keyof typeof expandedSections;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg 
               hover:bg-white/10 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-space-400 group-hover:text-space-300" />
        <span className="font-semibold text-white">{title}</span>
        {badge && (
          <span className="px-2 py-1 text-xs bg-space-400/20 text-space-300 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Verdict Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`
          relative overflow-hidden rounded-2xl p-8 text-center
          ${isExoplanet 
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30' 
            : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-400/30'
          }
          backdrop-blur-sm
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="relative z-10"
        >
          {isExoplanet ? (
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          )}
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {result.verdict}
            {isExoplanet ? ' ✅' : ' ❌'}
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 text-cosmic-400" />
            <span className={`text-lg font-semibold ${confidenceColor}`}>
              {result.confidence}% Confidence
            </span>
          </div>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ delay: 0.6, duration: 1 }}
            className={`
              h-2 rounded-full mx-auto
              ${isExoplanet ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-red-400 to-rose-400'}
            `}
          />
        </motion.div>
      </motion.div>

      {/* Explanation Section */}
      <div className="space-y-4">
        <SectionHeader
          title="Analysis Explanation"
          section="explanation"
          icon={Info}
        />
        
        <AnimatePresence>
          {expandedSections.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <p className="text-gray-300 leading-relaxed">
                {result.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Importance Analysis */}
      <div className="space-y-4">
        <SectionHeader
          title="Feature Importance Analysis"
          section="features"
          icon={BarChart3}
          badge="Explainable AI"
        />
        
        <AnimatePresence>
          {expandedSections.features && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              {/* Feature Importance Bars */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-space-400" />
                  Top Feature Contributions
                </h4>
                {result.feature_importances.slice(0, 8).map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">
                        {feature.feature}
                      </span>
                      <span className="text-sm text-space-400">
                        {(feature.importance * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${feature.importance * 100}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          className="h-2 bg-gradient-to-r from-space-400 to-nebula-400 rounded-full"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {feature.detail}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Why this verdict section */}
              <div className="mt-6 p-4 glass rounded-lg border border-white/10">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-space-400" />
                  Why this verdict?
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  The AI model analyzed multiple features to reach this conclusion. The top contributing factors are shown above, 
                  with their relative importance in the final decision. This explainable approach helps you understand 
                  the reasoning behind the detection result.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Activity className="w-3 h-3" />
                  <span>
                    Based on {result.feature_importances.length} analyzed features with confidence {result.confidence}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data Visualization */}
      {result.annotated_timeseries && onVisualizeData && (
        <div className="space-y-4">
          <SectionHeader
            title="Data Visualization"
            section="visualization"
            icon={BarChart3}
            badge="Interactive"
          />
          
          <AnimatePresence>
            {expandedSections.visualization && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <p className="text-gray-300 mb-4">
                  Visualize the annotated time series data to see highlighted transit windows and model fits.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onVisualizeData(result.annotated_timeseries!.map(p => p.flux))}
                    className="py-3 px-4 bg-gradient-to-r from-space-500 to-nebula-500 
                             text-white font-semibold rounded-lg shadow-lg
                             hover:from-space-600 hover:to-nebula-600
                             focus:ring-4 focus:ring-space-400/20
                             transition-all duration-200
                             flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Show Flux Chart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Download results as JSON
                      const dataStr = JSON.stringify(result, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'exoplanet_analysis_results.json';
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="py-3 px-4 bg-gradient-to-r from-nebula-500 to-purple-600 
                             text-white font-semibold rounded-lg shadow-lg
                             hover:from-nebula-600 hover:to-purple-700
                             focus:ring-4 focus:ring-nebula-400/20
                             transition-all duration-200
                             flex items-center justify-center gap-2"
                  >
                    <Activity className="w-5 h-5" />
                    Download Results
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default ResultsCard;
