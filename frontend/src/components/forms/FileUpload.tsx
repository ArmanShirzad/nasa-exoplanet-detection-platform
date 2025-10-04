'use client';

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
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
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
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
  };

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      setUploadedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect, acceptedTypes, maxSize]);

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
    setError(null);
  }, []);

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
        
        {uploadedFile ? (
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
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Remove File
            </button>
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
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <File className="w-4 h-4" />
                <span>Supports: {acceptedTypes.join(', ')} (max {maxSize}MB)</span>
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
    </div>
  );
};

export default FileUpload;
