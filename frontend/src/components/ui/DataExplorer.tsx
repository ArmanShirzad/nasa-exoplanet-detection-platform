'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Filter, Download, Eye, Globe } from 'lucide-react';
import InfoTooltip from './Tooltip';
import Simple3DViewer from '../visualization/Simple3DViewer';

interface DataColumn {
  id: string;
  label: string;
  description: string;
  category: 'time' | 'flux' | 'metadata' | 'coordinates' | 'stellar' | 'observation';
  type: 'number' | 'text' | 'flag';
}

const dataColumns: DataColumn[] = [
  {
    id: 'time',
    label: 'TIME (BJD–2454833)',
    description: 'Your X-axis for every light curve—corrected to the solar system barycenter for perfect timing.',
    category: 'time',
    type: 'number'
  },
  {
    id: 'pdcsap_flux',
    label: 'PDCSAP_FLUX',
    description: 'Systematics-corrected stellar brightness (electrons/sec)—the clean signal where transit dips hide.',
    category: 'flux',
    type: 'number'
  },
  {
    id: 'pdcsap_flux_err',
    label: 'PDCSAP_FLUX_ERR',
    description: 'Uncertainty in PDCSAP_FLUX—essential for weighting detections and reducing false positives.',
    category: 'flux',
    type: 'number'
  },
  {
    id: 'sap_flux',
    label: 'SAP_FLUX',
    description: 'Raw aperture flux—see the unfiltered light before Hubble-style clean-up.',
    category: 'flux',
    type: 'number'
  },
  {
    id: 'sap_flux_err',
    label: 'SAP_FLUX_ERR',
    description: 'Uncertainty in raw flux—spot noisy outliers and artifacts.',
    category: 'flux',
    type: 'number'
  },
  {
    id: 'normalized_flux',
    label: 'NORMALIZED_FLUX',
    description: 'Flux scaled to its median—perfect for comparing stars of all brightness.',
    category: 'flux',
    type: 'number'
  },
  {
    id: 'quality',
    label: 'QUALITY',
    description: 'Bit-packed flags—filter out cosmic rays, thruster fires, and anomalies with one click.',
    category: 'observation',
    type: 'flag'
  },
  {
    id: 'target_id',
    label: 'TARGET_ID (KEPID/TIC_ID)',
    description: 'Unique identifier—cross-match with catalogs and Gaia coordinates.',
    category: 'metadata',
    type: 'text'
  },
  {
    id: 'ra_obj',
    label: 'RA_OBJ / DEC_OBJ',
    description: 'Sky coordinates—pinpoint your star in the galaxy.',
    category: 'coordinates',
    type: 'number'
  },
  {
    id: 'keptmag_tmag',
    label: 'KEPMAG/TMAG',
    description: 'Stellar magnitude—understand brightness selection effects at a glance.',
    category: 'stellar',
    type: 'number'
  },
  {
    id: 'teff_logg_feh',
    label: 'TEFF, LOGG, FEH',
    description: 'Stellar temperature, gravity, and metallicity—characterize your host star for habitability insights.',
    category: 'stellar',
    type: 'number'
  },
  {
    id: 'radius_mass',
    label: 'RADIUS, MASS',
    description: 'Stellar radius and mass—convert transit depths into planet sizes and masses.',
    category: 'stellar',
    type: 'number'
  },
  {
    id: 'sector_quarter_camera_ccd',
    label: 'SECTOR/QUARTER, CAMERA, CCD',
    description: 'Observing season and instrument details—track long-term trends and seasonal systematics.',
    category: 'observation',
    type: 'text'
  }
];

const categoryColors = {
  time: 'from-blue-500 to-blue-600',
  flux: 'from-green-500 to-green-600',
  metadata: 'from-purple-500 to-purple-600',
  coordinates: 'from-orange-500 to-orange-600',
  stellar: 'from-pink-500 to-pink-600',
  observation: 'from-cyan-500 to-cyan-600'
};

const categoryIcons = {
  time: '⏱️',
  flux: '📊',
  metadata: '🏷️',
  coordinates: '📍',
  stellar: '⭐',
  observation: '🔭'
};

export default function DataExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showQualityFilter, setShowQualityFilter] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);

  const filteredColumns = selectedCategory 
    ? dataColumns.filter(col => col.category === selectedCategory)
    : dataColumns;

  const categories = Array.from(new Set(dataColumns.map(col => col.category)));

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Meet the Data</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover worlds beyond our solar system with the same tools NASA uses! Hover over any column to learn more:
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-space-500 to-nebula-500 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            All Columns
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-space-500 to-nebula-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {categoryIcons[category as keyof typeof categoryIcons]} {category}
            </button>
          ))}
        </motion.div>

        {/* Quality Filter Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={() => setShowQualityFilter(!showQualityFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showQualityFilter
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter by QUALITY flags
          </button>
        </motion.div>

        {/* Data Columns Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredColumns.map((column, index) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${categoryColors[column.category]} flex items-center justify-center text-white text-lg`}>
                    {categoryIcons[column.category]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm leading-tight">
                      {column.label}
                    </h3>
                    <span className="text-xs text-gray-400 capitalize">
                      {column.category} • {column.type}
                    </span>
                  </div>
                </div>
                <InfoTooltip content={column.description}>
                  <div></div>
                </InfoTooltip>
              </div>
              
              <div className="space-y-2">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + 0.1 * index, duration: 1 }}
                    className={`h-full bg-gradient-to-r ${categoryColors[column.category]} rounded-full`}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {column.type === 'number' ? 'Numeric data' : 
                   column.type === 'text' ? 'Text identifier' : 
                   'Bit flags'}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 3D Exoplanet Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Explore Exoplanets in 3D</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Visualize known exoplanets in 3D space and explore their properties. 
              Click on planets to learn more about their characteristics and habitability.
            </p>
          </div>
          
          <div className="glass rounded-2xl p-6">
            <Simple3DViewer 
              className="w-full"
              onPlanetSelect={(planet) => {
                console.log('Selected planet:', planet);
              }}
            />
          </div>
        </motion.div>

        {/* Sample Data Download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <Database className="w-12 h-12 text-space-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Try Sample Data</h3>
            <p className="text-gray-300 mb-6">
              Download a sample TESS light curve to explore the data structure and test the analysis pipeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-space-500 to-nebula-500 text-white rounded-lg hover:from-space-600 hover:to-nebula-600 transition-all duration-200">
                <Download className="w-4 h-4" />
                Download Sample CSV
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all duration-200">
                <Eye className="w-4 h-4" />
                Preview Data
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quality Filter Info */}
        <AnimatePresence>
          {showQualityFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 glass rounded-2xl p-6"
            >
              <h4 className="text-lg font-semibold text-white mb-4">Quality Flag Filtering</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-space-400 mb-2">Common Quality Flags:</h5>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Attitude tweaks (flag = 1)</li>
                    <li>• Safe mode (flag = 2)</li>
                    <li>• Coarse point (flag = 4)</li>
                    <li>• Earth point (flag = 8)</li>
                    <li>• Argabrightening (flag = 16)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-nebula-400 mb-2">Usage Tips:</h5>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Filter out flagged points for clean analysis</li>
                    <li>• Keep flagged data for anomaly detection</li>
                    <li>• Combine multiple flags with bitwise OR</li>
                    <li>• Check mission-specific documentation</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
