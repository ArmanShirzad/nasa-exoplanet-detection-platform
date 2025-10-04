'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Clock, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  MapPin, 
  Hash, 
  Download,
  Loader2
} from 'lucide-react';

interface ManualInputData {
  // Metadata
  targetId: string;
  raObj: string;
  decObj: string;
  keptmagTmag: string;
  
  // Stellar Parameters
  teff: string;
  logg: string;
  feh: string;
  radius: string;
  mass: string;
  
  // Time Series Data
  timeSeries: string;
  fluxSeries: string;
  fluxError: string;
  
  // Quality and Observation
  quality: string;
  sectorQuarter: string;
  camera: string;
  ccd: string;
}

interface ManualInputFormProps {
  onSubmit: (data: ManualInputData) => void;
}

const ManualInputForm: React.FC<ManualInputFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ManualInputData>({
    targetId: '',
    raObj: '',
    decObj: '',
    keptmagTmag: '',
    teff: '',
    logg: '',
    feh: '',
    radius: '',
    mass: '',
    timeSeries: '',
    fluxSeries: '',
    fluxError: '',
    quality: '0',
    sectorQuarter: '',
    camera: '',
    ccd: ''
  });

  const [expandedSections, setExpandedSections] = useState({
    metadata: true,
    stellar: false,
    timeseries: false,
    observation: false
  });

  const [isLoadingSample, setIsLoadingSample] = useState(false);

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

  const loadSampleData = async () => {
    setIsLoadingSample(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sample TESS/K2 data
    const sampleData: ManualInputData = {
      targetId: 'TIC 123456789',
      raObj: '12.345678',
      decObj: '-12.345678',
      keptmagTmag: '12.5',
      teff: '5778',
      logg: '4.44',
      feh: '0.0',
      radius: '1.0',
      mass: '1.0',
      timeSeries: '2454833.0,2454833.1,2454833.2,2454833.3,2454833.4,2454833.5,2454833.6,2454833.7,2454833.8,2454833.9',
      fluxSeries: '1.0000,0.9999,0.9998,0.9997,0.9996,0.9995,0.9994,0.9993,0.9992,0.9991',
      fluxError: '0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001',
      quality: '0',
      sectorQuarter: 'Sector 1',
      camera: '1',
      ccd: '2'
    };
    
    setFormData(sampleData);
    setIsLoadingSample(false);
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
    icon: React.ComponentType<{ className?: string }>;
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
    icon: React.ComponentType<{ className?: string }>;
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
      {/* Sample Data Button */}
      <div className="flex justify-center">
        <motion.button
          type="button"
          onClick={loadSampleData}
          disabled={isLoadingSample}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-nebula-500 to-purple-600 
                   text-white font-medium rounded-lg shadow-lg
                   hover:from-nebula-600 hover:to-purple-700
                   focus:ring-4 focus:ring-nebula-400/20
                   transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingSample ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isLoadingSample ? 'Loading Sample Data...' : 'Load Sample TESS/K2 Light Curve'}
        </motion.button>
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <SectionHeader
          title="Metadata"
          section="metadata"
          icon={Hash}
          description="Target identification and coordinates"
        />
        
        {expandedSections.metadata && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="TARGET_ID (KEPID/TIC_ID)"
                field="targetId"
                type="text"
                placeholder="e.g., TIC 123456789"
                icon={Hash}
              />
              <InputField
                label="KEPMAG/TMAG"
                field="keptmagTmag"
                type="number"
                placeholder="e.g., 12.5"
                icon={Star}
                unit="mag"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="RA_OBJ"
                field="raObj"
                type="number"
                placeholder="e.g., 12.345678"
                icon={MapPin}
                unit="degrees"
              />
              <InputField
                label="DEC_OBJ"
                field="decObj"
                type="number"
                placeholder="e.g., -12.345678"
                icon={MapPin}
                unit="degrees"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Stellar Parameters */}
      <div className="space-y-4">
        <SectionHeader
          title="Stellar Parameters"
          section="stellar"
          icon={Star}
          description="Host star characteristics"
        />
        
        {expandedSections.stellar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="TEFF"
                field="teff"
                type="number"
                placeholder="e.g., 5778"
                icon={Star}
                unit="Kelvin"
              />
              <InputField
                label="LOGG"
                field="logg"
                type="number"
                placeholder="e.g., 4.44"
                icon={Star}
                unit="dex"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="FEH"
                field="feh"
                type="number"
                placeholder="e.g., 0.0"
                icon={Star}
                unit="dex"
              />
              <InputField
                label="RADIUS"
                field="radius"
                type="number"
                placeholder="e.g., 1.0"
                icon={Star}
                unit="Solar radii"
              />
              <InputField
                label="MASS"
                field="mass"
                type="number"
                placeholder="e.g., 1.0"
                icon={Star}
                unit="Solar masses"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Time Series Data */}
      <div className="space-y-4">
        <SectionHeader
          title="Time Series Data"
          section="timeseries"
          icon={Clock}
          description="Light curve flux measurements"
        />
        
        {expandedSections.timeseries && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Clock className="w-4 h-4 text-space-400" />
                  TIME (BJD–2454833)
                  <span className="text-xs text-gray-500">(comma-separated values)</span>
                </label>
                <textarea
                  value={formData.timeSeries}
                  onChange={(e) => handleInputChange('timeSeries', e.target.value)}
                  placeholder="e.g., 2454833.0,2454833.1,2454833.2,..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg 
                           focus:border-space-400 focus:ring-2 focus:ring-space-400/20 
                           transition-all duration-200 text-white placeholder-gray-400
                           backdrop-blur-sm resize-none font-mono text-sm"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Activity className="w-4 h-4 text-space-400" />
                  PDCSAP_FLUX
                  <span className="text-xs text-gray-500">(comma-separated values)</span>
                </label>
                <textarea
                  value={formData.fluxSeries}
                  onChange={(e) => handleInputChange('fluxSeries', e.target.value)}
                  placeholder="e.g., 1.0000,0.9999,0.9998,..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg 
                           focus:border-space-400 focus:ring-2 focus:ring-space-400/20 
                           transition-all duration-200 text-white placeholder-gray-400
                           backdrop-blur-sm resize-none font-mono text-sm"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Activity className="w-4 h-4 text-space-400" />
                  PDCSAP_FLUX_ERR
                  <span className="text-xs text-gray-500">(comma-separated values)</span>
                </label>
                <textarea
                  value={formData.fluxError}
                  onChange={(e) => handleInputChange('fluxError', e.target.value)}
                  placeholder="e.g., 0.001,0.001,0.001,..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg 
                           focus:border-space-400 focus:ring-2 focus:ring-space-400/20 
                           transition-all duration-200 text-white placeholder-gray-400
                           backdrop-blur-sm resize-none font-mono text-sm"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Observation Parameters */}
      <div className="space-y-4">
        <SectionHeader
          title="Observation Parameters"
          section="observation"
          icon={Globe}
          description="Instrument and quality flags"
        />
        
        {expandedSections.observation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="QUALITY"
                field="quality"
                type="number"
                placeholder="e.g., 0"
                icon={Activity}
                unit="bit flags"
              />
              <InputField
                label="SECTOR/QUARTER"
                field="sectorQuarter"
                type="text"
                placeholder="e.g., Sector 1"
                icon={Globe}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="CAMERA"
                field="camera"
                type="number"
                placeholder="e.g., 1"
                icon={Globe}
              />
              <InputField
                label="CCD"
                field="ccd"
                type="number"
                placeholder="e.g., 2"
                icon={Globe}
              />
            </div>
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
        disabled={!formData.targetId && !formData.timeSeries && !formData.fluxSeries}
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
