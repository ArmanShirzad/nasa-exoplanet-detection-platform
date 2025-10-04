'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';

interface FluxVisualizationProps {
  data: number[];
  onClose: () => void;
  title?: string;
}

const FluxVisualization: React.FC<FluxVisualizationProps> = ({
  data,
  onClose,
  title = 'Flux Time Series'
}) => {
  // Convert array data to chart format
  const chartData = data.map((value, index) => ({
    time: index,
    flux: value,
    normalized: (value - Math.min(...data)) / (Math.max(...data) - Math.min(...data))
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3">
          <p className="text-white text-sm">
            <span className="text-space-400">Time:</span> {label}
          </p>
          <p className="text-white text-sm">
            <span className="text-space-400">Flux:</span> {payload[0].value.toFixed(6)}
          </p>
          <p className="text-white text-sm">
            <span className="text-space-400">Normalized:</span> {payload[1].value.toFixed(3)}
          </p>
        </div>
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

        {/* Simple Chart Placeholder */}
        <div className="h-96 mb-6 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-space-400 to-nebula-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">📊</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Flux Time Series Chart</h4>
            <p className="text-gray-400 text-sm">
              Interactive chart visualization would be displayed here
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-0.5 bg-space-400"></div>
                <span className="text-sm text-gray-300">Raw Flux Data</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-0.5 bg-nebula-400"></div>
                <span className="text-sm text-gray-300">Normalized Data</span>
              </div>
            </div>
          </div>
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
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-space-400"></div>
            <span className="text-sm text-gray-300">Raw Flux</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-nebula-400"></div>
            <span className="text-sm text-gray-300">Normalized</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FluxVisualization;
