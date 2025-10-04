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

interface ResultsCardProps {
  result: AnalysisResult;
  onVisualizeData?: (data: number[]) => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, onVisualizeData }) => {
  const [expandedSections, setExpandedSections] = useState({
    explanation: true,
    details: false,
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
    icon: React.ComponentType<any>;
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

      {/* Detailed Analysis */}
      {result.details && (
        <div className="space-y-4">
          <SectionHeader
            title="Detailed Analysis"
            section="details"
            icon={BarChart3}
            badge="Advanced"
          />
          
          <AnimatePresence>
            {expandedSections.details && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10"
              >
                {/* Key Factors */}
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-space-400" />
                    Key Factors
                  </h4>
                  <ul className="space-y-2">
                    {result.details.keyFactors.map((factor, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-space-400 mt-2 flex-shrink-0" />
                        {factor}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Statistical Significance */}
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-space-400" />
                    Statistical Significance
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.details.statisticalSignificance}%` }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="h-2 bg-gradient-to-r from-space-400 to-nebula-400 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-space-300">
                      {result.details.statisticalSignificance}%
                    </span>
                  </div>
                </div>

                {/* Alternative Hypotheses */}
                {result.details.alternativeHypotheses.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-3">Alternative Hypotheses</h4>
                    <ul className="space-y-2">
                      {result.details.alternativeHypotheses.map((hypothesis, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-gray-500">•</span>
                          {hypothesis}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {result.details.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {result.details.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Data Visualization */}
      {result.fluxData && onVisualizeData && (
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
                  Visualize the flux time series data to better understand the detection pattern.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onVisualizeData(result.fluxData!)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-space-500 to-nebula-500 
                           text-white font-semibold rounded-lg shadow-lg
                           hover:from-space-600 hover:to-nebula-600
                           focus:ring-4 focus:ring-space-400/20
                           transition-all duration-200
                           flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  Show Flux Visualization
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default ResultsCard;
