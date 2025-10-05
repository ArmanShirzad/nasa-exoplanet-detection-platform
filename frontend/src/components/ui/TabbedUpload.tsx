'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Table, ActivitySquare } from 'lucide-react';
import FileUpload from '@/components/forms/FileUpload';

type UploadTab = 'tabular' | 'lightcurve';

interface TabbedUploadProps {
  onFileSelect?: (file: File) => void;
}

const TabbedUpload: React.FC<TabbedUploadProps> = ({ onFileSelect }) => {
  const [activeTab, setActiveTab] = useState<UploadTab>('tabular');

  const sampleHref = activeTab === 'tabular'
    ? '/sample_tabular.csv'
    : '/sample_lightcurve.csv';

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('tabular')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'tabular'
              ? 'bg-gradient-to-r from-space-500 to-nebula-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          <Table className="w-4 h-4" />
          Tabular CSV Upload
        </button>
        <button
          onClick={() => setActiveTab('lightcurve')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'lightcurve'
              ? 'bg-gradient-to-r from-space-500 to-nebula-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          <ActivitySquare className="w-4 h-4" />
          Light Curve CSV Upload
        </button>
        <a
          href={sampleHref}
          download
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-space-500/20 hover:bg-space-500/30 text-space-300 transition-colors"
        >
          <Download className="w-4 h-4" />
          Sample data
        </a>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {activeTab === 'tabular' ? (
            <FileUpload onFileSelect={(f) => onFileSelect?.(f)} acceptedTypes={[ '.csv' ]} hideSampleButton />
          ) : (
            <FileUpload onFileSelect={(f) => onFileSelect?.(f)} acceptedTypes={[ '.csv' ]} hideSampleButton />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TabbedUpload;


