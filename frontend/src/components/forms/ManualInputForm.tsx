'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Clock, Activity, ChevronDown, ChevronUp } from 'lucide-react';

interface ManualInputData {
  planetRadius: string;
  orbitalPeriod: string;
  fluxTimeSeries: string;
  stellarMass: string;
  stellarRadius: string;
  effectiveTemperature: string;
}

interface ManualInputFormProps {
  onSubmit: (data: ManualInputData) => void;
}

const ManualInputForm: React.FC<ManualInputFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ManualInputData>({
    planetRadius: '',
    orbitalPeriod: '',
    fluxTimeSeries: '',
    stellarMass: '',
    stellarRadius: '',
    effectiveTemperature: ''
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    stellar: false,
    advanced: false
  });

  const handleInputChange = (field: keyof ManualInputData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const InputField = ({ 
    label, 
    field, 
    type = 'text', 
    placeholder, 
    icon: Icon, 
    unit 
  }: {
    label: string;
    field: keyof ManualInputData;
    type?: string;
    placeholder: string;
    icon: React.ComponentType<any>;
    unit?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
        <Icon className="w-4 h-4 text-space-400" />
        {label}
        {unit && <span className="text-xs text-gray-500">({unit})</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg 
                   focus:border-space-400 focus:ring-2 focus:ring-space-400/20 
                   transition-all duration-200 text-white placeholder-gray-400
                   backdrop-blur-sm"
        />
      </div>
    </motion.div>
  );

  const SectionHeader = ({ 
    title, 
    section, 
    icon: Icon, 
    description 
  }: {
    title: string;
    section: keyof typeof expandedSections;
    icon: React.ComponentType<any>;
    description: string;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg 
               hover:bg-white/10 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-space-400 group-hover:text-space-300" />
        <div className="text-left">
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Parameters */}
      <div className="space-y-4">
        <SectionHeader
          title="Basic Parameters"
          section="basic"
          icon={Globe}
          description="Essential exoplanet detection parameters"
        />
        
        {expandedSections.basic && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <InputField
              label="Planet Radius"
              field="planetRadius"
              type="number"
              placeholder="e.g., 1.2"
              icon={Globe}
              unit="Earth radii"
            />
            <InputField
              label="Orbital Period"
              field="orbitalPeriod"
              type="number"
              placeholder="e.g., 365.25"
              icon={Clock}
              unit="days"
            />
          </motion.div>
        )}
      </div>

      {/* Stellar Parameters */}
      <div className="space-y-4">
        <SectionHeader
          title="Stellar Parameters"
          section="stellar"
          icon={Activity}
          description="Host star characteristics"
        />
        
        {expandedSections.stellar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <InputField
              label="Stellar Mass"
              field="stellarMass"
              type="number"
              placeholder="e.g., 1.0"
              icon={Activity}
              unit="Solar masses"
            />
            <InputField
              label="Stellar Radius"
              field="stellarRadius"
              type="number"
              placeholder="e.g., 1.0"
              icon={Activity}
              unit="Solar radii"
            />
            <InputField
              label="Effective Temperature"
              field="effectiveTemperature"
              type="number"
              placeholder="e.g., 5778"
              icon={Activity}
              unit="Kelvin"
            />
          </motion.div>
        )}
      </div>

      {/* Advanced Parameters */}
      <div className="space-y-4">
        <SectionHeader
          title="Advanced Parameters"
          section="advanced"
          icon={Activity}
          description="Flux time series data"
        />
        
        {expandedSections.advanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Activity className="w-4 h-4 text-space-400" />
                Flux Time Series
                <span className="text-xs text-gray-500">(JSON array or CSV format)</span>
              </label>
              <textarea
                value={formData.fluxTimeSeries}
                onChange={(e) => handleInputChange('fluxTimeSeries', e.target.value)}
                placeholder="Enter flux time series data as JSON array or CSV format..."
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg 
                         focus:border-space-400 focus:ring-2 focus:ring-space-400/20 
                         transition-all duration-200 text-white placeholder-gray-400
                         backdrop-blur-sm resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Example: [1.0, 0.999, 0.998, 1.001, 1.0, ...] or CSV format
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 px-6 bg-gradient-to-r from-space-500 to-nebula-500 
                 text-white font-semibold rounded-lg shadow-lg
                 hover:from-space-600 hover:to-nebula-600
                 focus:ring-4 focus:ring-space-400/20
                 transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!formData.planetRadius && !formData.orbitalPeriod && !formData.fluxTimeSeries}
      >
        <span className="flex items-center justify-center gap-2">
          <Activity className="w-5 h-5" />
          Analyze with AI
        </span>
      </motion.button>
    </motion.form>
  );
};

export default ManualInputForm;
