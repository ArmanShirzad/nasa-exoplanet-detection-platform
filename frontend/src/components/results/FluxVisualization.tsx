'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface FluxVisualizationProps {
  data: number[];
  onClose: () => void;
  title?: string;
  highlightedPoints?: number[];
}

const FluxVisualization: React.FC<FluxVisualizationProps> = ({
  data,
  onClose,
  title = 'Flux Time Series',
  highlightedPoints = []
}) => {
  const [showNormalized, setShowNormalized] = useState(false);
  const [showHighlighted, setShowHighlighted] = useState(true);

  // Convert array data to chart format
  const chartData = data.map((value, index) => {
    const normalized = (value - Math.min(...data)) / (Math.max(...data) - Math.min(...data));
    const isHighlighted = highlightedPoints.includes(index);
    
    return {
      time: index,
      flux: value,
      normalized: normalized,
      highlighted: isHighlighted,
      fluxDisplay: showNormalized ? normalized : value
    };
  });

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: number }) => {
    if (active && payload && payload.length && label !== undefined) {
      const dataPoint = chartData[label];
      return (
        <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-2xl">
          <div className="space-y-2">
            <p className="text-white text-sm font-medium">
              <span className="text-space-400">Time Index:</span> {label}
            </p>
            <p className="text-white text-sm">
              <span className="text-space-400">Raw Flux:</span> {dataPoint.flux.toFixed(6)}
            </p>
            <p className="text-white text-sm">
              <span className="text-space-400">Normalized:</span> {dataPoint.normalized.toFixed(3)}
            </p>
            {dataPoint.highlighted && (
              <p className="text-xs text-yellow-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Potential Transit
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: { cx?: number; cy?: number; payload?: { highlighted: boolean } }) => {
    const { cx, cy, payload } = props;
    if (payload?.highlighted && showHighlighted) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth={2}
          className="animate-pulse"
        />
      );
    }
    return null;
  };

  const downloadData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Time,Flux,Normalized\n"
      + chartData.map(d => `${d.time},${d.flux},${d.normalized}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "flux_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-400">
              {data.length} data points • Time series analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadData}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Download Data"
            >
              <Download className="w-5 h-5 text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="normalized"
                checked={showNormalized}
                onChange={(e) => setShowNormalized(e.target.checked)}
                className="w-4 h-4 text-space-400 bg-gray-700 border-gray-600 rounded focus:ring-space-400 focus:ring-2"
              />
              <label htmlFor="normalized" className="text-sm text-gray-300">
                Show Normalized
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="highlighted"
                checked={showHighlighted}
                onChange={(e) => setShowHighlighted(e.target.checked)}
                className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
              />
              <label htmlFor="highlighted" className="text-sm text-gray-300">
                Show Transit Highlights
              </label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNormalized(false)}
              className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* Interactive Chart */}
        <div className="h-96 mb-6 bg-white/5 rounded-lg border border-white/10 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 0.001', 'dataMax + 0.001']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="fluxDisplay"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#0ea5e9' }}
              />
              {showHighlighted && (
                <Line
                  type="monotone"
                  dataKey="fluxDisplay"
                  stroke="#fbbf24"
                  strokeWidth={0}
                  dot={<CustomDot />}
                  connectNulls={false}
                />
              )}
              <ReferenceLine 
                y={showNormalized ? 0.5 : (Math.max(...data) + Math.min(...data)) / 2} 
                stroke="#6b7280" 
                strokeDasharray="2 2" 
                opacity={0.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Data Points</p>
            <p className="text-lg font-semibold text-white">{data.length}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Min Flux</p>
            <p className="text-lg font-semibold text-white">{Math.min(...data).toFixed(6)}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Max Flux</p>
            <p className="text-lg font-semibold text-white">{Math.max(...data).toFixed(6)}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Range</p>
            <p className="text-lg font-semibold text-white">
              {(Math.max(...data) - Math.min(...data)).toFixed(6)}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-space-400"></div>
            <span className="text-sm text-gray-300">Flux Data</span>
          </div>
          {showHighlighted && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Transit Highlights</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gray-500" style={{borderStyle: 'dashed'}}></div>
            <span className="text-sm text-gray-300">Reference Line</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FluxVisualization;
