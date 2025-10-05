'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, Eye, Download, FileText, Database } from 'lucide-react';

interface ParsedData {
  headers: string[];
  rows: unknown[][];
  preview: Record<string, unknown>[];
  fileType: 'csv' | 'json';
  metadata?: {
    totalRows: number;
    columns: number;
  };
}

interface FileUploadProps {
  onFileSelect: (file: File, parsedData?: ParsedData) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = ['.csv', '.json'],
  maxSize = 10
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const validateFile = useCallback((file: File): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = acceptedTypes.includes(fileExtension);
    const isValidSize = file.size <= maxSize * 1024 * 1024;

    if (!isValidType) {
      setError(`Please upload a file with one of these extensions: ${acceptedTypes.join(', ')}`);
      return false;
    }

    if (!isValidSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    setError(null);
    return true;
  }, [acceptedTypes, maxSize]);

  const parseFile = async (file: File): Promise<ParsedData | null> => {
    try {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const content = await file.text();

      if (fileExtension === '.csv') {
        const lines = content.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const rows = lines.slice(1, 11).map(line => 
          line.split(',').map(cell => cell.trim().replace(/"/g, ''))
        );
        
        return {
          headers,
          rows,
          preview: rows.map(row => {
            const obj: Record<string, unknown> = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          }),
          fileType: 'csv',
          metadata: {
            totalRows: lines.length - 1,
            columns: headers.length
          }
        };
      } else if (fileExtension === '.json') {
        const jsonData = JSON.parse(content);
        
        // Handle array of objects
        if (Array.isArray(jsonData)) {
          const headers = Object.keys(jsonData[0] || {});
          const preview = jsonData.slice(0, 10);
          const rows = preview.map(item => headers.map(header => item[header]));
          
          return {
            headers,
            rows,
            preview,
            fileType: 'json',
            metadata: {
              totalRows: jsonData.length,
              columns: headers.length
            }
          };
        } else {
          // Handle single object
          const headers = Object.keys(jsonData);
          const rows = [headers.map(header => jsonData[header])];
          
          return {
            headers,
            rows,
            preview: [jsonData],
            fileType: 'json',
            metadata: {
              totalRows: 1,
              columns: headers.length
            }
          };
        }
      }
      
      return null;
    } catch {
      setError('Failed to parse file. Please check the file format.');
      return null;
    }
  };

  const handleFile = useCallback(async (file: File) => {
    if (validateFile(file)) {
      setIsParsing(true);
      setError(null);
      
      const parsed = await parseFile(file);
      
      if (parsed) {
        setUploadedFile(file);
        setParsedData(parsed);
        onFileSelect(file, parsed);
      }
      
      setIsParsing(false);
    }
  }, [onFileSelect, validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setParsedData(null);
    setShowPreview(false);
    setError(null);
  }, []);

  const loadSampleData = useCallback(() => {
    // Create sample TESS data
    const sampleData = {
      TIME: [2454833.0, 2454833.1, 2454833.2, 2454833.3, 2454833.4],
      PDCSAP_FLUX: [1.0, 0.99, 0.98, 0.99, 1.0],
      PDCSAP_FLUX_ERR: [0.001, 0.001, 0.001, 0.001, 0.001],
      TARGET_ID: ['TIC123456789', 'TIC123456789', 'TIC123456789', 'TIC123456789', 'TIC123456789'],
      QUALITY: [0, 0, 0, 0, 0]
    };

    const csvContent = [
      Object.keys(sampleData).join(','),
      ...Array.from({ length: 5 }, (_, i) => 
        Object.values(sampleData).map(col => col[i]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    // Create a file-like object for the sample data
    const sampleFile = Object.assign(blob, {
      name: 'sample_tess_data.csv',
      type: 'text/csv',
      size: blob.size
    }) as File;
    
    handleFile(sampleFile);
  }, [handleFile]);

  return (
    <div className="w-full">
      <motion.div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-space-400 bg-space-400/10 scale-105' 
            : 'border-gray-600 hover:border-space-400 hover:bg-space-400/5'
          }
          ${uploadedFile ? 'border-green-400 bg-green-400/10' : ''}
          ${error ? 'border-red-400 bg-red-400/10' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {isParsing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Database className="w-12 h-12 text-space-400 mx-auto" />
            </motion.div>
            <div>
              <p className="text-lg font-semibold text-space-400">Parsing File...</p>
              <p className="text-sm text-gray-300 mt-1">Analyzing data structure</p>
            </div>
          </motion.div>
        ) : uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
            <div>
              <p className="text-lg font-semibold text-green-400">File Uploaded Successfully!</p>
              <p className="text-sm text-gray-300 mt-1">{uploadedFile.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {parsedData?.metadata?.totalRows} rows • {parsedData?.metadata?.columns} columns
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide' : 'Preview'} Data
              </button>
              <button
                onClick={removeFile}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Remove File
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              animate={{ 
                rotate: isDragOver ? 360 : 0,
                scale: isDragOver ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <Upload className="w-12 h-12 text-space-400 mx-auto" />
            </motion.div>
            
            <div>
              <p className="text-lg font-semibold text-white mb-2">
                Drop your data file here
              </p>
              <p className="text-sm text-gray-400 mb-4">
                or click to browse files
              </p>
              <div className="flex flex-col items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4" />
                  <span>Supports: {acceptedTypes.join(', ')} (max {maxSize}MB)</span>
                </div>
                <button
                  onClick={loadSampleData}
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs bg-space-500/20 hover:bg-space-500/30 text-space-400 rounded-lg transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Load Sample TESS Data
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-400/10 border border-red-400/20 rounded-lg"
        >
          <p className="text-sm text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Data Preview */}
      <AnimatePresence>
        {showPreview && parsedData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Data Preview ({parsedData.fileType.toUpperCase()})
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{parsedData.metadata?.totalRows} total rows</span>
                <span>•</span>
                <span>{parsedData.metadata?.columns} columns</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {parsedData.headers.map((header, index) => (
                      <th key={index} className="text-left py-2 px-3 text-space-400 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.preview.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-white/5 hover:bg-white/5">
                      {parsedData.headers.map((header, colIndex) => (
                        <td key={colIndex} className="py-2 px-3 text-gray-300">
                          {row[header] !== undefined ? String(row[header]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {parsedData.metadata && parsedData.metadata.totalRows > 10 && (
              <p className="text-xs text-gray-400 mt-3 text-center">
                Showing first 10 rows of {parsedData.metadata.totalRows} total rows
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;

